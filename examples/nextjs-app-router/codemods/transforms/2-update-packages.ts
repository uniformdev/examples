#!/usr/bin/env node

/**
 * Phase 2: Update package.json dependencies
 *
 * This script updates Uniform SDK packages from v1 to v2
 * and adds required new dependencies.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ResolvedConfig } from '../types/config';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: any;
}

function getUniqueBackupPath(filePath: string): string {
  let candidate = `${filePath}.backup`;
  let counter = 1;

  while (fs.existsSync(candidate)) {
    candidate = `${filePath}.backup.${counter}`;
    counter += 1;
  }

  return candidate;
}

function updatePackageJson(config: ResolvedConfig): void {
  console.log('📦 Phase 2: Updating package.json...\n');

  const PACKAGE_JSON_PATH = path.join(config.projectRoot, 'package.json');
  const PACKAGE_MIGRATIONS = config.packages.mappings;
  const TARGET_VERSION = process.env.UNIFORM_VERSION || config.packages.targetVersion;
  const NEW_PACKAGES: Record<string, string> = {};

  // Add required packages (must be installed)
  config.packages.requiredPackages.forEach(pkg => {
    NEW_PACKAGES[pkg.name] = pkg.version;
  });

  // Add additional packages
  config.packages.additionalPackages.forEach(pkg => {
    NEW_PACKAGES[pkg.name] = pkg.version;
  });

  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    console.error('❌ Error: package.json not found at', PACKAGE_JSON_PATH);
    process.exit(1);
  }

  // Read package.json
  const packageJson: PackageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  let modified = false;

  // Backup original
  const backupPath = getUniqueBackupPath(PACKAGE_JSON_PATH);
  fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Created backup: ${backupPath}\n`);

  // Update dependencies
  if (packageJson.dependencies) {
    console.log('🔄 Updating dependencies:');

    // Remove old packages and add new ones
    Object.entries(PACKAGE_MIGRATIONS).forEach(([oldPkg, newPkg]) => {
      if (packageJson.dependencies![oldPkg]) {
        console.log(`  - Removing: ${oldPkg}`);
        delete packageJson.dependencies![oldPkg];

        console.log(`  - Adding: ${newPkg}@${TARGET_VERSION}`);
        packageJson.dependencies![newPkg] = TARGET_VERSION;
        modified = true;
      }
    });

    // Update version of all @uniformdev packages (except those being migrated)
    Object.keys(packageJson.dependencies).forEach(pkg => {
      if (pkg.startsWith('@uniformdev/') && !PACKAGE_MIGRATIONS[pkg]) {
        const oldVersion = packageJson.dependencies![pkg];
        if (oldVersion !== TARGET_VERSION) {
          packageJson.dependencies![pkg] = TARGET_VERSION;
          console.log(`  - Updating: ${pkg} (${oldVersion} -> ${TARGET_VERSION})`);
          modified = true;
        }
      }
    });

    // Add new packages
    console.log('\n➕ Adding new dependencies:');
    Object.entries(NEW_PACKAGES).forEach(([pkg, version]) => {
      if (!packageJson.dependencies![pkg]) {
        packageJson.dependencies![pkg] = version;
        console.log(`  - Adding: ${pkg}@${version}`);
        modified = true;
      } else {
        console.log(`  - Skipping (already exists): ${pkg}`);
      }
    });
  }

  // Update devDependencies if needed
  if (packageJson.devDependencies) {
    console.log('\n🔄 Updating devDependencies:');

    // Handle package migrations
    Object.entries(PACKAGE_MIGRATIONS).forEach(([oldPkg, newPkg]) => {
      if (packageJson.devDependencies![oldPkg]) {
        console.log(`  - Removing: ${oldPkg}`);
        delete packageJson.devDependencies![oldPkg];
        console.log(`  - Adding: ${newPkg}@${TARGET_VERSION}`);
        packageJson.devDependencies![newPkg] = TARGET_VERSION;
        modified = true;
      }
    });

    // Update all @uniformdev packages
    Object.keys(packageJson.devDependencies).forEach(pkg => {
      if (pkg.startsWith('@uniformdev/') && !PACKAGE_MIGRATIONS[pkg]) {
        const oldVersion = packageJson.devDependencies![pkg];
        if (oldVersion !== TARGET_VERSION) {
          packageJson.devDependencies![pkg] = TARGET_VERSION;
          console.log(`  - Updating: ${pkg} (${oldVersion} -> ${TARGET_VERSION})`);
          modified = true;
        }
      }
    });
  }

  if (modified) {
    // Write updated package.json
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('\n✅ package.json updated successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Run: pnpm install (or npm install / yarn install)');
    console.log('  2. Run: npx jscodeshift -t codemods/transforms/1-update-imports.js src');
    console.log('\n💡 To rollback: cp package.json.backup package.json');
  } else {
    console.log('\n✅ No changes needed - package.json is already up to date');
    // Remove backup if no changes
    fs.unlinkSync(backupPath);
  }
}

// Run if executed directly
if (require.main === module) {
  const { loadAndResolveConfig, getProjectRoot } = require('../utils/config-loader');
  try {
    const projectRoot = getProjectRoot();
    const config = loadAndResolveConfig(projectRoot);
    updatePackageJson(config);
  } catch (error) {
    console.error('\n❌ Error updating package.json:', (error as Error).message);
    process.exit(1);
  }
}

export { updatePackageJson };
