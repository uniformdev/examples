/**
 * Disable specified files before migration by renaming them with a `.disabled` suffix.
 * This preserves the original files while ensuring they are not executed or imported during the migration.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ResolvedConfig } from '../types/config';

/**
 * Build a `.disabled` path for the provided file, ensuring uniqueness.
 */
function getDisabledPath(filePath: string): string {
  const base = `${filePath}.disabled`;
  let candidate = base;
  let counter = 1;

  while (fs.existsSync(candidate)) {
    candidate = `${base}.${counter}`;
    counter += 1;
  }

  return candidate;
}

/**
 * Disable files listed in the migration configuration.
 */
function disableFiles(config: ResolvedConfig): void {
  const filesToDisable = config.backup.files;

  if (!filesToDisable || filesToDisable.length === 0) {
    console.log('ℹ No files specified for disabling, skipping...');
    return;
  }

  console.log(`\n🚫 Disabling ${filesToDisable.length} file(s)...\n`);

  let disabledCount = 0;
  let skippedCount = 0;

  for (const filePath of filesToDisable) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠ File does not exist, skipping: ${path.relative(config.projectRoot, filePath)}`);
      skippedCount++;
      continue;
    }

    const disabledPath = getDisabledPath(filePath);

    try {
      fs.renameSync(filePath, disabledPath);
      console.log(
        `✓ Disabled file: ${path.relative(config.projectRoot, filePath)} → ${path.relative(
          config.projectRoot,
          disabledPath
        )}`
      );
      disabledCount++;
    } catch (error) {
      console.error(
        `✗ Failed to disable ${path.relative(config.projectRoot, filePath)}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  console.log(`\n✅ Disable complete: ${disabledCount} disabled, ${skippedCount} skipped\n`);
}

// If run directly (for backwards compatibility, load config)
if (require.main === module) {
  const { getProjectRoot, loadAndResolveConfig } = require('../utils/config-loader');

  const projectRoot = getProjectRoot();
  const config = loadAndResolveConfig(projectRoot);

  disableFiles(config);
}

// Export for use in the migration script
export default disableFiles;
