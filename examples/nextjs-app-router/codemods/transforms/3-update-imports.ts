/**
 * Phase 1: Update import statements
 *
 * Transforms:
 * - @uniformdev/canvas-next-rsc -> @uniformdev/canvas-next-rsc-v2
 * - @uniformdev/canvas-next-rsc-client -> @uniformdev/canvas-next-rsc-client-v2
 * - @uniformdev/canvas-next-rsc-shared -> @uniformdev/canvas-next-rsc-shared-v2
 * - @uniformdev/canvas-next-rsc/component -> @uniformdev/canvas-next-rsc-v2/component
 */

import type { API, FileInfo, Options } from 'jscodeshift';
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

  // Package name mappings
  const packageMappings: Record<string, string> = {
    '@uniformdev/canvas-next-rsc': '@uniformdev/canvas-next-rsc-v2',
    '@uniformdev/canvas-next-rsc-client': '@uniformdev/canvas-next-rsc-client-v2',
    '@uniformdev/canvas-next-rsc-shared': '@uniformdev/canvas-next-rsc-shared-v2',
  };

  // Transform import declarations
  root.find(j.ImportDeclaration).forEach(path => {
    const sourceValue = path.node.source.value as string;

    // Check each mapping
    Object.entries(packageMappings).forEach(([oldPkg, newPkg]) => {
      // Exact match
      if (sourceValue === oldPkg) {
        path.node.source.value = newPkg;
        modified = true;
        return;
      }

      // Match with subpath (e.g., @uniformdev/canvas-next-rsc/component)
      if (sourceValue.startsWith(oldPkg + '/')) {
        const subpath = sourceValue.substring(oldPkg.length);
        path.node.source.value = newPkg + subpath;
        modified = true;
        return;
      }
    });
  });

  // Transform dynamic imports
  root
    .find(j.CallExpression, {
      callee: {
        type: 'Import',
      },
    })
    .forEach(path => {
      const arg = path.node.arguments[0];
      if (arg && (arg.type === 'StringLiteral' || arg.type === 'Literal')) {
        const sourceValue = (arg as any).value as string;

        Object.entries(packageMappings).forEach(([oldPkg, newPkg]) => {
          if (sourceValue === oldPkg || sourceValue.startsWith(oldPkg + '/')) {
            const subpath = sourceValue.startsWith(oldPkg + '/') ? sourceValue.substring(oldPkg.length) : '';
            (arg as any).value = newPkg + subpath;
            modified = true;
          }
        });
      }
    });

  // Transform require() calls
  root
    .find(j.CallExpression, {
      callee: {
        name: 'require',
      },
    })
    .forEach(path => {
      const arg = path.node.arguments[0];
      if (arg && (arg.type === 'StringLiteral' || arg.type === 'Literal')) {
        const sourceValue = (arg as any).value as string;

        Object.entries(packageMappings).forEach(([oldPkg, newPkg]) => {
          if (sourceValue === oldPkg || sourceValue.startsWith(oldPkg + '/')) {
            const subpath = sourceValue.startsWith(oldPkg + '/') ? sourceValue.substring(oldPkg.length) : '';
            (arg as any).value = newPkg + subpath;
            modified = true;
          }
        });
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
