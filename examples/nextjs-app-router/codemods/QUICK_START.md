# Quick Start: Uniform SDK v2 Migration

## Prerequisites

1. **Commit all changes** or create a backup branch
2. **Node.js 18+** installed
3. **Git** repository initialized

## Installation

```bash
cd codemods
npm install
```

## Configuration

- Defaults for packages, paths, and helper outputs are centralized in [`codemods/config/defaults.ts`](./config/defaults.ts).
- Generate a project-specific config with `npm run init`, then adjust only the fields you need—the generator pulls directly from the shared defaults.

## Usage

### Option 1: Run all migrations at once (Recommended)

```bash
cd codemods
node migrate.js
```

This will:

1. ✅ Update `package.json` dependencies
2. ✅ Install new packages
3. ✅ Transform all import statements
4. ✅ Update type definitions
5. ✅ Transform component signatures
6. ✅ Update Uniform components (UniformText, UniformSlot, etc.)
7. ✅ Update data access patterns

### Option 2: Dry run first (see what will change)

```bash
cd codemods
node migrate.js --dry-run
```

### Option 3: Run individual phases

```bash
cd codemods

# Phase 0: Update packages
node transforms/0-update-packages.js

# Install dependencies
cd .. && pnpm install && cd codemods

# Phase 1: Update imports
npm run migrate:imports

# Phase 2: Update types
npm run migrate:types

# Phase 3: Update component signatures
npm run migrate:signatures

# Phase 4: Update Uniform components
npm run migrate:uniform-components

# Phase 5: Update data access
npm run migrate:data-access
```

## After Migration

1. **Review changes**:

   ```bash
   git diff
   ```

2. **Check for TypeScript errors**:

   ```bash
   npm run type-check
   # or
   npx tsc --noEmit
   ```

3. **Run tests**:

   ```bash
   npm test
   ```

4. **Fix remaining issues** (see MANUAL_FIXES.md)

5. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: migrate to Uniform SDK v2"
   ```

## Rollback

If something goes wrong:

```bash
# Restore package.json (if backup exists)
cp package.json.backup package.json

# Reset all code changes
git reset --hard HEAD

# Or reset to specific commit
git reset --hard <commit-hash>
```

## Common Issues

### Issue: Import errors after migration

**Solution**: Make sure you ran `pnpm install` after Phase 0

### Issue: Type errors with `Canvas.ComponentProps`

**Solution**: Check that your component parameters are correctly typed. You may need to manually adjust some complex types.

### Issue: `flattenParameters` is not imported

**Solution**: The codemod should add the import automatically. If not, add:

```typescript
import flattenParameters from '@/utils/canvas/flattenParameters';
```

### Issue: Some components still use old patterns

**Solution**: Check MANUAL_FIXES.md for patterns that require manual migration

## Testing the Codemods

To test codemods without affecting your code:

```bash
cd codemods
npm test
```

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Check [MANUAL_FIXES.md](./MANUAL_FIXES.md) for patterns requiring manual work
- Review the original migration commit: `git show 479c29e9fa472cafc0d3a3ac3d47030978546513`
