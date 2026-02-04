# Svelte Starter for Uniform

A SvelteKit application integrated with Uniform's visual composition and personalization platform. This starter demonstrates how to build component-driven pages with visual editing capabilities and edge-side personalization.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Uniform SDK Integration](#uniform-sdk-integration)
- [Key Files Explained](#key-files-explained)
- [Components with Uniform SDK](#components-with-uniform-sdk)
- [Building](#building)

---

## Overview

This project combines:
- **SvelteKit** - Full-stack web framework for Svelte
- **Uniform Canvas** - Visual composition system for building pages from components
- **Uniform Context** - Personalization and A/B testing engine
- **Vercel Edge Middleware** - Server-side personalization at the edge

Content editors can visually compose pages in Uniform Canvas, while developers maintain full control over component implementation in Svelte.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel Edge                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  middleware.ts                                           │   │
│  │  - Initializes Uniform Context with manifest             │   │
│  │  - Processes visitor signals (cookies, URL)              │   │
│  │  - Handles NESI (Nested Edge-Side Includes) replacement  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SvelteKit Application                       │
│                                                                 │
│  ┌──────────────────┐    ┌─────────────────────────────────┐   │
│  │ hooks.server.ts  │    │ +layout.svelte                  │   │
│  │ - Preview mode   │    │ - UniformContext provider       │   │
│  │   detection      │    │ - Client-side context init      │   │
│  └──────────────────┘    └─────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [...path]/+page.server.ts                               │   │
│  │ - Fetches composition from Uniform Canvas API           │   │
│  │ - Uses RouteClient for project map resolution           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [...path]/+page.svelte                                  │   │
│  │ - UniformComposition renders the component tree         │   │
│  │ - componentMap maps Uniform types → Svelte components   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Components (Hero, Card, Container, Grid, etc.)          │   │
│  │ - Use UniformText/UniformRichText for inline editing    │   │
│  │ - Use UniformSlot for nested component slots            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

1. **pnpm** - Use `pnpm` instead of `npm` for dependency install
2. **NPM Token** - Access to private `@uniformdev/*` packages (provided by Uniform)
3. **Node.js 22+**
4. **Uniform Project** - Admin access to create API keys

---

## Getting Started

1. Set the NPM token for private package access:
   ```sh
   export NPM_TOKEN=<your-npm-token>
   ```

2. Install dependencies:
   ```sh
   pnpm install
   ```

3. Configure environment variables in `.env` (see `.env.example`):
   ```sh
   UNIFORM_API_KEY=          # From Uniform dashboard: Team → Security → API Key
   UNIFORM_PROJECT_ID=       # Your Uniform project ID
   UNIFORM_PREVIEW_SECRET=hello-world   # Secret for preview mode validation
   ```

4. Start the development server:
   ```sh
   pnpm dev
   ```

This automatically pulls the context manifest before starting the dev server.

---

## Project Structure

```
├── middleware.ts              # Vercel Edge middleware for personalization
├── uniform.config.ts          # CLI configuration for content sync
├── src/
│   ├── hooks.server.ts        # SvelteKit server hooks (preview detection)
│   ├── routes/
│   │   ├── +layout.svelte     # Root layout with UniformContext provider
│   │   ├── [...path]/         # Catch-all route for Uniform compositions
│   │   │   ├── +page.server.ts    # Fetches composition from Canvas API
│   │   │   ├── +page.svelte       # Renders UniformComposition
│   │   │   └── +error.svelte      # Error boundary
│   │   ├── playground/        # Component preview page for Canvas editor
│   │   │   └── +page.svelte
│   │   └── preview/           # Preview API endpoint
│   │       └── +server.ts
│   └── lib/
│       ├── components/        # Svelte components mapped to Uniform types
│       │   ├── Card.svelte
│       │   ├── Container.svelte
│       │   ├── Grid.svelte
│       │   ├── Hero.svelte
│       │   ├── Page.svelte
│       │   └── RichText.svelte
│       └── uniform/
│           ├── componentMap.ts        # Maps Uniform types → Svelte components
│           └── contextManifest.json   # Downloaded personalization manifest
└── uniform-data/              # Local content sync (compositions, signals, etc.)
```

---

## Uniform SDK Integration

This project uses several Uniform SDK packages:

| Package | Purpose |
|---------|---------|
| `@uniformdev/canvas` | Core Canvas API client for fetching compositions |
| `@uniformdev/canvas-svelte` | Svelte components: `UniformComposition`, `UniformSlot`, `UniformText`, `UniformRichText` |
| `@uniformdev/canvas-sveltekit` | SvelteKit integrations: `createUniformLoad`, `createUniformHandle`, preview handler, ISR config |
| `@uniformdev/context` | Personalization Context engine |
| `@uniformdev/context-svelte` | `UniformContext` provider component |
| `@uniformdev/context-edge` | Edge-side context processing |
| `@uniformdev/context-edge-sveltekit` | NESI response handler for edge personalization |
| `@uniformdev/cli` | CLI for pulling manifests and syncing content |

---

## Key Files Explained

### `middleware.ts` - Edge Personalization

**Mission:** Process every page request at the edge to apply personalization before the response reaches the user.

```typescript
// What it does:
// 1. Creates a Uniform Context with the personalization manifest
// 2. Updates context with visitor data (cookies, URL, signals)
// 3. Fetches the page from the origin
// 4. Uses NESI handler to replace personalized placeholders in the HTML
```

The middleware intercepts requests, evaluates personalization rules against visitor signals (stored in cookies), and swaps NESI placeholders in the HTML with personalized content variants. This happens at Vercel's edge network for minimal latency.

**Matcher config:** Excludes static files, SvelteKit internals (`_app`, `__data.json`), and Vite dev paths.

---

### `src/hooks.server.ts` - Preview Mode Detection

Handles SvelteKit server hooks, primarily for detecting Uniform preview/contextual editing mode:

```typescript
const uniformHandle = createUniformHandle({
  onPreview: (event, previewData) => {
    // Called when user is in Canvas contextual editing mode
  },
});
```

---

### `src/routes/+layout.svelte` - Context Provider

Wraps the entire app with `UniformContext` for client-side personalization:

- Initializes the Context with the manifest
- Uses `CookieTransitionDataStore` for persisting visitor scores
- Enables dev tools and debug logging in development
- Sets `outputType` to `"edge"` in production for NESI output

---

### `src/routes/[...path]/+page.server.ts` - Composition Fetcher

The server-side load function that:

1. Creates a `RouteClient` with API credentials
2. Uses `createUniformLoad` to fetch the composition matching the current URL
3. Resolves the composition through the project map
4. Returns composition data to the page

Also configures **ISR (Incremental Static Regeneration)** on Vercel with 60-second revalidation.

---

### `src/routes/[...path]/+page.svelte` - Composition Renderer

Renders the fetched composition using:

```svelte
<UniformComposition data={data.data} {componentMap} matchedRoute={data.matchedRoute}>
  <UniformSlot name="content" />
</UniformComposition>
```

The `componentMap` maps Uniform component types to Svelte components.

---

### `src/routes/preview/+server.ts` - Preview API

Handles preview requests from Uniform Canvas for contextual editing:

- Validates preview secret
- Resolves composition paths
- Routes to the playground for pattern/component previews

---

### `src/routes/playground/+page.svelte` - Component Preview

A blank canvas page for previewing individual components or patterns in the Canvas editor. Receives composition data via contextual editing messages.

---

### `src/lib/uniform/componentMap.ts` - Component Mapping

Maps Uniform Canvas component types to Svelte component implementations:

```typescript
export const componentMap: ComponentMap = {
  page: Page,
  container: Container,
  grid: Grid,
  hero: Hero,
  card: Card,
  card__featured: Card,  // Variant mapping
  richText: RichText,
};
```

Use the `type__variant` format for variant-specific mappings.

---

## Components with Uniform SDK

### Components using `UniformSlot`

Slot components render nested child components from the composition:

| Component | Slot Name | Purpose |
|-----------|-----------|---------|
| `Page.svelte` | `content` | Main page content area |
| `Container.svelte` | `content` | Wrapped content with max-width |
| `Grid.svelte` | `items` | Grid item children |

### Components using `UniformText` / `UniformRichText`

These enable inline editing in Canvas contextual editing mode:

| Component | Parameter IDs | Purpose |
|-----------|--------------|---------|
| `Hero.svelte` | `title`, `description` | Editable hero text |
| `Card.svelte` | `title`, `description` | Editable card content |

### Components using `ComponentProps`

All components extend `ComponentProps<T>` for type-safe parameter access:

```typescript
interface Props extends ComponentProps<{ title?: string; maxWidth?: string }> {}
let { title, maxWidth, component }: Props = $props();
```

The `component` prop provides access to variant info (`component.variant`).

---

## NPM Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Pull manifest + start dev server |
| `pnpm build` | Pull manifest + production build |
| `pnpm pull:manifest` | Download personalization manifest from Uniform |
| `pnpm pull:content` | Sync content from Uniform to `uniform-data/` |
| `pnpm push:content` | Push local content changes to Uniform |

---

## Building

Create a production build:

```sh
pnpm build
```

Preview the production build locally:

```sh
pnpm preview
```

> **Note:** For deployment, you may need to install a SvelteKit [adapter](https://svelte.dev/docs/kit/adapters) for your target environment. This project includes `@sveltejs/adapter-vercel` for Vercel deployments.


# Manual Svelte SDK Integration Guide

A step-by-step technical guide for integrating Uniform Canvas and Context SDKs into a SvelteKit application.

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- A Uniform account with a project created
- Environment variables:
  - `UNIFORM_API_KEY` - Your Uniform API key
  - `UNIFORM_PROJECT_ID` - Your Uniform project ID
  - `UNIFORM_PROJECT_MAP_ID` (optional) - Your project map ID
  - `UNIFORM_PREVIEW_SECRET` (optional) - Secret for secure preview mode
  - `NPM_TOKEN` (optional) - Required only for edge personalization (Step 12)

---

## Step 1: Install Dependencies

Install the required Uniform packages:

```bash
pnpm add @uniformdev/canvas @uniformdev/canvas-svelte @uniformdev/canvas-sveltekit @uniformdev/context @uniformdev/context-svelte
```

For edge personalization (optional but recommended for production):

```bash
pnpm add @uniformdev/context-edge @uniformdev/context-edge-sveltekit
```

Dev dependencies for CLI:

```bash
pnpm add -D @uniformdev/cli
```

---

## Step 2: Configure TypeScript Types

Update `src/app.d.ts` to include Uniform preview data types:

```typescript
import type { UniformPreviewData } from '@uniformdev/canvas-sveltekit';

declare global {
  namespace App {
    interface Locals {
      uniformPreview?: UniformPreviewData;
    }
  }
}

export {};
```

---

## Step 3: Create Component Map

Create `src/lib/uniform/componentMap.ts` to map Uniform component types to Svelte components:

```typescript
import type { ComponentMap } from '@uniformdev/canvas-svelte';

// Import your Svelte components
import Hero from '$lib/components/Hero.svelte';
import Page from '$lib/components/Page.svelte';

/**
 * Maps Uniform component types to Svelte components.
 * The key is the component type from Uniform Canvas.
 * Use `type__variant` format to map specific variants.
 */
export const componentMap: ComponentMap = {
  // Page types
  page: Page,

  // Content components
  hero: Hero,

  // Variant example: card__featured uses same component
  // card__featured: Card,
};
```

---

## Step 4: Create Server Hooks

Create `src/hooks.server.ts` to handle Uniform preview cookies:

```typescript
import { sequence } from '@sveltejs/kit/hooks';
import { createUniformHandle } from '@uniformdev/canvas-sveltekit';

/**
 * Uniform handle hook - parses preview cookies and attaches to locals
 */
const uniformHandle = createUniformHandle({
  onPreview: (event, previewData) => {
    // Optional: Log when preview mode is active
    if (previewData.isUniformContextualEditing) {
      console.log(
        '[Uniform] Contextual editing mode active for:',
        previewData.compositionPath
      );
    }
  },
});

export const handle = sequence(uniformHandle);
```

---

## Step 5: Set Up Context in Root Layout

Update `src/routes/+layout.svelte` to initialize Uniform Context:

```svelte
<script lang="ts">
  import { dev } from '$app/environment';
  import {
    Context,
    CookieTransitionDataStore,
    enableContextDevTools,
    enableDebugConsoleLogDrain
  } from '@uniformdev/context';
  import { UniformContext } from '@uniformdev/context-svelte';
  import type { ManifestV2 } from '@uniformdev/context';
  import manifestJson from '$lib/uniform/contextManifest.json';

  let { children } = $props();

  const context = new Context({
    defaultConsent: true,
    transitionStore: new CookieTransitionDataStore({
      serverCookieValue: undefined,
    }),
    plugins: [enableContextDevTools(), enableDebugConsoleLogDrain('debug')],
    manifest: manifestJson as ManifestV2,
  });
</script>

<UniformContext {context} outputType={dev ? 'standard' : 'edge'}>
  {@render children()}
</UniformContext>
```

**Note:** The `contextManifest.json` file is generated by the CLI (see Step 10).

---

## Step 6: Create the Catch-All Route

Create the route structure for serving Uniform compositions.

### 6a. Create `src/routes/[...path]/+page.server.ts`

```typescript
import { error } from '@sveltejs/kit';
import { RouteClient } from '@uniformdev/canvas';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

/**
 * Check if Uniform credentials are configured.
 */
function hasUniformCredentials(): boolean {
  return Boolean(env.UNIFORM_API_KEY && env.UNIFORM_PROJECT_ID);
}

export const load: PageServerLoad = async (event) => {
  if (!hasUniformCredentials()) {
    error(
      500,
      'Uniform credentials not configured. Set UNIFORM_API_KEY and UNIFORM_PROJECT_ID in your .env file.'
    );
  }

  // Lazy import to avoid initialization errors when credentials are missing
  const { createUniformLoad } = await import('@uniformdev/canvas-sveltekit/route');

  // Create RouteClient with SvelteKit env vars
  const client = new RouteClient({
    apiKey: env.UNIFORM_API_KEY,
    projectId: env.UNIFORM_PROJECT_ID,
  });

  const uniformLoad = createUniformLoad({
    client,
    param: 'path', // Matches [...path]
  });

  return uniformLoad(event);
};
```

### 6b. Create `src/routes/[...path]/+page.svelte`

```svelte
<script lang="ts">
  import { UniformComposition, UniformSlot } from '@uniformdev/canvas-svelte';
  import { componentMap } from '$lib/uniform/componentMap.js';

  let { data } = $props();
</script>

<UniformComposition
  data={data.data}
  {componentMap}
  matchedRoute={data.matchedRoute}
  dynamicInputs={data.dynamicInputs}
>
  <UniformSlot name="content" />
</UniformComposition>
```

### 6c. Create `src/routes/[...path]/+error.svelte`

```svelte
<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="error-page">
  <h1>{$page.status}</h1>
  <p>{$page.error?.message || 'Page not found'}</p>
  <a href="/">← Back to home</a>
</div>

<style>
  .error-page {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
  }
</style>
```

---

## Step 7: Create Preview Handler

Create `src/routes/preview/+server.ts` for Canvas contextual editing:

```typescript
import { createPreviewHandler } from '@uniformdev/canvas-sveltekit/preview';
import { env } from '$env/dynamic/private';

/**
 * Preview handler for Uniform Canvas contextual editing.
 * Configure in Uniform Canvas: Preview URL: https://your-site.com/preview
 */
const handlers = createPreviewHandler({
  secret: () => env.UNIFORM_PREVIEW_SECRET ?? '',
  playgroundPath: '/playground',
  resolveFullPath: ({ path, slug }) => {
    return path || slug || '/';
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
```

---

## Step 8: Create Playground Page

Create `src/routes/playground/+page.svelte` for component/pattern previews:

```svelte
<script lang="ts">
  import { UniformComposition, UniformSlot } from '@uniformdev/canvas-svelte';
  import { componentMap } from '$lib/uniform/componentMap.js';
  import { EMPTY_COMPOSITION } from '@uniformdev/canvas';
</script>

<div class="playground">
  <UniformComposition data={EMPTY_COMPOSITION} {componentMap}>
    <UniformSlot name="content" />
  </UniformComposition>
</div>

<style>
  .playground {
    min-height: 100vh;
    padding: 2rem;
  }
</style>
```

---

## Step 9: Create Svelte Components

Create components that map to your Uniform component types.

### Example: `src/lib/components/Hero.svelte`

```svelte
<script lang="ts">
  import { UniformText, UniformRichText } from '@uniformdev/canvas-svelte';
</script>

<section class="hero">
  <UniformText parameterId="title" as="h1" placeholder="Enter hero title" />
  <div class="subtitle">
    <UniformRichText parameterId="description" as="div" placeholder="Enter description" />
  </div>
</section>

<style>
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 2rem;
    border-radius: 12px;
    text-align: center;
  }
</style>
```

### Example: `src/lib/components/Page.svelte`

```svelte
<script lang="ts">
  import { UniformSlot } from '@uniformdev/canvas-svelte';
  import type { ComponentProps } from '@uniformdev/canvas-svelte';

  interface Props extends ComponentProps<{ title?: string; description?: string }> {}

  let { title, description, component }: Props = $props();
</script>

<svelte:head>
  {#if title}
    <title>{title}</title>
  {/if}
  {#if description}
    <meta name="description" content={description} />
  {/if}
</svelte:head>

<main class="page">
  <UniformSlot name="content" />
</main>

<style>
  .page {
    min-height: 100vh;
    padding: 2rem;
  }
</style>
```

### Key Component Patterns:

1. **`UniformText`** - For editable text parameters
2. **`UniformRichText`** - For rich text/HTML parameters
3. **`UniformSlot`** - For nested component slots
4. **`ComponentProps<T>`** - TypeScript interface for component props

---

## Step 10: Configure CLI and Scripts

### 10a. Create `uniform.config.ts`

```typescript
import { uniformConfig } from '@uniformdev/cli/config';

module.exports = uniformConfig({ preset: 'all', disableEntities: ['webhook'] });
```

### 10b. Add npm scripts to `package.json`

```json
{
  "scripts": {
    "dev": "pnpm pull:manifest && vite dev",
    "build": "pnpm pull:manifest && vite build",
    "pull:manifest": "uniform context manifest download --output ./src/lib/uniform/contextManifest.json"
  }
}
```

### 10c. Create placeholder manifest

Create `src/lib/uniform/contextManifest.json`:

```json
{
  "project": {}
}
```

Add to `src/lib/uniform/.gitignore`:

```
contextManifest.json
```

---

## Step 11: Set Up Environment Variables

Create `.env` file:

```bash
UNIFORM_API_KEY=your-api-key-here
UNIFORM_PROJECT_ID=your-project-id-here
UNIFORM_PREVIEW_SECRET=your-preview-secret-here
```

---

## Step 12: Edge Personalization (Optional)

For production edge personalization with NESI (Nested Edge-Side Includes), you need two things:

### 12a. Configure Edge Output Mode in Layout

The `UniformContext` in your root layout (Step 5) must use `outputType="edge"` in production. This is already configured if you followed Step 5:

```svelte
<UniformContext {context} outputType={dev ? 'standard' : 'edge'}>
  {@render children()}
</UniformContext>
```

- **`standard`**: Used in development - personalization happens client-side
- **`edge`**: Used in production - outputs NESI placeholders that the edge middleware replaces

### 12b. Create Edge Middleware

Create `middleware.ts` in the project root:

```typescript
import {
  Context,
  CookieTransitionDataStore,
  UNIFORM_DEFAULT_COOKIE_NAME,
} from '@uniformdev/context';
import { createUniformNesiResponseHandler } from '@uniformdev/context-edge-sveltekit';
import { next } from '@vercel/functions';
import { parse } from 'cookie';
import type { ManifestV2 } from '@uniformdev/context';
import manifestJson from './src/lib/uniform/contextManifest.json';

const manifest = manifestJson as ManifestV2;

export default async function middleware(request: Request) {
  if (request.headers.get('x-from-middleware') === 'true') {
    return next(request);
  }

  const url = new URL(request.url);
  const cookieValue = request.headers.get('cookie');
  const cookies = parse(cookieValue ?? '');

  const context = new Context({
    manifest: manifest as ManifestV2,
    defaultConsent: true,
    transitionStore: new CookieTransitionDataStore({
      serverCookieValue: cookies[UNIFORM_DEFAULT_COOKIE_NAME] ?? undefined,
    }),
  });

  await context.update({
    cookies,
    url,
  });

  const response = await fetch(url, {
    headers: {
      'x-from-middleware': 'true',
    },
  });

  const handler = createUniformNesiResponseHandler();
  const processedResponse = await handler({
    response,
    context,
  });

  return processedResponse;
}

export const config = {
  matcher: [
    '/((?!_app|__data\\.json|@vite|@id|@fs|_next|.*\\..*|favicon\\.ico).*)',
  ],
};
```

### 12c. Install Required Packages

**Important:** The `@uniformdev/context-edge-sveltekit` package is private and requires an NPM token.

Create or update `.npmrc` in your project root:

```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

Set the `NPM_TOKEN` environment variable before installing:

```bash
export NPM_TOKEN=your-npm-token-here
```

Install the edge packages and dependencies:

```bash
pnpm add @uniformdev/context-edge @uniformdev/context-edge-sveltekit @vercel/functions cookie
```

### How Edge Personalization Works

1. **Build time**: Components using personalization output NESI placeholders (e.g., `<nesi-include src="..." />`)
2. **Edge middleware**: Intercepts the response, evaluates visitor context, and replaces NESI placeholders with personalized content
3. **Result**: Fully personalized HTML delivered from the edge with no client-side JavaScript required

Without `outputType="edge"` in the layout, the NESI placeholders won't be generated and the middleware will have nothing to process.

---

## Step 13: Vercel ISR Configuration (Optional)

For Vercel deployments with ISR, add to your page server load:

```typescript
import { createVercelIsrConfig } from '@uniformdev/canvas-sveltekit';

export const config = createVercelIsrConfig({
  expiration: 60, // Revalidate every 60 seconds
});
```

And update `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
};

export default config;
```

---

## Final Project Structure

```
your-project/
├── src/
│   ├── app.d.ts                          # TypeScript declarations
│   ├── app.html                          # HTML template
│   ├── hooks.server.ts                   # Server hooks
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Hero.svelte
│   │   │   ├── Page.svelte
│   │   │   └── index.ts
│   │   └── uniform/
│   │       ├── componentMap.ts
│   │       ├── contextManifest.json      # Generated by CLI
│   │       └── .gitignore
│   └── routes/
│       ├── +layout.svelte                # Root layout with UniformContext
│       ├── [...path]/
│       │   ├── +page.server.ts           # Fetches compositions
│       │   ├── +page.svelte              # Renders compositions
│       │   └── +error.svelte
│       ├── playground/
│       │   └── +page.svelte
│       └── preview/
│           └── +server.ts
├── middleware.ts                          # Edge middleware (optional)
├── uniform.config.ts                      # CLI configuration
├── package.json
├── svelte.config.js
├── vite.config.ts
└── .env
```

---

## Troubleshooting

### Common Issues

1. **"Cannot find module contextManifest.json"**
   - Run `pnpm pull:manifest` to download the manifest
   - Ensure you have valid `UNIFORM_API_KEY` and `UNIFORM_PROJECT_ID`

2. **Preview not working**
   - Verify preview URL is configured in Uniform Canvas settings
   - Check `UNIFORM_PREVIEW_SECRET` matches in both places
   - If none of this helps, check this [troubleshooting guide](https://docs.uniform.app/docs/guides/composition/visual-editing/troubleshoot-preview).

3. **Components not rendering**
   - Verify component type names in `componentMap` match Uniform Canvas
   - Check browser console for mapping errors

4. **TypeScript errors with slots**
   - Ensure `UniformSlot` name matches the slot name in Uniform Canvas

---

## Next Steps

1. Create component types in Uniform Canvas
2. Create a project map with nodes
3. Create compositions and assign to project map nodes
4. Run `pnpm dev` to test locally
5. Configure preview URL in Uniform Canvas settings
