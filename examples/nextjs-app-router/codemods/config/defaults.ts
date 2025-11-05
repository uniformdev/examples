import type { CodemodConfig } from '../types/config';

/**
 * Centralized default configuration for Uniform codemods.
 * Shared by config loader, initializer, and documentation helpers.
 */

export const TARGET_VERSION = '20.7.1-alpha.83';

type RequiredConfigSection<T extends keyof CodemodConfig> = Required<NonNullable<CodemodConfig[T]>>;

export interface CodemodDefaultConfig {
  rootDir: string;
  types: {
    filePath: string | null;
    namespace: string;
  };
  packages: RequiredConfigSection<'packages'>;
  ignore: RequiredConfigSection<'ignore'>;
  backup: RequiredConfigSection<'backup'>;
  paths: Required<NonNullable<CodemodConfig['paths']>>;
}

export const DEFAULT_CONFIG: CodemodDefaultConfig = {
  rootDir: './',
  types: {
    filePath: null,
    namespace: 'Components',
  },
  packages: {
    mappings: {
      '@uniformdev/canvas-next-rsc': '@uniformdev/canvas-next-rsc-v2',
      '@uniformdev/canvas-next-rsc-client': '@uniformdev/canvas-next-rsc-client-v2',
      '@uniformdev/canvas-next-rsc-shared': '@uniformdev/canvas-next-rsc-shared-v2',
    },
    targetVersion: TARGET_VERSION,
    requiredPackages: [
      { name: '@uniformdev/canvas-next-rsc-v2', version: TARGET_VERSION },
      {
        name: '@uniformdev/canvas-next-rsc-client-v2',
        version: TARGET_VERSION,
      },
      {
        name: '@uniformdev/canvas-next-rsc-shared-v2',
        version: TARGET_VERSION,
      },
      {
        name: '@uniformdev/canvas',
        version: TARGET_VERSION,
      },
      {
        name: '@uniformdev/canvas-react',
        version: TARGET_VERSION,
      },
      {
        name: '@uniformdev/richtext',
        version: TARGET_VERSION,
      },
      {
        name: '@uniformdev/context',
        version: TARGET_VERSION,
      },
    ],
    additionalPackages: [],
  },
  ignore: {
    patterns: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/codemods/**',
      '**/*.backup',
      '**/*.disabled*',
    ],
  },
  backup: {
    files: ['middleware.ts', 'app/[[...path]]/page.tsx', 'app/playground/page.tsx', 'uniform/l18n/localeHelper.ts'],
  },
  paths: {
    flattenParametersOutput: 'utils/canvas/flattenParameters.ts',
    flattenParametersImport: '@/utils/canvas/flattenParameters',
    resolveRouteFromRoutePathOutput: 'utils/canvas/resolveRouteFromRoutePath.ts',
    resolveRouteFromRoutePathImport: '@/utils/canvas/resolveRouteFromRoutePath',
    pageOutput: 'app/uniform/[code]/page.tsx',
    playgroundPageOutput: 'app/playground/[code]/page.tsx',
    notFoundPageOutput: 'app/not-found.tsx',
    uniformServerConfigOutput: 'uniform.server.config.js',
    proxyOutput: 'proxy.ts',
    layoutOutput: 'app/layout.tsx',
    previewRouteOutput: 'app/api/preview/route.ts',
    resolveComponentOutput: 'uniform/resolve.tsx',
    resolveComponentImport: '@/uniform/resolve',
  },
};
