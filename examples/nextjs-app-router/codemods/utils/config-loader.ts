import * as fs from 'fs';
import * as path from 'path';
import { CodemodConfig, ResolvedConfig, ConfigValidationError } from '../types/config';
import { DEFAULT_CONFIG } from '../config/defaults';
export { TARGET_VERSION } from '../config/defaults';

/**
 * Load configuration from codemod.config.ts file
 * @param projectRoot - Absolute path to the project root directory
 * @returns Loaded configuration or null if not found
 */
export function loadConfig(projectRoot: string): CodemodConfig | null {
  const configPath = path.resolve(projectRoot, 'codemod.config.ts');

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    // Use require to load TypeScript config (requires ts-node to be registered)
    // Clear require cache to allow reloading
    delete require.cache[configPath];

    const configModule = require(configPath);
    const config = configModule.default || configModule;

    return config as CodemodConfig;
  } catch (error) {
    throw new Error(
      `Failed to load config from ${configPath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Validate configuration and throw if invalid
 * @param config - Configuration to validate
 * @throws Error with validation details
 */
export function validateConfig(config: CodemodConfig): void {
  const errors: ConfigValidationError[] = [];

  // Validate mappings: either filePath or components must be provided
  if (!config.mappings) {
    errors.push({
      field: 'mappings',
      message: 'mappings configuration is required',
    });
  } else if (!config.mappings.filePath && !config.mappings.components) {
    errors.push({
      field: 'mappings',
      message: 'Either mappings.filePath or mappings.components must be provided',
    });
  }

  // Validate mappings.components if provided
  if (config.mappings?.components) {
    if (typeof config.mappings.components !== 'object') {
      errors.push({
        field: 'mappings.components',
        message: 'mappings.components must be an object',
      });
    } else if (Object.keys(config.mappings.components).length === 0) {
      errors.push({
        field: 'mappings.components',
        message: 'mappings.components cannot be empty',
      });
    }
  }

  // Validate package mappings if provided
  if (config.packages?.mappings) {
    if (typeof config.packages.mappings !== 'object') {
      errors.push({
        field: 'packages.mappings',
        message: 'packages.mappings must be an object',
      });
    }
  }

  // Validate ignore patterns if provided
  if (config.ignore?.patterns) {
    if (!Array.isArray(config.ignore.patterns)) {
      errors.push({
        field: 'ignore.patterns',
        message: 'ignore.patterns must be an array',
      });
    } else if (config.ignore.patterns.some(p => typeof p !== 'string')) {
      errors.push({
        field: 'ignore.patterns',
        message: 'All ignore.patterns must be strings',
      });
    }
  }

  // Validate paths if provided
  if (config.paths) {
    Object.entries(config.paths).forEach(([key, value]) => {
      if (value != null && typeof value !== 'string') {
        errors.push({
          field: `paths.${key}`,
          message: 'paths entries must be strings',
        });
      }
    });
  }

  if (errors.length > 0) {
    const errorMessages = errors.map(e => `  - ${e.field}: ${e.message}`).join('\n');
    throw new Error(`Configuration validation failed:\n${errorMessages}`);
  }
}

/**
 * Resolve relative paths in configuration to absolute paths
 * @param config - Configuration with potentially relative paths
 * @param projectRoot - Absolute path to the project root directory
 * @returns Configuration with all paths resolved to absolute paths
 */
export function resolveConfigPaths(config: CodemodConfig, projectRoot: string): ResolvedConfig {
  // Resolve rootDir (default to parent directory of codemods folder)
  const rootDir = config.rootDir ? path.resolve(projectRoot, config.rootDir) : path.resolve(projectRoot, '../');

  // Merge with defaults
  const resolved: ResolvedConfig = {
    projectRoot,
    rootDir,
    mappings: {
      filePath: null as string | null,
      components: {},
      ...config.mappings,
    } as ResolvedConfig['mappings'],
    types: {
      filePath: null as string | null,
      namespace: 'Components',
      ...config.types,
    } as ResolvedConfig['types'],
    packages: {
      ...DEFAULT_CONFIG.packages,
      ...config.packages,
      mappings: {
        ...DEFAULT_CONFIG.packages.mappings,
        ...config.packages?.mappings,
      },
      requiredPackages: config.packages?.requiredPackages || DEFAULT_CONFIG.packages.requiredPackages,
      additionalPackages: config.packages?.additionalPackages || DEFAULT_CONFIG.packages.additionalPackages,
    },
    ignore: {
      ...DEFAULT_CONFIG.ignore,
      ...config.ignore,
    },
    backup: {
      ...DEFAULT_CONFIG.backup,
      ...config.backup,
    },
    paths: {
      ...DEFAULT_CONFIG.paths,
      ...config.paths,
    },
  };

  const resolveMaybeRelative = (baseDir: string, targetPath: string) => {
    return path.isAbsolute(targetPath) ? targetPath : path.resolve(baseDir, targetPath);
  };

  const defaultPaths = DEFAULT_CONFIG.paths;
  const userPaths = config.paths || {};

  resolved.paths = {
    flattenParametersOutput: resolveMaybeRelative(
      rootDir,
      userPaths.flattenParametersOutput || defaultPaths.flattenParametersOutput
    ),
    flattenParametersImport: userPaths.flattenParametersImport || defaultPaths.flattenParametersImport,
    resolveRouteFromRoutePathOutput: resolveMaybeRelative(
      rootDir,
      userPaths.resolveRouteFromRoutePathOutput || defaultPaths.resolveRouteFromRoutePathOutput
    ),
    resolveRouteFromRoutePathImport:
      userPaths.resolveRouteFromRoutePathImport || defaultPaths.resolveRouteFromRoutePathImport,
    pageOutput: resolveMaybeRelative(rootDir, userPaths.pageOutput || defaultPaths.pageOutput),
    playgroundPageOutput: resolveMaybeRelative(
      rootDir,
      userPaths.playgroundPageOutput || defaultPaths.playgroundPageOutput
    ),
    notFoundPageOutput: resolveMaybeRelative(rootDir, userPaths.notFoundPageOutput || defaultPaths.notFoundPageOutput),
    uniformServerConfigOutput: resolveMaybeRelative(
      rootDir,
      userPaths.uniformServerConfigOutput || defaultPaths.uniformServerConfigOutput
    ),
    proxyOutput: resolveMaybeRelative(rootDir, userPaths.proxyOutput || defaultPaths.proxyOutput),
    layoutOutput: resolveMaybeRelative(rootDir, userPaths.layoutOutput || defaultPaths.layoutOutput),
    previewRouteOutput: resolveMaybeRelative(rootDir, userPaths.previewRouteOutput || defaultPaths.previewRouteOutput),
    resolveComponentOutput: resolveMaybeRelative(
      rootDir,
      userPaths.resolveComponentOutput || defaultPaths.resolveComponentOutput
    ),
    resolveComponentImport: userPaths.resolveComponentImport || defaultPaths.resolveComponentImport,
  };

  // Resolve mappings.filePath if provided
  if (config.mappings.filePath) {
    const resolvedPath = path.resolve(projectRoot, config.mappings.filePath);
    if (!fs.existsSync(resolvedPath)) {
      console.warn(`Warning: mappings.filePath does not exist: ${resolvedPath}`);
    }
    resolved.mappings.filePath = resolvedPath;
  }

  // Use direct components if provided (takes priority)
  if (config.mappings.components) {
    resolved.mappings.components = config.mappings.components;
  }

  // Resolve types.filePath if provided
  if (config.types?.filePath) {
    const resolvedPath = path.resolve(projectRoot, config.types.filePath);
    if (!fs.existsSync(resolvedPath)) {
      console.warn(`Warning: types.filePath does not exist: ${resolvedPath}`);
    }
    resolved.types.filePath = resolvedPath;
  }

  // Resolve backup file paths
  if (resolved.backup.files && resolved.backup.files.length > 0) {
    resolved.backup.files = resolved.backup.files.map(filePath => path.resolve(projectRoot, filePath));
  }

  return resolved;
}

/**
 * Load, validate, and resolve configuration
 * This is the main entry point for loading configuration
 * @param projectRoot - Absolute path to the project root directory
 * @returns Resolved configuration
 * @throws Error if config not found or invalid
 */
export function loadAndResolveConfig(projectRoot: string): ResolvedConfig {
  const config = loadConfig(projectRoot);

  if (!config) {
    throw new Error(
      `Configuration file not found. Please create codemod.config.ts in the project root.\n` +
        `Run 'npm run init' to generate a default configuration file.`
    );
  }

  validateConfig(config);
  return resolveConfigPaths(config, projectRoot);
}

/**
 * Get the project root directory from the codemods directory
 * Assumes codemods are in a 'codemods' subdirectory of the project
 * @returns Absolute path to the project root
 */
export function getProjectRoot(): string {
  // Get the directory where this file is located (codemods/utils/)
  const utilsDir = __dirname;

  // Go up two levels: codemods/utils -> codemods -> project root
  const codemodsDir = path.dirname(utilsDir);
  const projectRoot = path.dirname(codemodsDir);

  return projectRoot;
}

/**
 * Check if a file should be ignored based on ignore patterns
 * @param filePath - File path to check (can be relative or absolute)
 * @param config - Resolved configuration
 * @returns true if file should be ignored
 */
export function shouldIgnoreFile(filePath: string, config: ResolvedConfig): boolean {
  const normalizedPath = path.normalize(filePath);
  const normalizedPosix = normalizedPath.replace(/\\/g, '/');
  const relativePath = path.relative(config.projectRoot, normalizedPath).replace(/\\/g, '/');

  const escapeRegex = (str: string) => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

  const globToRegExp = (pattern: string) => {
    const escaped = escapeRegex(pattern)
      .replace(/\\\*\\\*/g, ':::GLOBSTAR:::')
      .replace(/\\\*/g, '[^/]*')
      .replace(/\\\?/g, '[^/]');
    const finalPattern = escaped.replace(/:::GLOBSTAR:::/g, '.*');
    return new RegExp(`^${finalPattern}$`);
  };

  return config.ignore.patterns.some(pattern => {
    const regex = globToRegExp(pattern.replace(/\\/g, '/'));
    return regex.test(normalizedPosix) || regex.test(relativePath);
  });
}
