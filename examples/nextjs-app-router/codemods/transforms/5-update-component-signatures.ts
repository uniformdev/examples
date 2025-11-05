/**
 * Phase 3: Update component signatures
 *
 * Transforms:
 * - Detect components with context in props destructuring
 * - Replace destructuring: remove context, keep parameters/variant/component/slots
 * - Add flattenParameters call at function start
 * - Add flattenParameters import
 * - Update type annotation to use *ParametersFlat
 */

import type {
  API,
  FileInfo,
  Options,
  ASTPath,
  VariableDeclarator,
  FunctionDeclaration,
  ObjectPattern,
} from 'jscodeshift';
import {
  shouldIgnoreFile,
  addImportIfMissing,
  getComponentNameFromPath,
  getComponentInfo,
  extractParameterNames,
  isCanvasComponent,
  getResolvedConfig,
} from '../utils/ast-helpers';

export const parser = 'tsx';

export default function transformer(file: FileInfo, api: API, options: Options): string | null {
  // Skip files in node_modules and build directories
  if (shouldIgnoreFile(file.path)) {
    return null;
  }

  const j = api.jscodeshift;
  const root = j(file.source);
  let modified = false;
  let needsFlattenImport = false;

  // Get flattenParameters import path from options (passed from migrate.ts)
  const config = getResolvedConfig();
  const flattenParametersImportPath =
    (options.flattenParametersImportPath as string) || config.paths.flattenParametersImport;

  const componentName = getComponentNameFromPath(file.path, j, root);
  const componentInfo = getComponentInfo(componentName, file.path);

  // Check if this is a Canvas component (registered in resolver)
  // Skip check for test fixtures
  const isTestFixture = file.path.includes('__testfixtures__');
  if (!isTestFixture && !isCanvasComponent(componentName)) {
    // Not a Canvas component - skip transformation
    return null;
  }

  /**
   * Transform arrow function component
   */
  function transformArrowFunction(path: ASTPath<VariableDeclarator>): boolean {
    const arrowFunc = path.node.init as any;
    const params = arrowFunc.params;

    if (params.length === 0 || params[0].type !== 'ObjectPattern') {
      return false;
    }

    const props = (params[0] as ObjectPattern).properties;
    const propNames = extractParameterNames(params[0] as ObjectPattern);

    // Check if this component needs transformation
    // 1. Has context (old pattern with context)
    // 2. Has parameters directly destructured but no 'parameters' prop (old pattern without context)
    const hasContext = propNames.includes('context');
    const hasParametersParam = propNames.includes('parameters');

    // Skip if already using new pattern (has parameters but no context)
    if (hasParametersParam && !hasContext) {
      return false;
    }

    // Skip if no transformation needed (component-only props like slots, component, variant)
    if (!hasContext && !hasParametersParam) {
      // Check if there are any parameter properties to transform
      const hasParameterProps = props.some((prop: any) => {
        if (prop.type === 'RestElement') return false;
        if (!prop.key || !prop.key.name) return false;
        const name = prop.key.name;
        return name !== 'component' && name !== 'slots' && name !== 'variant';
      });

      if (!hasParameterProps) {
        return false;
      }
    }

    // Extract parameter properties (not context, component, slots, variant, parameters)
    const parameterProps = props.filter((prop: any) => {
      if (prop.type === 'RestElement') return true; // Keep rest spread
      if (!prop.key || !prop.key.name) return false;
      const name = prop.key.name;
      return (
        name !== 'context' && name !== 'component' && name !== 'slots' && name !== 'variant' && name !== 'parameters'
      );
    });

    // Check for rest element
    const hasRestElement = parameterProps.some((prop: any) => prop.type === 'RestElement');

    // Extract variant default value if it exists
    let variantDefaultValue: any = null;
    const variantProp = props.find((prop: any) => prop.type === 'Property' && prop.key && prop.key.name === 'variant');
    if (variantProp && (variantProp as any).value && (variantProp as any).value.type === 'AssignmentPattern') {
      variantDefaultValue = (variantProp as any).value.right;
    }

    // Build new destructuring pattern
    const newProps: any[] = [];

    // Add parameters prop only if there are parameters to extract OR if there's a rest element
    if (parameterProps.length > 0 || hasRestElement) {
      newProps.push(j.property('init', j.identifier('parameters'), j.identifier('parameters')));
    }

    // Keep variant if exists, with default value if it had one
    if (propNames.includes('variant')) {
      if (variantDefaultValue) {
        newProps.push(
          j.property('init', j.identifier('variant'), j.assignmentPattern(j.identifier('variant'), variantDefaultValue))
        );
      } else {
        newProps.push(j.property('init', j.identifier('variant'), j.identifier('variant')));
      }
    }

    // Keep component, slots if they exist
    ['component', 'slots'].forEach(name => {
      if (propNames.includes(name)) {
        newProps.push(j.property('init', j.identifier(name), j.identifier(name)));
      }
    });

    // Update the destructuring pattern
    (params[0] as ObjectPattern).properties = newProps;

    // If there are parameters to extract, add flattenParameters call
    if (parameterProps.length > 0 || hasRestElement) {
      // Determine the type to use
      let typeArg: any = null;
      if (componentInfo && componentInfo.hasParametersFlat) {
        typeArg = j.tsTypeReference(
          j.tsQualifiedName(j.identifier('Components'), j.identifier(`${componentInfo.typeName}ParametersFlat`))
        );
      }

      // Create destructuring for flattenParameters
      let flattenDestructuring: ObjectPattern;

      if (componentInfo && componentInfo.parameterNames && componentInfo.parameterNames.length > 0) {
        // Use auto-generated parameter names, but preserve renames and defaults from original destructuring
        const paramsToExtract = componentInfo.parameterNames.map((paramName: string) => {
          // Check if this param was in original destructuring with rename or default
          const originalProp = parameterProps.find(
            (prop: any) => prop.type === 'Property' && prop.key && prop.key.name === paramName
          );

          if (originalProp) {
            // Preserve original rename and default value
            const key = (originalProp as any).key;
            const value = (originalProp as any).value;

            let newValue;
            if (value && value.type === 'AssignmentPattern') {
              // Has default value
              newValue = value;
            } else if (value && value.type === 'Identifier' && value.name !== key.name) {
              // Has rename
              newValue = value;
            } else {
              // No rename, use shorthand
              newValue = key;
            }

            return j.property('init', key, newValue);
          } else {
            // Not in original destructuring, add it as simple property
            return j.property('init', j.identifier(paramName), j.identifier(paramName));
          }
        });

        // If there's a rest element, add it at the end
        if (hasRestElement) {
          const restElement = parameterProps.find((prop: any) => prop.type === 'RestElement');
          paramsToExtract.push(j.restProperty((restElement as any).argument) as any);
        }

        flattenDestructuring = j.objectPattern(paramsToExtract);
      } else if (hasRestElement) {
        // Has rest element but no auto-generated types - just use rest
        const restElement = parameterProps.find((prop: any) => prop.type === 'RestElement');
        flattenDestructuring = j.objectPattern([j.restElement((restElement as any).argument) as any]);
      } else {
        // No auto-generated types - use original parameters only, preserving renames and default values
        flattenDestructuring = j.objectPattern(
          parameterProps
            .filter((prop: any) => prop.type !== 'RestElement')
            .map((prop: any) => {
              // Preserve the original property with any renames and defaults
              const key = prop.key;
              const value = prop.value;

              // Create the new property
              let newValue;

              // Check if there's a default value (AssignmentPattern)
              if (value && value.type === 'AssignmentPattern') {
                // Has default value: { size = BadgeSize.MD }
                // Keep the default value
                newValue = value;
              } else if (value && value.type === 'Identifier' && value.name !== key.name) {
                // Has rename: { author: authorBlock }
                newValue = value;
              } else {
                // No rename, use shorthand
                newValue = key;
              }

              return j.property('init', key, newValue);
            })
        );
      }

      // Create flattenParameters call
      const flattenCall = j.callExpression(j.identifier('flattenParameters'), [j.identifier('parameters')]);

      // Add type argument if we have one
      if (typeArg) {
        (flattenCall as any).typeParameters = j.tsTypeParameterInstantiation([typeArg]);
      }

      const flattenStatement = j.variableDeclaration('const', [
        j.variableDeclarator(flattenDestructuring, flattenCall),
      ]);

      // Add TODO comment if no auto-generated types
      if (!componentInfo || !componentInfo.hasParametersFlat) {
        const todoComment = j.commentBlock(
          ` TODO: No auto-generated ParametersFlat type found for ${componentName} `,
          true,
          false
        );
        flattenStatement.comments = [todoComment];
      }

      // Insert at the beginning of function body
      if (arrowFunc.body.type === 'BlockStatement') {
        arrowFunc.body.body.unshift(flattenStatement);
      } else {
        // Convert expression to block statement
        const returnStatement = j.returnStatement(arrowFunc.body);
        arrowFunc.body = j.blockStatement([flattenStatement, returnStatement]);
      }

      needsFlattenImport = true;
    }

    return true;
  }

  /**
   * Transform function declaration component
   */
  function transformFunctionDeclaration(path: ASTPath<FunctionDeclaration>): boolean {
    const func = path.node;
    const params = func.params;

    if (params.length === 0 || params[0].type !== 'ObjectPattern') {
      return false;
    }

    const props = (params[0] as ObjectPattern).properties;
    const propNames = extractParameterNames(params[0] as ObjectPattern);

    // Check if this component needs transformation
    const hasContext = propNames.includes('context');
    const hasParametersParam = propNames.includes('parameters');

    // Skip if already using new pattern
    if (hasParametersParam && !hasContext) {
      return false;
    }

    // Skip if no transformation needed
    if (!hasContext && !hasParametersParam) {
      const hasParameterProps = props.some((prop: any) => {
        if (prop.type === 'RestElement') return false;
        if (!prop.key || !prop.key.name) return false;
        const name = prop.key.name;
        return name !== 'component' && name !== 'slots' && name !== 'variant';
      });

      if (!hasParameterProps) {
        return false;
      }
    }

    // Extract parameter properties
    const parameterProps = props.filter((prop: any) => {
      if (prop.type === 'RestElement') return true; // Keep rest spread
      if (!prop.key || !prop.key.name) return false;
      const name = prop.key.name;
      return (
        name !== 'context' && name !== 'component' && name !== 'slots' && name !== 'variant' && name !== 'parameters'
      );
    });

    // Check for rest element
    const hasRestElement = parameterProps.some((prop: any) => prop.type === 'RestElement');

    // Extract variant default value if it exists
    let variantDefaultValue: any = null;
    const variantProp = props.find((prop: any) => prop.type === 'Property' && prop.key && prop.key.name === 'variant');
    if (variantProp && (variantProp as any).value && (variantProp as any).value.type === 'AssignmentPattern') {
      variantDefaultValue = (variantProp as any).value.right;
    }

    // Build new destructuring pattern
    const newProps: any[] = [];

    if (parameterProps.length > 0 || hasRestElement) {
      newProps.push(j.property('init', j.identifier('parameters'), j.identifier('parameters')));
    }

    // Keep variant if exists, with default value if it had one
    if (propNames.includes('variant')) {
      if (variantDefaultValue) {
        newProps.push(
          j.property('init', j.identifier('variant'), j.assignmentPattern(j.identifier('variant'), variantDefaultValue))
        );
      } else {
        newProps.push(j.property('init', j.identifier('variant'), j.identifier('variant')));
      }
    }

    ['component', 'slots'].forEach(name => {
      if (propNames.includes(name)) {
        newProps.push(j.property('init', j.identifier(name), j.identifier(name)));
      }
    });

    (params[0] as ObjectPattern).properties = newProps;

    // Add flattenParameters call if needed
    if (parameterProps.length > 0 || hasRestElement) {
      let typeArg: any = null;
      if (componentInfo && componentInfo.hasParametersFlat) {
        typeArg = j.tsTypeReference(
          j.tsQualifiedName(j.identifier('Components'), j.identifier(`${componentInfo.typeName}ParametersFlat`))
        );
      }

      // Create destructuring for flattenParameters
      let flattenDestructuring: ObjectPattern;

      if (componentInfo && componentInfo.parameterNames && componentInfo.parameterNames.length > 0) {
        // Use auto-generated parameter names, but preserve renames and defaults from original destructuring
        const paramsToExtract = componentInfo.parameterNames.map((paramName: string) => {
          // Check if this param was in original destructuring with rename or default
          const originalProp = parameterProps.find(
            (prop: any) => prop.type === 'Property' && prop.key && prop.key.name === paramName
          );

          if (originalProp) {
            // Preserve original rename and default value
            const key = (originalProp as any).key;
            const value = (originalProp as any).value;

            let newValue;
            if (value && value.type === 'AssignmentPattern') {
              // Has default value
              newValue = value;
            } else if (value && value.type === 'Identifier' && value.name !== key.name) {
              // Has rename
              newValue = value;
            } else {
              // No rename, use shorthand
              newValue = key;
            }

            return j.property('init', key, newValue);
          } else {
            // Not in original destructuring, add it as simple property
            return j.property('init', j.identifier(paramName), j.identifier(paramName));
          }
        });

        // If there's a rest element, add it at the end
        if (hasRestElement) {
          const restElement = parameterProps.find((prop: any) => prop.type === 'RestElement');
          paramsToExtract.push(j.restProperty((restElement as any).argument) as any);
        }

        flattenDestructuring = j.objectPattern(paramsToExtract);
      } else if (hasRestElement) {
        // Has rest element but no auto-generated types - just use rest
        const restElement = parameterProps.find((prop: any) => prop.type === 'RestElement');
        flattenDestructuring = j.objectPattern([j.restElement((restElement as any).argument) as any]);
      } else {
        // No auto-generated types - use original parameters only, preserving renames and default values
        flattenDestructuring = j.objectPattern(
          parameterProps
            .filter((prop: any) => prop.type !== 'RestElement')
            .map((prop: any) => {
              // Preserve the original property with any renames and defaults
              const key = prop.key;
              const value = prop.value;

              // Create the new property
              let newValue;

              // Check if there's a default value (AssignmentPattern)
              if (value && value.type === 'AssignmentPattern') {
                // Has default value: { size = BadgeSize.MD }
                // Keep the default value
                newValue = value;
              } else if (value && value.type === 'Identifier' && value.name !== key.name) {
                // Has rename: { author: authorBlock }
                newValue = value;
              } else {
                // No rename, use shorthand
                newValue = key;
              }

              return j.property('init', key, newValue);
            })
        );
      }

      const flattenCall = j.callExpression(j.identifier('flattenParameters'), [j.identifier('parameters')]);

      if (typeArg) {
        (flattenCall as any).typeParameters = j.tsTypeParameterInstantiation([typeArg]);
      }

      const flattenStatement = j.variableDeclaration('const', [
        j.variableDeclarator(flattenDestructuring, flattenCall),
      ]);

      // Add TODO comment if no auto-generated types
      if (!componentInfo || !componentInfo.hasParametersFlat) {
        const todoComment = j.commentBlock(
          ` TODO: No auto-generated ParametersFlat type found for ${componentName} `,
          true,
          false
        );
        flattenStatement.comments = [todoComment];
      }

      func.body.body.unshift(flattenStatement);
      needsFlattenImport = true;
    }

    return true;
  }

  // Transform arrow function components
  root
    .find(j.VariableDeclarator, {
      init: { type: 'ArrowFunctionExpression' },
    })
    .forEach(path => {
      if (transformArrowFunction(path)) {
        modified = true;
      }
    });

  // Transform function declaration components
  root.find(j.FunctionDeclaration).forEach(path => {
    if (transformFunctionDeclaration(path)) {
      modified = true;
    }
  });

  // Add flattenParameters import if needed
  if (needsFlattenImport) {
    addImportIfMissing(
      root,
      j,
      flattenParametersImportPath,
      'flattenParameters',
      true // default import
    );
  }

  // Fix double semicolons
  if (modified) {
    let output = root.toSource({ quote: 'single' });
    output = output.replace(/;;/g, ';');
    return output;
  }

  return null;
}
