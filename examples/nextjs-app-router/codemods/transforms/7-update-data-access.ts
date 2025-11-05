/**
 * Phase 5: Update data access patterns
 *
 * Transforms:
 * - Asset field access: asset?.[0]?.fields?.url?.value → asset?.[0]?.url
 * - Variant access: component.variant → variant
 * - Draft mode: context.isDraftMode → Add TODO for manual review (requires async)
 */

import type { API, FileInfo, Options, ASTPath, MemberExpression, ObjectPattern } from 'jscodeshift';
import { shouldIgnoreFile } from '../utils/ast-helpers';

export const parser = 'tsx';

export default function transformer(file: FileInfo, api: API, options: Options): string | null {
  // Skip files in node_modules and build directories
  if (shouldIgnoreFile(file.path)) {
    return null;
  }

  const j = api.jscodeshift;
  const root = j(file.source);
  let modified = false;

  /**
   * Transform asset field access patterns
   * asset?.[0]?.fields?.url?.value → asset?.[0]?.url
   */
  root.find(j.MemberExpression).forEach(path => {
    const node = path.node;

    // Look for patterns like: something.fields.{property}.value
    if (
      node.property &&
      (node.property as any).name === 'value' &&
      node.object &&
      node.object.type === 'MemberExpression' &&
      node.object.object &&
      node.object.object.type === 'MemberExpression' &&
      node.object.object.property &&
      (node.object.object.property as any).name === 'fields'
    ) {
      // Extract: asset?.[0]?.fields.url.value
      // Transform to: asset?.[0].url
      const fieldName = (node.object.property as any).name; // e.g., 'url'
      const assetAccess = node.object.object.object; // e.g., asset?.[0]

      // Replace with direct field access
      j(path).replaceWith(j.memberExpression(assetAccess, j.identifier(fieldName), false));
      modified = true;
    }

    // Also handle optional chaining: something?.fields?.url?.value
    if (
      node.property &&
      (node.property as any).name === 'value' &&
      (node as any).optional === true &&
      node.object &&
      node.object.type === 'MemberExpression' &&
      (node.object as any).optional === true &&
      node.object.object &&
      node.object.object.type === 'MemberExpression' &&
      node.object.object.property &&
      (node.object.object.property as any).name === 'fields'
    ) {
      const fieldName = (node.object.property as any).name;
      const assetAccess = node.object.object.object;

      const newExpression = j.memberExpression(assetAccess, j.identifier(fieldName), false);
      (newExpression as any).optional = true;

      j(path).replaceWith(newExpression);
      modified = true;
    }
  });

  /**
   * Transform variant access: component.variant → variant
   * Adds variant to destructuring if not present
   */
  root
    .find(j.MemberExpression, {
      object: { name: 'component' },
      property: { name: 'variant' },
    })
    .forEach(path => {
      // Find parent function
      let parent: any = path.parent;
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

      if (!functionPath) return;

      const node = functionPath.node || functionPath.value;
      const firstParam = node.params[0];

      if (!firstParam || firstParam.type !== 'ObjectPattern') return;

      // Check if variant already exists in destructuring
      const hasVariantParam = (firstParam as ObjectPattern).properties.some(
        (prop: any) =>
          (prop.type === 'Property' || prop.type === 'ObjectProperty') && prop.key && prop.key.name === 'variant'
      );

      // Check if there's a variable declaration for variant in the function body
      let hasVariantDeclaration = false;
      if (node.body && node.body.type === 'BlockStatement') {
        const variantDeclarations = j(node.body).find(j.VariableDeclarator, {
          id: { name: 'variant' },
        });
        hasVariantDeclaration = variantDeclarations.length > 0;
      }

      // Only add variant to destructuring if it doesn't exist and won't conflict
      if (!hasVariantParam && !hasVariantDeclaration) {
        // Add variant to the destructuring pattern
        (firstParam as ObjectPattern).properties.push(
          j.property('init', j.identifier('variant'), j.identifier('variant'))
        );
        modified = true;
      }

      // Replace component.variant with variant only if no conflict
      if (!hasVariantDeclaration) {
        j(path).replaceWith(j.identifier('variant'));
        modified = true;
      }
    });

  /**
   * Transform mapUniformContentFields with .fields access
   * mapUniformContentFields(asset?.fields) → asset (since flattenParameters already unwraps)
   * mapUniformContentFields(asset?.[0]?.fields) → asset?.[0]
   */
  root
    .find(j.CallExpression, {
      callee: { name: 'mapUniformContentFields' },
    })
    .forEach(path => {
      const args = path.node.arguments;

      if (args.length > 0) {
        const arg = args[0];

        // Check if argument is accessing .fields (with or without optional chaining)
        if (
          (arg.type === 'MemberExpression' || arg.type === 'OptionalMemberExpression') &&
          (arg as any).property &&
          (arg as any).property.name === 'fields'
        ) {
          // Replace mapUniformContentFields(x?.fields) with just x
          // x could be asset, asset?.[0], etc.
          j(path).replaceWith((arg as any).object);
          modified = true;
        }
      }
    });

  /**
   * Transform context.isContextualEditing
   * Add TODO comment for manual review
   */
  root
    .find(j.MemberExpression, {
      object: { name: 'context' },
      property: { name: 'isContextualEditing' },
    })
    .forEach(path => {
      const comment = j.commentBlock(' TODO: context.isContextualEditing - needs manual refactoring ', true, false);

      let parent: any = path.parent;
      while (parent && !parent.node.type.includes('Statement') && !parent.node.type.includes('Declaration')) {
        parent = parent.parent;
      }

      if (parent && parent.node) {
        if (!parent.node.comments) {
          parent.node.comments = [];
        }
        parent.node.comments.push(comment);
        modified = true;
      }
    });

  /**
   * Transform context.previewMode
   * Add TODO comment for manual review
   */
  root
    .find(j.MemberExpression, {
      object: { name: 'context' },
      property: { name: 'previewMode' },
    })
    .forEach(path => {
      const comment = j.commentBlock(' TODO: context.previewMode - needs manual refactoring ', true, false);

      let parent: any = path.parent;
      while (parent && !parent.node.type.includes('Statement') && !parent.node.type.includes('Declaration')) {
        parent = parent.parent;
      }

      if (parent && parent.node) {
        if (!parent.node.comments) {
          parent.node.comments = [];
        }
        parent.node.comments.push(comment);
        modified = true;
      }
    });

  /**
   * Transform draft mode: context.isDraftMode
   * Add TODO comment for manual review since this requires async changes
   */
  root
    .find(j.MemberExpression, {
      object: { name: 'context' },
      property: { name: 'isDraftMode' },
    })
    .forEach(path => {
      // Add a comment noting this needs manual review
      const comment = j.commentBlock(
        ' TODO: Replace context.isDraftMode with draftMode() - requires async function ',
        true,
        false
      );

      // Try to add comment to parent statement
      let parent: any = path.parent;
      while (parent && !parent.node.type.includes('Statement') && !parent.node.type.includes('Declaration')) {
        parent = parent.parent;
      }

      if (parent && parent.node) {
        if (!parent.node.comments) {
          parent.node.comments = [];
        }
        parent.node.comments.push(comment);
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
