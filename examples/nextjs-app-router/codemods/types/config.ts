/**
 * Configuration schema for Uniform codemods
 */

/**
 * Component mapping: maps component name to its type identifier
 * Example: { "PageComponent": "page", "HeroComponent": "hero" }
 */
export type ComponentMappings = Record<string, string>;

/**
 * Configuration for component mappings
 * Either provide a filePath to parse OR a direct components object
 */
export interface MappingsConfig {
  /**
   * Path to the mappings file (e.g., './uniform/mappings.ts')
   * This file should export component mappings like:
   * export { pageMapping } from "../components/page";
   */
  filePath?: string;

  /**
   * Direct component mappings object
   * Takes priority over filePath if both are provided
   * Example: { "PageComponent": "page", "HeroComponent": "hero" }
   */
  components?: ComponentMappings;
}

/**
 * Configuration for auto-generated types
 */
export interface TypesConfig {
  /**
   * Path to the auto-generated types file (e.g., './types/auto-generated/Components.d.ts')
   * This file should contain types like:
   * declare namespace Components {
   *   type PageParameters = ...;
   *   interface PageParametersFlat { ... }
   *   type PageSlots = ...;
   * }
   */
  filePath?: string;

  /**
   * Namespace name for component types
   * @default "Components"
   */
  namespace?: string;
}

/**
 * Configuration for generated file locations and related import paths
 */
export interface PathsConfig {
  /**
   * Output path for the generated flattenParameters utility
   * @default "src/utils/canvas/flattenParameters.ts"
   */
  flattenParametersOutput?: string;

  /**
   * Import path used by components for the flattenParameters utility
   * @default "@/utils/canvas/flattenParameters"
   */
  flattenParametersImport?: string;

  /**
   * Output path for the resolveRouteFromRoutePath utility
   * @default "src/utils/canvas/resolveRouteFromRoutePath.ts"
   */
  resolveRouteFromRoutePathOutput?: string;

  /**
   * Import path used when referencing resolveRouteFromRoutePath
   * @default "@/utils/canvas/resolveRouteFromRoutePath"
   */
  resolveRouteFromRoutePathImport?: string;

  /**
   * Output path for the Uniform page route
   * @default "app/uniform/[code]/page.tsx"
   */
  pageOutput?: string;

  /**
   * Output path for the Uniform playground page
   * @default "app/playground/[code]/page.tsx"
   */
  playgroundPageOutput?: string;

  /**
   * Output path for the global not-found page
   * @default "app/not-found.tsx"
   */
  notFoundPageOutput?: string;

  /**
   * Output path for the Uniform server configuration file
   * @default "uniform.server.config.js"
   */
  uniformServerConfigOutput?: string;

  /**
   * Output path for the proxy entry point
   * @default "proxy.ts"
   */
  proxyOutput?: string;

  /**
   * Output path for the root layout file
   * @default "app/layout.tsx"
   */
  layoutOutput?: string;

  /**
   * Output path for the preview route handler
   * @default "app/api/preview/route.ts"
   */
  previewRouteOutput?: string;

  /**
   * Output path for the resolveComponent helper
   * @default "uniform/resolve.tsx"
   */
  resolveComponentOutput?: string;

  /**
   * Import path used when referencing resolveComponent
   * @default "@/uniform/resolve"
   */
  resolveComponentImport?: string;
}

/**
 * Configuration for package updates
 */
export interface PackagesConfig {
  /**
   * Package name mappings for migration
   * Maps old package name to new package name
   * @default {
   *   "@uniformdev/canvas-next-rsc": "@uniformdev/canvas-next-rsc-v2",
   *   "@uniformdev/canvas-next-rsc-client": "@uniformdev/canvas-next-rsc-client-v2",
   *   "@uniformdev/canvas-next-rsc-shared": "@uniformdev/canvas-next-rsc-shared-v2"
   * }
   */
  mappings?: Record<string, string>;

  /**
   * Target version for Uniform SDK packages
   * Can be overridden by UNIFORM_VERSION environment variable
   * @default "20.7.1-alpha.83"
   */
  targetVersion?: string;

  /**
   * Required packages that must be installed during migration
   * These packages will be added even if they didn't exist before
   * @default [
   *   { name: "@uniformdev/canvas-next-rsc-v2", version: "20.7.1-alpha.83" },
   *   { name: "@uniformdev/canvas-next-rsc-client-v2", version: "20.7.1-alpha.83" },
   *   { name: "@uniformdev/canvas-next-rsc-shared-v2", version: "20.7.1-alpha.83" }
   * ]
   */
  requiredPackages?: Array<{ name: string; version: string }>;

  /**
   * Additional packages to add during migration
   * @default [{ name: "server-only-context", version: "^0.1.0" }]
   */
  additionalPackages?: Array<{ name: string; version: string }>;
}

/**
 * Configuration for file ignore patterns
 */
export interface IgnoreConfig {
  /**
   * Glob patterns for files/directories to ignore during transformation
   */
  patterns?: string[];
}

/**
 * Configuration for backing up files
 */
export interface BackupConfig {
  /**
   * List of file paths to create backups for before migration
   * Paths are relative to the project root
   * @example ["middleware.ts", "app/layout.tsx"]
   */
  files?: string[];
}

/**
 * Main configuration interface for Uniform codemods
 */
export interface CodemodConfig {
  /**
   * Root directory for file operations
   * All file paths created by codemods will be relative to this directory
   * @default "../" (parent directory of codemods folder)
   */
  rootDir?: string;

  /**
   * Component mappings configuration
   * At least one of filePath or components is required
   */
  mappings: MappingsConfig;

  /**
   * Auto-generated types configuration
   * Optional but recommended for better type transformations
   */
  types?: TypesConfig;

  /**
   * Package update configuration
   */
  packages?: PackagesConfig;

  /**
   * File ignore patterns
   */
  ignore?: IgnoreConfig;

  /**
   * Backup configuration for specific files
   */
  backup?: BackupConfig;

  /**
   * Generated file locations and corresponding import paths
   */
  paths?: PathsConfig;
}

/**
 * Resolved configuration with all defaults applied and paths resolved
 */
export interface ResolvedConfig extends CodemodConfig {
  /**
   * Absolute path to the project root directory
   */
  projectRoot: string;

  /**
   * Resolved root directory (absolute path)
   */
  rootDir: string;

  /**
   * All paths in mappings and types are resolved to absolute paths
   */
  mappings: Required<MappingsConfig> & {
    filePath: string | null;
    components: ComponentMappings;
  };

  types: Required<TypesConfig> & {
    filePath: string | null;
  };

  packages: Required<PackagesConfig>;

  ignore: Required<IgnoreConfig>;

  backup: Required<BackupConfig>;

  paths: Required<PathsConfig>;
}

/**
 * Validation error details
 */
export interface ConfigValidationError {
  field: string;
  message: string;
}
