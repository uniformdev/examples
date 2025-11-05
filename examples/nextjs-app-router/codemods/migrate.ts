#!/usr/bin/env node

/**
 * Main migration script
 * Runs all codemods in the correct order
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { loadAndResolveConfig, getProjectRoot } from './utils/config-loader';
import { initializeConfig } from './utils/ast-helpers';
import backupFiles from './transforms/0-backup-files';
import createAllFiles from './transforms/1-create-new-files';
import { updatePackageJson } from './transforms/2-update-packages';
import type { ResolvedConfig } from './types/config';
import { Logger } from './utils/logger';

const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_INSTALL = process.argv.includes('--skip-install');

interface MigrationContext {
  config: ResolvedConfig;
  logger: Logger;
  dryRun: boolean;
  skipInstall: boolean;
  ignoreArgs: string[];
}

interface MigrationPhase {
  title: string;
  run(context: MigrationContext): Promise<void> | void;
}

async function main(): Promise<void> {
  const logger = new Logger({ dryRun: DRY_RUN });

  renderBanner(logger);

  if (DRY_RUN) {
    logger.warn('🔍 DRY RUN MODE - No changes will be made');
    logger.line();
  }

  logger.task('🔧 Loading configuration...');
  let config: ResolvedConfig;
  try {
    const projectRoot = getProjectRoot();
    config = loadAndResolveConfig(projectRoot);
    logger.success('✅ Configuration loaded successfully');
    logger.detail(`   Project root: ${config.projectRoot}`);
    logger.detail(`   Mappings: ${config.mappings.filePath || 'inline components object'}`);
    logger.detail(`   Types: ${config.types.filePath || 'not configured'}`);
    logger.detail(`   flattenParameters: ${path.relative(config.projectRoot, config.paths.flattenParametersOutput)}`);
    logger.detail(
      `   resolveComponent: ${path.relative(
        config.projectRoot,
        config.paths.resolveComponentOutput
      )} (import: ${config.paths.resolveComponentImport})`
    );
  } catch (error) {
    logger.error(`❌ Failed to load configuration: ${(error as Error).message}`);
    logger.warn('💡 To create a configuration file, run:');
    logger.warn('   npm run init');
    process.exit(1);
  }

  initializeConfig(config);

  await checkGitStatus(logger, DRY_RUN);

  const context: MigrationContext = {
    config,
    logger,
    dryRun: DRY_RUN,
    skipInstall: SKIP_INSTALL,
    ignoreArgs: buildIgnoreArgs(config),
  };

  for (const phase of createPhases(context)) {
    logger.phase(phase.title);
    await phase.run(context);
  }

  printCompletion(context);
}

function renderBanner(logger: Logger): void {
  logger.banner(
    [
      '╔════════════════════════════════════════════════════════════╗',
      '║        Uniform SDK v2 Migration Tool                      ║',
      '╚════════════════════════════════════════════════════════════╝',
    ],
    'magenta'
  );
  logger.line();
}

async function checkGitStatus(logger: Logger, dryRun: boolean): Promise<void> {
  logger.task('🔍 Checking git status...');

  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      logger.warn('⚠️  Warning: You have uncommitted changes');
      logger.warn('It is recommended to commit or stash changes before migration');

      if (!dryRun) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        await new Promise<void>(resolve => {
          rl.question('\nContinue anyway? (y/N): ', answer => {
            rl.close();
            if (answer.toLowerCase() !== 'y') {
              logger.warn('Migration cancelled');
              process.exit(0);
            }
            resolve();
          });
        });
      }
    } else {
      logger.success('✅ Working directory is clean');
    }
  } catch (error) {
    logger.warn('⚠️  Not a git repository or git not available');
  }
}

function buildIgnoreArgs(config: ResolvedConfig): string[] {
  return config.ignore.patterns.map(pattern => `--ignore-pattern=${JSON.stringify(pattern)}`);
}

function createPhases(context: MigrationContext): MigrationPhase[] {
  const flattenParametersArg = `--flattenParametersImportPath=${JSON.stringify(
    context.config.paths.flattenParametersImport
  )}`;

  return [
    {
      title: 'Phase 0: Backup Files',
      run: async ctx => {
        ctx.logger.task('🗃️ Backing up files...');
        await runWithDryRun(ctx, () => backupFiles(ctx.config), 'Would backup specified files');
      },
    },
    {
      title: 'Phase 1: Create New Files',
      run: async ctx => {
        ctx.logger.task('🔧 Creating new files...');
        await runWithDryRun(ctx, () => createAllFiles(ctx.config), 'Would create new files');
      },
    },
    {
      title: 'Phase 2: Update Dependencies',
      run: async ctx => {
        ctx.logger.task('📦 Updating package.json...');
        await runWithDryRun(ctx, () => updatePackageJson(ctx.config), 'Would update package.json');

        if (ctx.skipInstall) {
          ctx.logger.info('Skipping dependency installation (--skip-install)');
          return;
        }

        const packageManager = determinePackageManager(ctx.config.projectRoot);
        runCommand(ctx, `${packageManager} install`, `📥 Installing dependencies with ${packageManager}`, {
          cwd: ctx.config.projectRoot,
        });
      },
    },
    createJscodeshiftPhase({
      title: 'Phase 3: Update Import Statements',
      description: '🔄 Transforming imports',
      transform: 'transforms/3-update-imports.ts',
      extensions: 'ts,tsx,js,jsx',
      parser: 'tsx',
    }),
    createJscodeshiftPhase({
      title: 'Phase 4: Update Type Definitions',
      description: '🔄 Transforming types',
      transform: 'transforms/4-update-types.ts',
      extensions: 'ts,tsx,js,jsx',
      parser: 'tsx',
    }),
    createJscodeshiftPhase({
      title: 'Phase 5: Update Component Signatures',
      description: '🔄 Transforming component signatures',
      transform: 'transforms/5-update-component-signatures.ts',
      extensions: 'tsx,jsx',
      parser: 'tsx',
      extraArgs: [flattenParametersArg],
    }),
    createJscodeshiftPhase({
      title: 'Phase 6: Update Uniform Components',
      description: '🔄 Transforming Uniform components',
      transform: 'transforms/6-update-uniform-components.ts',
      extensions: 'tsx,jsx',
      parser: 'tsx',
    }),
    createJscodeshiftPhase({
      title: 'Phase 7: Update Data Access Patterns',
      description: '🔄 Transforming data access',
      transform: 'transforms/7-update-data-access.ts',
      extensions: 'ts,tsx,js,jsx',
      parser: 'tsx',
    }),
  ];
}

async function runWithDryRun(
  context: MigrationContext,
  operation: () => void | Promise<void>,
  dryRunMessage: string
): Promise<void> {
  if (context.dryRun) {
    context.logger.dryRunNotice(dryRunMessage);
    return;
  }

  try {
    await operation();
    context.logger.success('✅ Success');
  } catch (error) {
    context.logger.error(`❌ Error: ${(error as Error).message}`);
    throw error;
  }
}

function runCommand(
  context: MigrationContext,
  command: string,
  description: string,
  options: { cwd?: string } = {}
): void {
  context.logger.task(`${description}...`);
  context.logger.command(`Command: ${command}`);

  if (context.dryRun) {
    context.logger.dryRunNotice('Would execute command');
    return;
  }

  try {
    execSync(command, { stdio: 'inherit', cwd: options.cwd ?? __dirname });
    context.logger.success('✅ Success');
  } catch (error) {
    context.logger.error(`❌ Error: ${(error as Error).message}`);
    throw error;
  }
}

function createJscodeshiftPhase(options: {
  title: string;
  description: string;
  transform: string;
  extensions: string;
  parser?: string;
  extraArgs?: string[];
}): MigrationPhase {
  return {
    title: options.title,
    run: ctx => {
      const command = buildJscodeshiftCommand(ctx, options);
      runCommand(ctx, command, options.description);
    },
  };
}

function buildJscodeshiftCommand(
  context: MigrationContext,
  options: {
    transform: string;
    extensions: string;
    parser?: string;
    extraArgs?: string[];
  }
): string {
  const args = ['jscodeshift', `-t ${options.transform}`, '../', `--extensions=${options.extensions}`];

  if (options.parser) {
    args.push(`--parser=${options.parser}`);
  }

  args.push(...context.ignoreArgs);

  if (options.extraArgs) {
    args.push(...options.extraArgs);
  }

  return args.join(' ');
}

function determinePackageManager(projectRoot: string): string {
  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
    return 'yarn';
  }
  return 'npm';
}

function printCompletion(context: MigrationContext): void {
  context.logger.banner(
    [
      '╔════════════════════════════════════════════════════════════╗',
      '║               Migration Complete! 🎉                       ║',
      '╚════════════════════════════════════════════════════════════╝',
    ],
    'green'
  );
  context.logger.line();

  if (!context.dryRun) {
    context.logger.info('📝 Next steps:');
    context.logger.line('  1. Review the changes: git diff');
    context.logger.line('  2. Run tests: npm test');
    context.logger.line('  3. Check for type errors: npm run type-check');
    context.logger.line('  4. Fix any remaining issues manually');
    context.logger.line('  5. Commit the changes');
    context.logger.line();
    context.logger.warn('💡 If you need to rollback:');
    context.logger.line('  - Restore package.json: cp package.json.backup package.json');
    context.logger.line('  - Reset changes: git reset --hard HEAD');
    context.logger.line();
  }
}

main().catch(error => {
  const logger = new Logger({ dryRun: DRY_RUN });
  logger.error(`\n❌ Migration failed: ${(error as Error).message}`);
  process.exit(1);
});
