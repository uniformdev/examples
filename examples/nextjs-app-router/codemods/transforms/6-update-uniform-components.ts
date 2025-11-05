/**
 * Phase 4: Update Uniform components
 *
 * Transforms:
 * - UniformText: parameterId="x" context={context} → parameter={parameters.x}
 * - UniformSlot: data={component} context={context} → remove data and context
 * - UniformRichText: parameterId="x" context={context} → parameter={parameters.x}
 */

import type { API, FileInfo, Options, ASTPath, JSXElement, ObjectPattern } from 'jscodeshift';
import { shouldIgnoreFile } from '../utils/ast-helpers';

export const parser = 'tsx';

interface ScopeResult {
  hasParameters: boolean;
  added: boolean;
}

export default function transformer(file: FileInfo, api: API, options: Options): string | null {
  // Skip files in node_modules and build directories
  if (shouldIgnoreFile(file.path)) {
    return null;
  }

  const j = api.jscodeshift;
  const root = j(file.source);
  let modified = false;

  /**
   * Check if 'parameters' is in scope, and add it if needed
   * Returns the parent function path if parameters was added
   */
  function ensureParametersInScope(jsxPath: ASTPath<JSXElement>): ScopeResult {
    let parent: any = jsxPath.parent;
    let functionPath: any = null;

    while (parent) {
      const node = parent.node || parent.value;

      if (
        (node.type === 'FunctionDeclaration' ||
          node.type === 'FunctionExpression' ||
          node.type === 'ArrowFunctionExpression') &&
        node.params &&
        node.params.length > 0
      ) {
        functionPath = parent;
        break;
      }

      parent = parent.parent;
    }

    if (!functionPath) return { hasParameters: false, added: false };

    const node = functionPath.node || functionPath.value;
    const firstParam = node.params[0];

    if (!firstParam || firstParam.type !== 'ObjectPattern') {
      return { hasParameters: false, added: false };
    }

    // Check if parameters already exists
    const hasParams = (firstParam as ObjectPattern).properties.some(
      (prop: any) =>
        (prop.type === 'Property' || prop.type === 'ObjectProperty') && prop.key && prop.key.name === 'parameters'
    );

    if (hasParams) {
      return { hasParameters: true, added: false };
    }

    // Add parameters to the destructuring
    // Insert at the beginning for Canvas components
    (firstParam as ObjectPattern).properties.unshift(
      j.property('init', j.identifier('parameters'), j.identifier('parameters'))
    );

    return { hasParameters: true, added: true };
  }

  /**
   * Transform UniformText component
   */
  root
    .find(j.JSXElement, {
      openingElement: {
        name: { name: 'UniformText' },
      },
    })
    .forEach(path => {
      const attributes = path.node.openingElement.attributes;
      let parameterId: string | null = null;
      const newAttributes: any[] = [];

      // Find and remove parameterId and context
      attributes?.forEach(attr => {
        if (attr.type !== 'JSXAttribute') {
          newAttributes.push(attr);
          return;
        }

        if (attr.name.name === 'parameterId') {
          // Extract the parameter ID
          if (attr.value && (attr.value.type === 'StringLiteral' || attr.value.type === 'Literal')) {
            parameterId = (attr.value as any).value;
          }
          modified = true;
        } else if (attr.name.name === 'context') {
          // Remove context attribute
          modified = true;
        } else {
          newAttributes.push(attr);
        }
      });

      // Add parameter={parameters.x} attribute, ensuring parameters is in scope
      if (parameterId) {
        const { hasParameters, added } = ensureParametersInScope(path);

        if (hasParameters) {
          newAttributes.push(
            j.jsxAttribute(
              j.jsxIdentifier('parameter'),
              j.jsxExpressionContainer(j.memberExpression(j.identifier('parameters'), j.identifier(parameterId)))
            )
          );

          if (added) {
            modified = true;
          }
        } else {
          // Could not add parameters - add TODO comment
          const comment = j.commentBlock(' TODO: Update parameter prop - cannot add parameters to scope ', true, false);
          if (!path.node.openingElement.comments) {
            path.node.openingElement.comments = [];
          }
          path.node.openingElement.comments.push(comment);

          // Keep the component attribute for manual review
          newAttributes.push(j.jsxAttribute(j.jsxIdentifier('parameterId'), j.stringLiteral(parameterId)));
        }
      }

      path.node.openingElement.attributes = newAttributes;
    });

  /**
   * Transform UniformRichText component
   */
  root
    .find(j.JSXElement, {
      openingElement: {
        name: { name: 'UniformRichText' },
      },
    })
    .forEach(path => {
      const attributes = path.node.openingElement.attributes;
      let parameterId: string | null = null;
      const newAttributes: any[] = [];

      // Find and remove parameterId and context
      attributes?.forEach(attr => {
        if (attr.type !== 'JSXAttribute') {
          newAttributes.push(attr);
          return;
        }

        if (attr.name.name === 'parameterId') {
          if (attr.value && (attr.value.type === 'StringLiteral' || attr.value.type === 'Literal')) {
            parameterId = (attr.value as any).value;
          }
          modified = true;
        } else if (attr.name.name === 'context') {
          modified = true;
        } else {
          newAttributes.push(attr);
        }
      });

      // Add parameter={parameters.x} attribute, ensuring parameters is in scope
      if (parameterId) {
        const { hasParameters, added } = ensureParametersInScope(path);

        if (hasParameters) {
          newAttributes.push(
            j.jsxAttribute(
              j.jsxIdentifier('parameter'),
              j.jsxExpressionContainer(j.memberExpression(j.identifier('parameters'), j.identifier(parameterId)))
            )
          );

          if (added) {
            modified = true;
          }
        } else {
          // Could not add parameters - add TODO comment
          const comment = j.commentBlock(' TODO: Update parameter prop - cannot add parameters to scope ', true, false);
          if (!path.node.openingElement.comments) {
            path.node.openingElement.comments = [];
          }
          path.node.openingElement.comments.push(comment);

          // Keep the component attribute for manual review
          newAttributes.push(j.jsxAttribute(j.jsxIdentifier('parameterId'), j.stringLiteral(parameterId)));
        }
      }

      path.node.openingElement.attributes = newAttributes;
    });

  /**
   * Transform UniformSlot component
   */
  root
    .find(j.JSXElement, {
      openingElement: {
        name: { name: 'UniformSlot' },
      },
    })
    .forEach(path => {
      const attributes = path.node.openingElement.attributes;
      const newAttributes: any[] = [];

      // Remove data and context attributes
      attributes?.forEach(attr => {
        if (attr.type !== 'JSXAttribute') {
          newAttributes.push(attr);
          return;
        }

        if (attr.name.name === 'data' || attr.name.name === 'context') {
          modified = true;
        } else {
          newAttributes.push(attr);
        }
      });

      path.node.openingElement.attributes = newAttributes;
    });

  // Fix double semicolons
  if (modified) {
    let output = root.toSource({ quote: 'single' });
    output = output.replace(/;;/g, ';');
    return output;
  }

  return null;
}
