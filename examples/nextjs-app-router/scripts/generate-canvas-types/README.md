# Scripts

## generate-types.ts

Automatically generates TypeScript type definitions from Uniform data stored in the `data/` directory.

### What it generates

The script creates four TypeScript declaration files in `src/types/auto-generated/`:

1. **`Uniform.d.ts`** - Base type definitions from Uniform packages
   - Namespace: `Uniform`
   - Contains core types like `LinkParamValue`, `AssetParamValue`, `Entry`, `BlockValue`, etc.
   - Contains helper types like `ToComponentParameters`, `WithBlockSystemParams`, etc.
   - **Always generated first** as other files depend on these types

2. **`Components.d.ts`** - Component type definitions
   - Namespace: `Components`
   - Source: `data/component/*.yaml`
   - Contains interfaces for all Uniform components with their parameters and slots

3. **`Entries.d.ts`** - Entry type definitions
   - Namespace: `Entries`
   - Source: `data/contentType/*.yaml` (excluding blocks)
   - Contains interfaces for all content types (entries)

4. **`Blocks.d.ts`** - Block type definitions
   - Namespace: `Blocks`
   - Source: `data/contentType/*.yaml` (only contentTypes with `type: 'block'`)
   - Contains interfaces for block-type content types

### Usage

```bash
# Generate all type definitions
pnpm run generate:types
```

The script should be run:

- After pulling data from Uniform (`pnpm run uniform:pull`)
- When component or content type definitions change
- When setting up the project for the first time

### How it works

1. Reads YAML files from `data/component` and `data/contentType` directories
2. Parses YAML using `js-yaml` library
3. Maps Uniform field types to TypeScript types:
   - `text` → `string`
   - `number` → `number`
   - `select` → union of string literals
   - `richText` → `Uniform.ParameterRichTextValue`
   - `asset` → `Uniform.AssetParamValue` (non-flat) / `Uniform.Asset[]` (flat)
   - `contentReference` → `Uniform.Entry<T>` (non-flat) / `Uniform.WithUniformContentEntrySystemParams<T>` (flat)
   - `$block` → `Uniform.BlockValue` (non-flat) / `Uniform.WithBlockSystemParams<T>[]` (flat)
   - etc.
4. Generates **two versions** of each type:
   - **`Parameters`** - Non-flattened parameters (wrapped with `ToComponentParameters`)
   - **`ParametersFlat`** - Flattened parameters (after `flattenParameters` transformation)
5. Generates TypeScript interfaces with proper typing and JSDoc comments
6. Creates union types for all component/entry/block IDs

### Features

- ✅ Automatic type inference from Uniform definitions
- ✅ Required vs optional field detection
- ✅ JSDoc comments from helpText and guidance fields
- ✅ Union types for select options
- ✅ Cross-references between types with proper suffixes (e.g., `Entries.AuthorParameters`)
- ✅ Block references always use `Blocks` namespace (e.g., `Blocks.MetaDataParametersFlat`)
- ✅ Separate Parameters and ParametersFlat types for each component/entry/block
- ✅ Slot definitions for components
- ✅ Alphabetically sorted interfaces

### Type references and namespaces

The script uses the global `Uniform` namespace for base types from Uniform packages:

- `Uniform.LinkParamValue` - for link parameters
- `Uniform.AssetParamValue` - for asset parameters (non-flat)
- `Uniform.Asset` - flattened asset type
- `Uniform.ParameterRichTextValue` - for rich text
- `Uniform.Entry` - for content references (non-flat)
- `Uniform.WithUniformContentEntrySystemParams` - wrapper for content references (flat)
- `Uniform.BlockValue` - for block parameters (non-flat)
- `Uniform.WithBlockSystemParams` - wrapper for block parameters (flat)
- `Uniform.ToComponentParameters` - wrapper for non-flat parameters

### Important: Type reference rules

When generating type references, the script follows these rules:

1. **For `$block` parameters**: Always use `Blocks` namespace
   - Example: `Uniform.WithBlockSystemParams<Blocks.MetaDataParametersFlat>[]`
   - This is because blocks are always defined in the `Blocks` namespace, regardless of where they're used

2. **For `contentReference` parameters**: Use the appropriate namespace based on context
   - In Components: `Uniform.Entry<Entries.AuthorParameters>` or `Uniform.Entry<Blocks.SomeBlockParameters>`
   - In Entries: `Uniform.Entry<Entries.BlogPostCategoryParameters>`
   - In Blocks: `Uniform.Entry<Blocks.SomeBlockParameters>`

3. **Always add the appropriate suffix**:
   - Non-flat types: Add `Parameters` suffix (e.g., `Entries.AuthorParameters`)
   - Flat types: Add `ParametersFlat` suffix (e.g., `Entries.AuthorParametersFlat`)

### Example

Given a component definition in `data/component/badge.yaml`:

```yaml
id: badge
name: Badge
parameters:
  - id: title
    name: Title
    type: text
    typeConfig:
      required: true
  - id: size
    name: Size
    type: select
    typeConfig:
      options:
        - text: Small
          value: sm
        - text: Medium
          value: md
slots:
  - id: content
    name: Content
```

The script generates in `Components.d.ts`:

```typescript
declare namespace Components {
  /**
   * Badge - Parameters
   */
  interface BadgeParams {
    title: string;
    size?: 'sm' | 'md';
  }

  /**
   * Badge - Slots
   */
  type BadgeSlots = 'content';
}
```

For components with multiple slots:

```typescript
declare namespace Components {
  /**
   * Hero - Parameters
   */
  interface HeroParams {
    title: string;
  }

  /**
   * Hero - Slots
   */
  type HeroSlots = 'header' | 'content' | 'footer';
}
```

For components without slots, only `Params` interface is created:

```typescript
declare namespace Components {
  /**
   * SimpleComponent - Parameters
   */
  interface SimpleComponentParams {
    title: string;
  }
}
```
