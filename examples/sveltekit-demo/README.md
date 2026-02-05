# Svelte Demo for Uniform


> ⚠️ This is a content- and feature-rich demo, if you are looking for a barebones starter, head over to [this example](../sveltekit-starter/) instead.

A SvelteKit application integrated with Uniform's visual composition and personalization platform. This starter demonstrates how to build component-driven pages with visual editing capabilities and edge-side personalization.

## Table of Contents

- [Overview](#overview)
- [Progressive Activation Pattern](#progressive-activation-pattern)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Uniform SDK Integration](#uniform-sdk-integration)
- [Key Files Explained](#key-files-explained)
- [Components with Uniform SDK](#components-with-uniform-sdk)
- [Behavioral Tracking & Personalization Signals](#behavioral-tracking--personalization-signals)
  - [Enrichments (Interest-Based Scoring)](#enrichments-interest-based-scoring)
  - [Quirks (Session/Visitor Attributes)](#quirks-sessionvisitor-attributes)
  - [Events (Conversion Tracking)](#events-conversion-tracking)
- [NPM Scripts](#npm-scripts)
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

## Progressive Activation Pattern

This demo showcases **progressive activation** - a gradual adoption strategy where Uniform capabilities are incrementally enabled without requiring a full rewrite or migration.

### What This Demo Shows

```
┌─────────────────────────────────────────────────────────────────┐
│                     Uniform Context (App-Wide)                  │
│         Personalization & A/B Testing Engine Active             │
│                                                                 │
│  ┌─────────────────────┐    ┌──────────────────────────────┐   │
│  │     Home Page       │    │     Product Pages            │   │
│  │  ┌───────────────┐  │    │                              │   │
│  │  │ Uniform       │  │    │   Standard SvelteKit         │   │
│  │  │ Composition   │  │    │   Routes & Components        │   │
│  │  │ (Hero, etc.)  │  │    │                              │   │
│  │  └───────────────┘  │    │   ✓ Enrichment tracking      │   │
│  │                     │    │   ✓ Event tracking           │   │
│  │  Existing Svelte    │    │   ✓ Quirks available         │   │
│  │  Components Below   │    │   ✗ No composition control   │   │
│  └─────────────────────┘    └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Two Levels of Integration

| Level | Scope | What It Enables |
|-------|-------|-----------------|
| **Context Only** | Entire app | Personalization signals, A/B testing, analytics, enrichments, quirks, events |
| **Context + Canvas** | Specific pages/sections | Visual composition, drag-and-drop editing, component-level personalization |

### How It Works in This Demo

1. **Uniform Context** wraps the entire app in `+layout.svelte`:
   ```svelte
   <UniformContext {context} outputType={dev ? "standard" : "edge"}>
     <!-- All pages have access to personalization -->
   </UniformContext>
   ```

2. **Composition Management** is only on the home page (`src/routes/+page.svelte`):
   ```svelte
   <UniformComposition data={data.data} {componentMap}>
     <UniformSlot name="content" />
   </UniformComposition>
   ```

3. **Product pages** (`/products/[category]/[product]`) are standard SvelteKit routes:
   - No `UniformComposition` - developers own the page structure
   - Still use `getUniformContext()` for tracking and personalization
   - Can progressively migrate to composition control later

### Why This Matters

**For Developers:**
- No "big bang" migration required
- Keep existing routing and page structure
- Add Uniform composition to pages one at a time
- Maintain full control over non-Uniform pages

**For Content Teams:**
- Start with high-impact pages (home, landing pages)
- Visual editing where it matters most
- Gradual expansion as team learns the platform

**For Organizations:**
- Lower risk adoption path
- Prove value before full commitment
- Mix Uniform-managed and developer-managed content

### Expanding Composition Control

To add Uniform composition to additional pages:

1. Create a composition in Uniform Canvas
2. Map it to a route in the Project Map
3. Create a `+page.server.ts` that fetches the composition:
   ```typescript
   export const load = async (event) => {
     const uniformLoad = createUniformLoad({ client, projectMapId });
     return uniformLoad(event);
   };
   ```
4. Render with `UniformComposition` in `+page.svelte`

Or keep pages as standard SvelteKit routes and just use Context for personalization signals.

---

## Prerequisites

1. **pnpm** - Use `pnpm` instead of `npm` for dependency install
2. **NPM Token** - Access to private `@uniformdev/*` packages (provided by Uniform)
3. **Node.js 22+**
4. **Uniform Project** - Admin access to create API keys

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel Edge                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  middleware.ts                                           │   │
│  │  - Initializes Uniform Context with manifest             │   │
│  │  - Sets geo quirks from Vercel headers                   │   │
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
│  │   detection      │    │ - Tealium quirks integration    │   │
│  └──────────────────┘    └─────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Home Page (/ route) - Uniform Composition                │   │
│  │ +page.server.ts - Fetches composition from Canvas API   │   │
│  │ +page.svelte    - UniformComposition + UniformSlot      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Product Pages (/products/*) - Standard SvelteKit        │   │
│  │ - Developer-owned routing and components                 │   │
│  │ - Uses getUniformContext() for enrichments & events     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Uniform Components (Hero, Page)                          │   │
│  │ - Adapter components bridge Uniform → Svelte             │   │
│  │ - Use UniformSlot for nested component slots            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```
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
│   │   ├── +page.server.ts    # Home page - fetches composition from Canvas API
│   │   ├── +page.svelte       # Home page - renders UniformComposition
│   │   ├── products/          # Standard SvelteKit product routes (not Uniform-managed)
│   │   │   ├── [category]/
│   │   │   │   ├── +page.svelte       # Category listing page
│   │   │   │   └── [product]/
│   │   │   │       └── +page.svelte   # Product detail page (PDP)
│   │   ├── playground/        # Component preview page for Canvas editor
│   │   │   └── +page.svelte
│   │   └── preview/           # Preview API endpoint
│   │       └── +server.ts
│   └── lib/
│       ├── components/
│       │   ├── header.svelte          # Site header
│       │   ├── footer.svelte          # Site footer
│       │   ├── hero/                  # Hero component variants
│       │   │   ├── hero-aurora.svelte     # Animated aurora background
│       │   │   ├── hero-image.svelte      # Image background
│       │   │   └── hero-video.svelte      # Video background
│       │   ├── sections/              # Home page section components
│       │   └── uniform/               # Uniform adapter components
│       │       ├── hero.svelte            # Hero adapter for Uniform
│       │       └── page.svelte            # Page composition wrapper
│       ├── uniform/
│       │   ├── componentMap.ts        # Maps Uniform types → Svelte components
│       │   └── contextManifest.json   # Downloaded personalization manifest
│       ├── data/                      # Static data (products, content)
│       └── tealium-mock.ts            # Mock Tealium utag data for quirks demo
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

### `src/routes/+page.server.ts` - Home Page Composition Fetcher

The server-side load function for the home page that:

1. Creates a `RouteClient` with API credentials
2. Uses `createUniformLoad` to fetch the home composition
3. Forces path resolution to `/` for the root route
4. Returns composition data to the page

```typescript
const uniformLoad = createUniformLoad({
  client,
  projectMapId: env.UNIFORM_PROJECT_MAP_ID,
  resolvePath: () => '/', // Force home path for root route
});
```

---

### `src/routes/+page.svelte` - Home Page Composition Renderer

Renders the fetched composition using:

```svelte
<UniformComposition data={data.data} {componentMap} matchedRoute={data.matchedRoute}>
  <UniformSlot name="content" />
</UniformComposition>
```

The `componentMap` maps Uniform component types to Svelte components.

---

### `src/routes/products/[category]/[product]/+page.svelte` - Product Detail Page

Standard SvelteKit route (not Uniform-managed) that demonstrates:

- Using `getUniformContext()` to access the Context for tracking
- Setting enrichments on page view
- Firing events on user actions (add to cart)

This shows how non-composition pages can still leverage Uniform's personalization engine.

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
  // Composition types
  page: Page,

  // Hero component - adapter handles all variants
  hero: Hero,
};
```

Use the `type__variant` format for variant-specific mappings (e.g., `hero__video: HeroVideo`).

---

## Components with Uniform SDK

### Uniform Adapter Components

This demo uses an **adapter pattern** where Uniform components wrap existing Svelte components, translating Uniform parameter types to component props:

| Uniform Component | Adapter | Wrapped Components |
|-------------------|---------|-------------------|
| `page` | `uniform/page.svelte` | Renders `content` slot |
| `hero` | `uniform/hero.svelte` | `hero-aurora.svelte`, `hero-video.svelte`, `hero-image.svelte` |

### Hero Adapter Example

The Hero adapter (`src/lib/components/uniform/hero.svelte`) demonstrates:

1. **Type conversion:** Transforms Uniform's `AssetParamValue` and `LinkParamValue` to simple strings
2. **Variant detection:** Uses media type or component variant to select the right hero style
3. **Checkbox handling:** Converts Uniform's string `"true"`/`"false"` checkbox values to booleans

```typescript
interface Props extends ComponentProps<{
  media?: AssetParamValue;
  headline?: string;
  ctaLink?: LinkParamValue;
  animationsEnabled?: boolean | string;
}> {}
```

### Components using `UniformSlot`

| Component | Slot Name | Purpose |
|-----------|-----------|---------|
| `uniform/page.svelte` | `content` | Main page content area |

### Components using `ComponentProps`

All Uniform components extend `ComponentProps<T>` for type-safe parameter access:

```typescript
interface Props extends ComponentProps<{ headline?: string }> {}
let { headline, component }: Props = $props();
```

The `component` prop provides access to variant info (`component.variant`).

---

## Behavioral Tracking & Personalization Signals

This section documents how to programmatically send enrichments, quirks, and events to Uniform Context for powering personalization and analytics.

### Enrichments (Interest-Based Scoring)

Enrichments are cumulative scores that build visitor profiles over time. They're ideal for tracking interests, preferences, and behavioral patterns.

**Use Case:** Track visitor interest in product categories on Product Detail Pages (PDPs).

**Implementation:** `src/routes/products/[category]/[product]/+page.svelte`

```svelte
<script lang="ts">
  import { getUniformContext } from '@uniformdev/context-svelte';
  
  const { context } = getUniformContext({ throwOnMissingProvider: false }) ?? {};
  
  // Track enrichments when PDP page is visited
  $effect(() => {
    if (!context || !product || !categorySlug) return;

    context.update({
      enrichments: [
        { cat: 'category', key: categorySlug, str: 10 },  // Score 10 for category interest
        { cat: 'interest', key: 'products', str: 5 },     // Score 5 for general product interest
      ],
    });
  });
</script>
```

**Enrichment Format:**
- `cat` - The enrichment category ID (e.g., `'category'`, `'interest'`)
- `key` - The specific value ID within that category (e.g., `'neural'`, `'products'`)
- `str` - The strength/score to add (cumulative, capped by enrichment settings)

**When to Use Enrichments:**
- Page views that indicate interest (PDPs, category pages, content articles)
- Scroll depth or time-on-page milestones
- Video watch progress
- Any behavior that suggests growing interest in a topic

---

### Quirks (Session/Visitor Attributes)

Quirks are key-value attributes that describe the current visitor or session. Unlike enrichments (which accumulate), quirks are set values that can be overwritten.

#### Client-Side Quirks (CDP/Tag Manager Integration)

**Use Case:** Integrate with tag management systems (Tealium, GTM) or CDPs to sync visitor attributes.

**Implementation:** `src/routes/+layout.svelte`

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { tealiumData } from "$lib/tealium-mock";

  // Project Tealium utag data to Uniform quirks
  function projectTealiumToQuirks() {
    const quirks: Record<string, string> = {};
    
    if (tealiumData.customer_type) {
      quirks['customertype'] = tealiumData.customer_type;
    }
    if (tealiumData.is_mobile_tablet_desktop) {
      quirks['ismobiletabletdesktop'] = tealiumData.is_mobile_tablet_desktop;
    }
    if (tealiumData.osType) {
      quirks['ostype'] = tealiumData.osType;
    }
    
    return quirks;
  }

  // Set quirks from Tealium data when app loads
  onMount(async () => {
    const quirks = projectTealiumToQuirks();
    
    if (Object.keys(quirks).length > 0) {
      await context.update({ quirks });
    }
  });
</script>
```

**When to Use Client-Side Quirks:**
- Data from client-side tag managers (Tealium, GTM, Segment)
- Browser-detected attributes (device type, screen size)
- Data loaded asynchronously after page render
- CDP-provided audience segments or user properties

**Trade-offs:**
- **Pro:** Access to rich client-side data (JS APIs, cookies, localStorage)
- **Pro:** Can integrate with any tag manager or CDP
- **Con:** Personalization happens after hydration (may cause flash of default content)
- **Con:** Not available during SSR/edge rendering

---

#### Edge-Side Quirks (Request-Based Data)

**Use Case:** Use data available in the HTTP request (headers, geo location) for instant personalization at the edge.

**Implementation:** `middleware.ts`

```typescript
export default async function middleware(request: Request) {
  // Extract geo data from Vercel headers
  const geoCity = request.headers.get('x-vercel-ip-city') ?? '';
  const geoCountry = request.headers.get('x-vercel-ip-country') ?? '';
  const geoRegion = request.headers.get('x-vercel-ip-country-region') ?? '';
  const geoLatitude = request.headers.get('x-vercel-ip-latitude') ?? '';
  const geoLongitude = request.headers.get('x-vercel-ip-longitude') ?? '';

  await context.update({
    cookies,
    url,
    quirks: {
      geoCity: decodeURIComponent(geoCity),
      geoCountry,
      geoRegion,
      geoLatitude,
      geoLongitude,
    }
  });
  // ... rest of middleware
}
```

**Vercel Geo Headers:**
| Header | Description |
|--------|-------------|
| `x-vercel-ip-city` | Visitor's city (URL-encoded) |
| `x-vercel-ip-country` | 2-letter country code |
| `x-vercel-ip-country-region` | Region/state code |
| `x-vercel-ip-latitude` | Latitude coordinate |
| `x-vercel-ip-longitude` | Longitude coordinate |

**When to Use Edge-Side Quirks:**
- Geolocation-based personalization (country, region, city)
- Device/browser data from User-Agent header
- Request-time data that doesn't require client-side JS
- Any "blocking" data that must be available before rendering

**Trade-offs:**
- **Pro:** No flash of content - personalization applied before HTML reaches browser
- **Pro:** Works with SSR and edge caching
- **Pro:** Available on first request (no round-trip)
- **Con:** Optimized for fast APIs you can render-block and to data in HTTP request (headers, cookies, URL)

---

### Events (Conversion Tracking)

Events track discrete actions like conversions, clicks, or form submissions. They're essential for measuring personalization effectiveness and A/B test results.

**Use Case:** Track "add to cart" conversions to attribute sales to personalized experiences.

**Implementation:** `src/routes/products/[category]/[product]/+page.svelte`

```svelte
<script lang="ts">
  import { getUniformContext } from '@uniformdev/context-svelte';
  
  const { context } = getUniformContext({ throwOnMissingProvider: false }) ?? {};
  
  async function handleAddToCart() {
    if (context && product) {
      await context.update({
        events: [{ event: 'add-to-cart' }],
      });
    }
    // ... cart logic
  }
</script>

<Button onclick={handleAddToCart}>
  Add to Cart
</Button>
```

**Event Format:**
- `event` - The event name/ID (e.g., `'add-to-cart'`, `'purchase'`, `'signup'`)

**Why Events Matter for Personalization:**
1. **Conversion Attribution:** Links conversions back to which personalized variant the visitor saw
2. **A/B Test Results:** Measures which test variant performed better
3. **Signal Optimization:** Helps refine personalization rules based on what actually converts
4. **Analytics:** Feeds into Uniform Insights for reporting

**When to Fire Events:**
- Add to cart / purchase completion
- Form submissions (lead gen, newsletter signup)
- Key engagement actions (video play, download, share)
- Any action you want to correlate with personalization

---

### Summary: When to Use What

| Signal Type | Data Location | Timing | Best For |
|-------------|---------------|--------|----------|
| **Enrichments** | Client-side | Page view / interaction | Building interest profiles, content affinity |
| **Client Quirks** | Client-side (CDP/TMS) | After hydration | CDP segments, tag manager data, async attributes |
| **Edge Quirks** | Request headers | Before render | Geo personalization, instant targeting |
| **Events** | Client-side | User action | Conversion tracking, A/B test attribution |

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