/**
 * Phase 2: Update type definitions
 *
 * Transforms:
 * - Replace Type.ComponentProps with Uniform.ComponentProps
 * - Replace ComponentProps (without namespace) with Uniform.ComponentProps
 * - Map to auto-generated Components.*Parameters and Components.*Slots types where available
 * - Add TODO comments for components without auto-generated types
 * - Transform types in both component files and index.ts files
 */

import type { API, FileInfo, Options, TSType, TSTypeReference } from 'jscodeshift';
import { shouldIgnoreFile, getComponentNameFromPath, getComponentInfo, isCanvasComponent } from '../utils/ast-helpers';

export const parser = 'tsx';

export default function transformer(file: FileInfo, api: API, options: Options): string | null {
  // Skip files in node_modules and build directories
  if (shouldIgnoreFile(file.path)) {
    return null;
  }

  const j = api.jscodeshift;
  const root = j(file.source);
  let modified = false;

  const componentName = getComponentNameFromPath(file.path, j, root);

  // Check if this is a test fixture
  const isTestFixture = file.path.includes('__testfixtures__');

  // Only transform Canvas components (skip check for test fixtures)
  if (!isTestFixture && !isCanvasComponent(componentName)) {
    return null;
  }

  const componentInfo = getComponentInfo(componentName, file.path);

  /**
   * Helper: Create Uniform.ComponentProps type reference
   */
  function createUniformComponentPropsType(parametersType: TSType, slotsType?: TSType | null): TSTypeReference {
    const typeParams = [parametersType];

    if (slotsType) {
      typeParams.push(slotsType);
    }

    return j.tsTypeReference(
      j.tsQualifiedName(j.identifier('Uniform'), j.identifier('ComponentProps')),
      j.tsTypeParameterInstantiation(typeParams as any)
    );
  }

  /**
   * Helper: Create Components.{TypeName}Parameters type reference
   */
  function createComponentsParametersType(typeName: string): TSTypeReference {
    return j.tsTypeReference(j.tsQualifiedName(j.identifier('Components'), j.identifier(`${typeName}Parameters`)));
  }

  /**
   * Helper: Create Components.{TypeName}Slots type reference
   */
  function createComponentsSlotsType(typeName: string): TSTypeReference {
    return j.tsTypeReference(j.tsQualifiedName(j.identifier('Components'), j.identifier(`${typeName}Slots`)));
  }

  /**
   * Transform type alias declarations
   * e.g., type Props = ComponentProps<...>
   */
  root.find(j.TSTypeAliasDeclaration).forEach(path => {
    const typeAnnotation = path.node.typeAnnotation;

    // Check for ComponentProps usage (with or without namespace)
    if (
      typeAnnotation.type === 'TSTypeReference' &&
      typeAnnotation.typeName &&
      (typeAnnotation.typeName.type === 'TSQualifiedName' || typeAnnotation.typeName.type === 'Identifier')
    ) {
      let isComponentProps = false;
      let currentNamespace: string | null = null;

      // Check for Type.ComponentProps or Canvas.ComponentProps or Uniform.ComponentProps
      if (typeAnnotation.typeName.type === 'TSQualifiedName') {
        const left = (typeAnnotation.typeName.left as any).name as string;
        const right = (typeAnnotation.typeName.right as any).name as string;

        if (right === 'ComponentProps' && (left === 'Type' || left === 'Canvas' || left === 'Uniform')) {
          isComponentProps = true;
          currentNamespace = left;
        }
      }

      // Check for bare ComponentProps (no namespace)
      if (typeAnnotation.typeName.type === 'Identifier' && typeAnnotation.typeName.name === 'ComponentProps') {
        isComponentProps = true;
        currentNamespace = null;
      }

      if (isComponentProps) {
        const typeParams = typeAnnotation.typeParameters;
        let parametersType: TSType | null = null;
        let slotsType: TSType | null = null;

        // Extract existing type parameters
        if (typeParams && typeParams.params) {
          parametersType = typeParams.params[0];
          slotsType = typeParams.params[1] || null;
        }

        // If we have auto-generated types, use them
        if (componentInfo && componentInfo.hasParameters) {
          parametersType = createComponentsParametersType(componentInfo.typeName);

          // Check if component has slots
          if (componentInfo.hasSlots) {
            slotsType = createComponentsSlotsType(componentInfo.typeName);
          } else {
            slotsType = null; // Remove slots if auto-generated type doesn't have them
          }

          // Replace with Uniform.ComponentProps<Components.XxxParameters, Components.XxxSlots>
          path.node.typeAnnotation = createUniformComponentPropsType(parametersType, slotsType);
          modified = true;
        } else {
          // No auto-generated types - keep inline types but change namespace to Uniform
          // Add TODO comment
          const todoComment = j.commentBlock(
            ` TODO: No auto-generated types found for ${componentName}. Using inline types. `,
            true,
            false
          );

          if (!path.node.comments) {
            path.node.comments = [];
          }
          path.node.comments.push(todoComment);

          // Change to Uniform.ComponentProps
          if (parametersType) {
            path.node.typeAnnotation = createUniformComponentPropsType(parametersType, slotsType);
            modified = true;
          }
        }
      }
    }
  });

  /**
   * Transform exported type declarations
   * e.g., export type Props = ComponentProps<...>
   */
  root.find(j.ExportNamedDeclaration).forEach(path => {
    const declaration = path.node.declaration;

    if (declaration && declaration.type === 'TSTypeAliasDeclaration') {
      const typeAnnotation = declaration.typeAnnotation;

      // Same logic as above for type alias declarations
      if (
        typeAnnotation.type === 'TSTypeReference' &&
        typeAnnotation.typeName &&
        (typeAnnotation.typeName.type === 'TSQualifiedName' || typeAnnotation.typeName.type === 'Identifier')
      ) {
        let isComponentProps = false;

        // Check for qualified names (Type.ComponentProps, etc.)
        if (typeAnnotation.typeName.type === 'TSQualifiedName') {
          const right = (typeAnnotation.typeName.right as any).name as string;
          const left = (typeAnnotation.typeName.left as any).name as string;

          if (right === 'ComponentProps' && (left === 'Type' || left === 'Canvas' || left === 'Uniform')) {
            isComponentProps = true;
          }
        }

        // Check for bare ComponentProps
        if (typeAnnotation.typeName.type === 'Identifier' && typeAnnotation.typeName.name === 'ComponentProps') {
          isComponentProps = true;
        }

        if (isComponentProps) {
          const typeParams = typeAnnotation.typeParameters;
          let parametersType: TSType | null = null;
          let slotsType: TSType | null = null;

          if (typeParams && typeParams.params) {
            parametersType = typeParams.params[0];
            slotsType = typeParams.params[1] || null;
          }

          // If we have auto-generated types, use them
          if (componentInfo && componentInfo.hasParameters) {
            parametersType = createComponentsParametersType(componentInfo.typeName);

            if (componentInfo.hasSlots) {
              slotsType = createComponentsSlotsType(componentInfo.typeName);
            } else {
              slotsType = null;
            }

            declaration.typeAnnotation = createUniformComponentPropsType(parametersType, slotsType);
            modified = true;
          } else {
            // No auto-generated types
            const todoComment = j.commentBlock(
              ` TODO: No auto-generated types found for ${componentName}. Using inline types. `,
              true,
              false
            );

            if (!declaration.comments) {
              declaration.comments = [];
            }
            declaration.comments.push(todoComment);

            if (parametersType) {
              declaration.typeAnnotation = createUniformComponentPropsType(parametersType, slotsType);
              modified = true;
            }
          }
        }
      }
    }
  });

  /**
   * Transform inline parameter type annotations: ({...}: ComponentProps<...>) => ...
   */
  root.find(j.VariableDeclarator).forEach(path => {
    const init = path.node.init;

    if (!init) return;

    // Check for arrow functions with typed parameters
    if (init.type === 'ArrowFunctionExpression' && init.params.length > 0) {
      const firstParam = init.params[0];

      // Check if first parameter is an object pattern with type annotation
      if (firstParam.type === 'ObjectPattern' && (firstParam as any).typeAnnotation) {
        const typeAnnotation = (firstParam as any).typeAnnotation.typeAnnotation;

        // Check if it's ComponentProps
        if (typeAnnotation.type === 'TSTypeReference' && typeAnnotation.typeName) {
          let isComponentProps = false;

          // Check for Type.ComponentProps, Canvas.ComponentProps, Uniform.ComponentProps
          if (typeAnnotation.typeName.type === 'TSQualifiedName') {
            const left = (typeAnnotation.typeName.left as any).name;
            const right = typeAnnotation.typeName.right.name;

            if (right === 'ComponentProps' && (left === 'Type' || left === 'Canvas' || left === 'Uniform')) {
              isComponentProps = true;
            }
          }

          // Check for bare ComponentProps
          if (typeAnnotation.typeName.type === 'Identifier' && typeAnnotation.typeName.name === 'ComponentProps') {
            isComponentProps = true;
          }

          if (isComponentProps) {
            const typeParams = typeAnnotation.typeParameters;
            let parametersType: TSType | null = null;
            let slotsType: TSType | null = null;

            if (typeParams && typeParams.params) {
              parametersType = typeParams.params[0];
              slotsType = typeParams.params[1] || null;
            }

            // If we have auto-generated types, use them
            if (componentInfo && componentInfo.hasParameters) {
              parametersType = createComponentsParametersType(componentInfo.typeName);

              if (componentInfo.hasSlots) {
                slotsType = createComponentsSlotsType(componentInfo.typeName);
              } else {
                slotsType = null;
              }

              (firstParam as any).typeAnnotation.typeAnnotation = createUniformComponentPropsType(
                parametersType,
                slotsType
              );
              modified = true;
            } else {
              // No auto-generated types - update namespace to Uniform
              if (parametersType) {
                (firstParam as any).typeAnnotation.typeAnnotation = createUniformComponentPropsType(
                  parametersType,
                  slotsType
                );
                modified = true;
              }
            }
          }
        }
      }
    }
  });

  /**
   * Transform inline FC<ComponentProps<...>> declarations
   */
  root.find(j.VariableDeclarator).forEach(path => {
    const init = path.node.init;

    if (!init) return;

    // Check for arrow functions or function expressions with type annotations
    if (
      (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression') &&
      path.node.id &&
      (path.node.id as any).typeAnnotation
    ) {
      const typeAnnotation = (path.node.id as any).typeAnnotation.typeAnnotation;

      if (typeAnnotation.type === 'TSTypeReference') {
        // Check for React.FC or FC
        const fcTypeName = typeAnnotation.typeName;
        const isFCType =
          (fcTypeName.type === 'Identifier' && fcTypeName.name === 'FC') ||
          (fcTypeName.type === 'TSQualifiedName' && fcTypeName.right.name === 'FC');

        if (isFCType && typeAnnotation.typeParameters) {
          const propsType = typeAnnotation.typeParameters.params[0];

          // Check if it's Type.ComponentProps or Canvas.ComponentProps or bare ComponentProps
          let isComponentProps = false;

          if (propsType.type === 'TSTypeReference') {
            if (propsType.typeName.type === 'TSQualifiedName') {
              const left = (propsType.typeName.left as any).name;
              const right = propsType.typeName.right.name;

              if (right === 'ComponentProps' && (left === 'Type' || left === 'Canvas' || left === 'Uniform')) {
                isComponentProps = true;
              }
            }

            if (propsType.typeName.type === 'Identifier' && propsType.typeName.name === 'ComponentProps') {
              isComponentProps = true;
            }
          }

          if (isComponentProps) {
            const typeParams = propsType.typeParameters;
            let parametersType: TSType | null = null;
            let slotsType: TSType | null = null;

            if (typeParams && typeParams.params) {
              parametersType = typeParams.params[0];
              slotsType = typeParams.params[1] || null;
            }

            // If we have auto-generated types, use them
            if (componentInfo && componentInfo.hasParameters) {
              parametersType = createComponentsParametersType(componentInfo.typeName);

              if (componentInfo.hasSlots) {
                slotsType = createComponentsSlotsType(componentInfo.typeName);
              } else {
                slotsType = null;
              }

              typeAnnotation.typeParameters.params[0] = createUniformComponentPropsType(parametersType, slotsType);
              modified = true;
            } else {
              // No auto-generated types
              if (parametersType) {
                typeAnnotation.typeParameters.params[0] = createUniformComponentPropsType(parametersType, slotsType);
                modified = true;
              }
            }
          }
        }
      }
    }
  });

  /**
   * Transform custom interfaces that should use Uniform.ComponentProps
   * e.g., interface Props { title: string; component: Canvas.ComponentInstance }
   */
  root.find(j.TSInterfaceDeclaration).forEach(path => {
    const interfaceBody = path.node.body.body;

    // Check if interface has a component property with Canvas.ComponentInstance type
    const hasComponentProp = interfaceBody.some((prop: any) => {
      if (prop.type !== 'TSPropertySignature') return false;
      if (!prop.key || prop.key.name !== 'component') return false;
      if (!prop.typeAnnotation || !prop.typeAnnotation.typeAnnotation) return false;

      const typeAnnotation = prop.typeAnnotation.typeAnnotation;
      if (typeAnnotation.type !== 'TSTypeReference') return false;

      const typeName = typeAnnotation.typeName;
      if (typeName.type === 'TSQualifiedName') {
        return typeName.left.name === 'Canvas' && typeName.right.name === 'ComponentInstance';
      }

      return false;
    });

    if (!hasComponentProp) return;

    // Extract parameters from interface (excluding component, slots, variant, context, parameters)
    const parameterProps = interfaceBody.filter((prop: any) => {
      if (prop.type !== 'TSPropertySignature') return false;
      if (!prop.key) return false;
      const name = prop.key.name;
      return (
        name !== 'component' && name !== 'slots' && name !== 'variant' && name !== 'context' && name !== 'parameters'
      );
    });

    // If component has auto-generated types, replace interface with type alias using Uniform.ComponentProps
    if (componentInfo && componentInfo.hasParameters) {
      const parametersType = createComponentsParametersType(componentInfo.typeName);
      const slotsType = componentInfo.hasSlots ? createComponentsSlotsType(componentInfo.typeName) : null;

      // Create type alias declaration
      const typeAlias = j.tsTypeAliasDeclaration(
        path.node.id as any,
        createUniformComponentPropsType(parametersType, slotsType)
      );

      // Preserve comments if any
      if (path.node.comments) {
        typeAlias.comments = path.node.comments;
      }

      // Replace interface with type alias
      j(path).replaceWith(typeAlias);
      modified = true;
    } else if (parameterProps.length > 0) {
      // No auto-generated types, but has parameters
      // Create inline object type for parameters
      const parameterTypeProperties = parameterProps.map((prop: any) => {
        return j.tsPropertySignature(prop.key, j.tsTypeAnnotation(prop.typeAnnotation.typeAnnotation));
      });

      const parametersType = j.tsTypeLiteral(parameterTypeProperties);

      // Check if has slots
      const slotsProp = interfaceBody.find(
        (prop: any) => prop.type === 'TSPropertySignature' && prop.key && prop.key.name === 'slots'
      );

      let slotsType: TSType | null = null;
      if (slotsProp && (slotsProp as any).typeAnnotation) {
        slotsType = (slotsProp as any).typeAnnotation.typeAnnotation;
      }

      // Create type alias
      const typeAlias = j.tsTypeAliasDeclaration(
        path.node.id as any,
        createUniformComponentPropsType(parametersType, slotsType)
      );

      // Add TODO comment
      const todoComment = j.commentBlock(
        ` TODO: No auto-generated types found for ${componentName}. Using inline types. `,
        true,
        false
      );
      typeAlias.comments = [todoComment];

      // Replace interface with type alias
      j(path).replaceWith(typeAlias);
      modified = true;
    }
  });

  // Fix double semicolons
  if (modified) {
    let output = root.toSource({ quote: 'single' });
    output = output.replace(/;;/g, ';');
    return output;
  }

  return null;
}
