# Uniform SDK v2 Migration Codemods

Automated code transformation tools for migrating from Uniform SDK v1 to v2.

## Installation

```bash
npm install -g jscodeshift
```

## Quick Start

### 1. Generate Configuration

First, create a configuration file for your project:

```bash
npm run init
```

This will:

- Auto-discover your project structure
- Detect component mappings and types files
- Generate a `codemod.config.ts` file with your project's settings

You can also run in auto mode (non-interactive):

```bash
npm run init -- --auto
```

### 2. Review Configuration

Edit the generated `codemod.config.ts` to customize paths and settings for your project.

See [codemod.config.example.ts](./codemod.config.example.ts) for all available options and examples.

### 3. Run Migration

Run all migrations in order:

```bash
npm run migrate
```

Or run in dry-run mode to preview changes:

```bash
npm run dry-run
```

Or run individual codemods:

```bash
# Phase 0: Create utilities
npm run migrate:create-utils

# Phase 1: Update dependencies
npm run migrate:packages

# Phase 2: Update imports
npm run migrate:imports

# Phase 3: Update types
npm run migrate:types

# Phase 4: Update component signatures
npm run migrate:signatures

# Phase 5: Update Uniform components
npm run migrate:uniform-components

# Phase 6: Update data access patterns
npm run migrate:data-access
```

## Configuration

The codemods use a `codemod.config.ts` file to adapt to different project structures.

### Required Configuration

At minimum, you must specify component mappings:

```typescript
const config: CodemodConfig = {
  mappings: {
    // Option 1: Path to mappings file
    filePath: './uniform/mappings.ts',

    // Option 2: Direct component mappings
    components: {
      PageComponent: 'page',
      HeroComponent: 'hero',
    },
  },
};
```

### Full Configuration Options

All canonical defaults live in [codemods/config/defaults.ts](./config/defaults.ts).
See [codemod.config.example.ts](./codemod.config.example.ts) for tailored examples:

- **mappings**: Component mappings (file path or direct object)
- **types**: Auto-generated types configuration
- **paths**: Output paths for generated utilities
- **packages**: Package version mappings
- **ignore**: File/directory patterns to ignore
- **backup**: Files to disable before migration (each file is renamed with a `.disabled` suffix)

### Different Project Structures

The configuration system supports various project layouts (override `DEFAULT_CONFIG.paths` to change the template defaults):

```typescript
// Next.js App Router
paths: {
  flattenParametersOutput: 'app/utils/flattenParameters.ts',
  flattenParametersImport: '@/app/utils/flattenParameters',
  resolveComponentOutput: 'app/uniform/resolve.tsx',
  resolveComponentImport: '@/app/uniform/resolve',
}

// Traditional src/ structure
paths: {
  flattenParametersOutput: 'src/utils/canvas/flattenParameters.ts',
  flattenParametersImport: '@/utils/canvas/flattenParameters',
  resolveComponentOutput: 'uniform/resolve.tsx',
  resolveComponentImport: '@/uniform/resolve',
}

// Custom lib/ structure
paths: {
  flattenParametersOutput: 'lib/uniform/flattenParameters.ts',
  flattenParametersImport: '@/lib/uniform/flattenParameters',
  resolveComponentOutput: 'lib/uniform/resolve.tsx',
  resolveComponentImport: '@/lib/uniform/resolve',
}
```

### Backup Files Before Migration

You can specify files to backup before migration by adding them to the `backup.files` array:

```typescript
backup: {
  files: [
    'middleware.ts',
    'app/layout.tsx',
    'lib/custom-uniform-config.ts',
  ],
}
```

The migration will rename each listed file with a `.disabled` suffix before any changes are made. For example, `middleware.ts` becomes `middleware.ts.disabled`.

**Note:** Files ending in `.disabled` (and `.disabled.*`) are automatically excluded from subsequent transformations.

## Migration Phases

### Phase 0: Disable Files

- Renames files listed in `backup.files` to `<filename>.disabled`
- Skips files that don't exist
- **Disabled files are NOT transformed** - they are preserved as-is for safety
- Runs before any other migration steps

### Phase 1: Create New Files

- Creates new files: `flattenParameters.ts`, `page.tsx`, `playground page.tsx`, `proxy.ts`, `resolveRouteFromRoutePath.ts`, `not-found.tsx`, `uniform.server.config.js`
- Backup is handled in Phase 0
- Overwrites existing files
- Respects custom output paths from config

### Phase 2: Package Dependencies

- Updates `package.json` with v2 packages
- Removes old packages
- Adds new dependencies

### Phase 3: Import Statements

- Updates all imports from `@uniformdev/canvas-next-rsc` to `@uniformdev/canvas-next-rsc-v2`
- Updates related package imports

### Phase 4: Type Definitions

- Replaces `Type.ComponentProps` with `Canvas.ComponentProps`
- Creates separate `Parameters` interfaces
- Maps to auto-generated `Components.*Parameters` types
- Updates type namespaces

### Phase 5: Component Signatures

- Updates component props destructuring
- Adds `flattenParameters` calls with proper type annotations
- Removes `context` prop usage
- Uses auto-generated `Components.*ParametersFlat` types
- Updates `variant` access

### Phase 6: Uniform Components

- Updates `UniformText` components (`parameterId` → `parameter`)
- Updates `UniformSlot` components (removes `data` and `context`)
- Updates `UniformRichText` components (`parameterId` → `parameter`)

### Phase 7: Data Access

- Updates variant access (`component.variant` → `variant`)
- Adds TODO comments for draft mode checks (requires manual async refactoring)

## Testing

Each codemod has corresponding tests:

```bash
npm test
```

## Manual Review Required

After running codemods, manually review:

- Component logic changes
- Type correctness
- Async component patterns
- Edge cases not covered by codemods

## Rollback

Before running migrations, ensure you have:

1. Committed all changes
2. Created a backup branch
3. Can rollback with `git reset --hard HEAD`
