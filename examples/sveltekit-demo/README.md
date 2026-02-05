# Svelte Demo for Uniform


> ⚠️ This is a content rich and feature rich demo, if you are looking for a barebones starter, head over to [this example](../sveltekit-starter/) instead.

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