#!/usr/bin/env node

/**
 * Initialize codemod configuration
 * Creates a codemod.config.ts file with auto-discovered or user-specified settings
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { DEFAULT_CONFIG } from './config/defaults';

const AUTO_MODE = process.argv.includes('--auto');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset): void {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Auto-discover common file paths
 */
function discoverPaths(projectRoot: string): {
  mappingsPath: string | null;
  typesPath: string | null;
} {
  const possibleMappingsPaths = [
    'uniform/mappings.ts',
    'src/uniform/mappings.ts',
    'lib/uniform/mappings.ts',
    'canvas/mappings.ts',
    'components/mappings.ts',
  ];

  const possibleTypesPaths = [
    'types/auto-generated/Components.d.ts',
    'src/types/auto-generated/Components.d.ts',
    'types/Components.d.ts',
    '@types/Components.d.ts',
  ];

  let mappingsPath: string | null = null;
  let typesPath: string | null = null;

  // Find mappings file
  for (const relativePath of possibleMappingsPaths) {
    const fullPath = path.join(projectRoot, relativePath);
    if (fs.existsSync(fullPath)) {
      mappingsPath = relativePath;
      break;
    }
  }

  // Find types file
  for (const relativePath of possibleTypesPaths) {
    const fullPath = path.join(projectRoot, relativePath);
    if (fs.existsSync(fullPath)) {
      typesPath = relativePath;
      break;
    }
  }

  return { mappingsPath, typesPath };
}

/**
 * Prompt user for input
 */
async function prompt(question: string, defaultValue?: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const defaultText = defaultValue ? ` (default: ${defaultValue})` : '';
  const fullQuestion = `${question}${defaultText}: `;

  return new Promise(resolve => {
    rl.question(fullQuestion, answer => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

/**
 * Generate config file content
 */
function generateConfigContent(options: {
  mappingsPath: string | null;
  typesPath: string | null;
  defaults: typeof DEFAULT_CONFIG;
}): string {
  const { mappingsPath, typesPath, defaults } = options;
  const { paths, packages, ignore, backup, types, rootDir } = defaults;

  const formatObjectEntries = (obj: Record<string, string>, indent: number, quoteKeys: boolean = false): string => {
    const pad = ' '.repeat(indent);
    return Object.entries(obj)
      .map(([key, value]) => {
        const formattedKey = quoteKeys ? `'${key}'` : key;
        return `${pad}${formattedKey}: '${value}',`;
      })
      .join('\n');
  };

  const formatStringArray = (values: string[], indent: number): string => {
    const pad = ' '.repeat(indent);
    return values.map(value => `${pad}'${value}',`).join('\n');
  };

  const formatPackageArray = (values: Array<{ name: string; version: string }>, indent: number): string => {
    const pad = ' '.repeat(indent);
    return values.map(pkg => `${pad}{ name: '${pkg.name}', version: '${pkg.version}' },`).join('\n');
  };

  const mappingsEntries = formatObjectEntries(packages.mappings, 6, true);
  const requiredPackagesEntries = formatPackageArray(packages.requiredPackages, 6);
  const additionalPackagesEntries =
    packages.additionalPackages.length > 0 ? formatPackageArray(packages.additionalPackages, 6) : '';
  const ignorePatternsEntries = formatStringArray(ignore.patterns, 6);
  const backupFilesEntries =
    backup.files.length > 0
      ? formatStringArray(backup.files, 6)
      : `      // Add files you want to disable before migration`;
  const pathsEntries = formatObjectEntries(paths, 4);

  const additionalPackagesContent =
    packages.additionalPackages.length > 0
      ? `    additionalPackages: [\n${additionalPackagesEntries}\n    ],`
      : '    additionalPackages: [],';

  const typesFilePathValue = typesPath ? `'${typesPath}'` : types.filePath ? `'${types.filePath}'` : 'undefined';

  return `import type { CodemodConfig } from './codemods/types/config';

/**
 * Uniform Codemods Configuration
 *
 * This file configures the codemod transformations for your project.
 * All file paths are relative to the project root.
 */
const config: CodemodConfig = {
  // Root directory for file operations (default: "./" - current directory)
  // All generated files will be created relative to this directory
  rootDir: '${rootDir}',
  /**
   * Component mappings configuration
   *
   * Option 1: Specify a file path to parse component mappings
   * The file should export component mappings like:
   *   export { pageMapping } from "../components/page";
   */
  mappings: {
    filePath: ${mappingsPath ? `'${mappingsPath}'` : 'undefined'},

    /**
     * Option 2: Provide direct component mappings object (takes priority over filePath)
     * Uncomment and customize if you want to specify mappings directly:
     *
     * components: {
     *   'PageComponent': 'page',
     *   'HeroComponent': 'hero',
     *   'CallToActionComponent': 'callToAction',
     * },
     */
  },

  /**
   * Auto-generated types configuration (optional but recommended)
   */
  types: {
    filePath: ${typesFilePathValue},
    namespace: '${types.namespace}', // Namespace for component types
  },

  /**
   * Backup configuration
   * Specify files to disable before migration
   */
  backup: {
    files: [
${backupFilesEntries}
    ],
  },

  /**
   * Package migration configuration
   */
  packages: {
    mappings: {
${mappingsEntries}
    },
    targetVersion: '${packages.targetVersion}',
    // Required packages (will be installed even if they didn't exist before)
    requiredPackages: [
${requiredPackagesEntries}
    ],
${additionalPackagesContent}
  },

  /**
   * File/directory ignore patterns (glob patterns)
   */
  ignore: {
    patterns: [
${ignorePatternsEntries}
    ],
  },

  /**
   * Generated file locations (customize for your project structure)
   */
  paths: {
${pathsEntries}
  },
};

export default config;
`;
}

async function main(): Promise<void> {
  log('\n╔════════════════════════════════════════════════════════════╗', colors.cyan);
  log('║        Uniform Codemod Configuration Setup                ║', colors.cyan);
  log('╚════════════════════════════════════════════════════════════╝\n', colors.cyan);

  // Get project root (parent directory of codemods)
  const codemodsDir = __dirname;
  const projectRoot = path.dirname(codemodsDir);
  const configPath = path.join(projectRoot, 'codemod.config.ts');

  // Check if config already exists
  if (fs.existsSync(configPath)) {
    log('⚠️  Configuration file already exists:', colors.yellow);
    log(`   ${configPath}\n`, colors.yellow);

    if (!AUTO_MODE) {
      const overwrite = await prompt('Overwrite existing configuration? (y/N)');
      if (overwrite.toLowerCase() !== 'y') {
        log('Setup cancelled.', colors.yellow);
        process.exit(0);
      }
    } else {
      log('❌ Configuration file already exists. Use --auto to overwrite is not supported.', colors.red);
      process.exit(1);
    }
  }

  log('🔍 Auto-discovering project structure...\n', colors.cyan);
  const discovered = discoverPaths(projectRoot);

  let mappingsPath = discovered.mappingsPath;
  let typesPath = discovered.typesPath;

  if (discovered.mappingsPath) {
    log(`✅ Found mappings file: ${discovered.mappingsPath}`, colors.green);
  } else {
    log('⚠️  Could not find mappings file', colors.yellow);
  }

  if (discovered.typesPath) {
    log(`✅ Found types file: ${discovered.typesPath}`, colors.green);
  } else {
    log('⚠️  Could not find auto-generated types file', colors.yellow);
  }

  // Interactive mode: allow user to customize paths
  if (!AUTO_MODE) {
    log('\n📝 Configure paths (press Enter to use detected/default values)\n', colors.cyan);

    mappingsPath = await prompt('Path to component mappings file', mappingsPath || 'uniform/mappings.ts');

    typesPath = await prompt(
      'Path to auto-generated types file (optional)',
      typesPath || 'types/auto-generated/Components.d.ts'
    );
  }

  // Validate required paths
  if (!mappingsPath) {
    log('\n❌ Error: Mappings file path is required', colors.red);
    log('   Either provide a file path or manually edit the config to use direct component mappings', colors.yellow);
    process.exit(1);
  }

  const fullMappingsPath = path.join(projectRoot, mappingsPath);
  if (!fs.existsSync(fullMappingsPath)) {
    log(`\n⚠️  Warning: Mappings file not found at: ${mappingsPath}`, colors.yellow);
    log('   You can create this file or edit the config to use direct component mappings\n', colors.yellow);
  }

  if (typesPath) {
    const fullTypesPath = path.join(projectRoot, typesPath);
    if (!fs.existsSync(fullTypesPath)) {
      log(`\n⚠️  Warning: Types file not found at: ${typesPath}`, colors.yellow);
      log('   Auto-generated types are optional but recommended for better transformations\n', colors.yellow);
    }
  }

  // Generate config file
  log('\n📄 Generating configuration file...\n', colors.cyan);

  const configContent = generateConfigContent({
    mappingsPath,
    typesPath,
    defaults: DEFAULT_CONFIG,
  });

  fs.writeFileSync(configPath, configContent, 'utf8');

  log('✅ Configuration file created:', colors.green);
  log(`   ${configPath}\n`, colors.green);

  log('📝 Next steps:', colors.cyan);
  log('   1. Review and customize the configuration file', colors.reset);
  log('   2. Run the migration: npm run migrate', colors.reset);
  log('   3. Check the generated codemod.config.example.ts for more options\n', colors.reset);
}

// Run setup
main().catch(error => {
  log(`\n❌ Setup failed: ${(error as Error).message}`, colors.red);
  process.exit(1);
});
