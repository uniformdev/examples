# Uniform Search Starter

A Next.js (Pages Router) starter that demonstrates how to integrate **Uniform Search** into an existing application. It includes a full-featured search UI with text search, faceted filters, sorting, pagination, and page-size controls — all driven by Uniform component definitions so authors can compose search pages visually in the Uniform dashboard.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [How It Works](#how-it-works)
  - [Architecture Overview](#architecture-overview)
  - [Search Client](#search-client)
  - [SearchProvider and React Context](#searchprovider-and-react-context)
  - [URL State Sync](#url-state-sync)
- [Search Components](#search-components)
  - [SearchEngine](#searchengine)
  - [SearchBox](#searchbox)
  - [SearchList](#searchlist)
  - [SearchFilters](#searchfilters)
  - [SearchSorting](#searchsorting)
  - [SearchPagination](#searchpagination)
  - [SearchPageSize](#searchpagesize)
  - [SearchTotalAmount](#searchtotalamount)
- [Shared UI Components](#shared-ui-components)
- [Adding Uniform Search to an Existing Next.js App](#adding-uniform-search-to-an-existing-nextjs-app)
- [npm Scripts](#npm-scripts)

---

## Prerequisites

- **Node.js** 18+
- A **Uniform** project with:
  - An API key with at least "Read Published Compositions" permission
  - Uniform Search enabled and configured (you will need the Search API URL and Search API key)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

1. **Configure environment variables.** Copy the example file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   See [Environment Variables](#environment-variables) for what each value does.

1. **Push Uniform content** (if setting up your own Uniform project):

   ```bash
   npm run uniform:push
   ```

1. **Start the dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file with these values:

| Variable | Required | Description |
|---|---|---|
| `UNIFORM_API_KEY` | Yes | Your Uniform project API key (starts with `uf...`). Needs "Read Published Compositions" permission at minimum; "Developer" role for CLI push/pull. |
| `UNIFORM_PROJECT_ID` | Yes | Your Uniform project ID (a UUID). |
| `UNIFORM_PREVIEW_SECRET` | Yes | An arbitrary string used to secure the preview API route. Set this to any value you choose. |
| `NEXT_PUBLIC_UNIFORM_SEARCH_API_URL` | Yes | The base URL of the Uniform Search API (e.g. `https://search.uniform.app`). |
| `NEXT_PUBLIC_UNIFORM_SEARCH_API_KEY` | Yes | API key for authenticating against the Uniform Search API. |
| `NEXT_PUBLIC_UNIFORM_PROJECT_ID` | Yes | Same project ID, exposed to the browser so the search client can send it with requests. |

> Variables prefixed with `NEXT_PUBLIC_` are exposed to client-side code. This is expected — the search API key is a read-only key scoped to search queries.

## How It Works

### Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│  Uniform Dashboard                                       │
│  (Authors compose search pages using drag & drop)        │
└──────────────┬───────────────────────────────────────────┘
               │  composition JSON
               ▼
┌──────────────────────────────────────────────────────────┐
│  Next.js Pages Router                                    │
│  [[...slug]].tsx fetches composition via Route API        │
│                                                          │
│  ┌─ SearchEngine (SearchProvider) ─────────────────────┐ │
│  │                                                     │ │
│  │  ┌─ search-top slot ─────────────────────────────┐  │ │
│  │  │  SearchBox · SearchSorting · SearchPageSize    │  │ │
│  │  │  SearchTotalAmount                             │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                     │ │
│  │  ┌─ search-main slot ────────────────────────────┐  │ │
│  │  │  SearchFilters │ SearchList                    │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                     │ │
│  │  ┌─ search-bottom slot ──────────────────────────┐  │ │
│  │  │  SearchPagination                              │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────┬───────────────────────────────────────────┘
               │  search API calls (client-side)
               ▼
┌──────────────────────────────────────────────────────────┐
│  Uniform Search API                                      │
│  (indexed entries, compositions, assets)                  │
└──────────────────────────────────────────────────────────┘
```

1. An author creates a **composition** in the Uniform dashboard and places a `SearchEngine` component into the page's content slot.
2. Inside the SearchEngine's named slots (`search-top`, `search-main`, `search-bottom`), the author drops in whichever search UI components they need.
3. At runtime, `[[...slug]].tsx` fetches the composition data and the `UniformComposition` component resolves each component type to its registered React component.
4. The `SearchEngine` component wraps everything in a `SearchProvider` that manages state and API calls.

### Search Client

The search client lives in `lib/search/searchClient.ts`. It calls `createSearchClient` from the `@uniformdev/search` package, which returns a `performSearch` function:

```typescript
import { createSearchClient } from '@uniformdev/search';

export const { performSearch } = createSearchClient({
  apiUrl: process.env.NEXT_PUBLIC_UNIFORM_SEARCH_API_URL || '',
  apiKey: process.env.NEXT_PUBLIC_UNIFORM_SEARCH_API_KEY,
  projectId: process.env.NEXT_PUBLIC_UNIFORM_PROJECT_ID,
});
```

Under the hood, `performSearch` sends a `POST` request to `{apiUrl}/api/search` with parameters like `page`, `perPage`, `filters`, `facetBy`, `search`, `orderBy`, and `collections`.

### SearchProvider and React Context

The `SearchProvider` (from `@uniformdev/search/react`) wraps all search components and exposes state and actions via the `useSearch()` hook. Any component inside a `SearchProvider` can call:

| Hook Return | Type | What it does |
|---|---|---|
| `results` | `Pagination<SearchHit>` | Current page of search results with `items`, `total`, `page`, `perPage`, `totalPages`. |
| `isLoading` | `boolean` | Whether a search request is in flight. |
| `searchBoxValue` | `string` | The current text in the search input. |
| `setSearchQuery(value)` | function | Updates the search query (debounced). |
| `page` / `setPage(n)` | number / function | Current page index (0-based) and setter. |
| `pageSize` / `setPageSize(n)` | number / function | Results per page and setter. |
| `pageSizes` | `PageSize[]` | Available page size options. |
| `orderByOptions` | `{title, value}[]` | Available sort options. |
| `selectedOrderBy` / `setOrderBy(v)` | string / function | Current sort selection and setter. |
| `filterOptions` | `FilterBy[]` | Available filter definitions (from Uniform component params). |
| `selectedFilters` / `setSelectedFilters(f)` | object / function | Currently active filters and setter. |
| `clearFilters()` | function | Resets all filters, search query, and pagination. |
| `facets` | `Facets` | Facet counts for each filter value. |
| `formatResultsSummary(template)` | function | Interpolates `{totalItems}`, `{page}`, `{perPage}`, `{totalPages}` into a template string. |

### URL State Sync

Search state (query, page, page size, sort order, filters) is synced to URL query parameters. This means:

- Users can bookmark or share search result URLs
- Browser back/forward navigation works as expected
- The URL is the source of truth for search state

Query parameter keys:

| Parameter | Purpose |
|---|---|
| `search` | The search query string |
| `page` | Current page number (1-based in the URL, 0-based internally) |
| `pageSize` | Number of results per page |
| `orderBy` | Sort field and direction, e.g. `created_at_DESC` |
| `{fieldId}` | Filter values, using the field ID defined in the Uniform component |

---

## Search Components

The files relevant to Uniform Search live in two places:

```
components/search/
├── SearchEngine.tsx            # Root component — wraps everything in SearchProvider
├── SearchBox.tsx               # Text input for search queries
├── SearchList.tsx              # Renders search result cards in a grid
├── SearchFilters/
│   ├── SearchFilters.tsx       # Iterates filter definitions, renders filter UI
│   ├── FilterBySelect.tsx      # Checkbox-based select / multi-select filter
│   ├── FilterByRange.tsx       # Min/max number inputs for range filters
│   └── index.ts                # Re-export
├── SearchSorting.tsx           # Sort-order dropdown
├── SearchPagination.tsx        # Page navigation (prev/next + page numbers)
├── SearchPageSize.tsx          # Results-per-page dropdown
├── SearchTotalAmount.tsx       # "Showing X of Y results" text
└── ui/
    ├── Loading.tsx              # Loading overlay
    ├── Checkbox.tsx             # Generic checkbox input
    └── Select.tsx               # Generic select input

lib/search/
└── searchClient.ts             # Creates the search client using env vars
```

Every search component is a **Uniform Canvas component** — it is registered with `registerUniformComponent` so the Uniform visual editor knows how to render it. Authors drag-and-drop these components into slots on a composition.

All search components **must** be descendants of a `SearchEngine` component at runtime. They access shared search state through the `useSearch()` hook — if you try to render them outside a `SearchProvider`, you will get a runtime error.

### SearchEngine

**File:** `components/search/SearchEngine.tsx`
**Uniform type:** `searchEngine`

The root search component. It wraps all child search components in the `SearchProvider` context. Without this component, none of the other search components will work.

**Props (from Uniform component parameters):**

| Prop | Type | Description |
|---|---|---|
| `contentType` | `string` | Limits search results to a specific content type (e.g. `"product"`, `"article"`). |
| `filterBy` | block param | Defines available filters. Each block item has `type` (select/multiSelect/range), `title`, `fieldId`, `fieldKey`, `enableFaceting`, and `values`. |
| `orderBy` | block param | Defines available sort options. Each block item has `title`, `field`, and `direction` (ASC/DESC). |
| `baseFilters` | block param | Filters that are always applied (not visible to the user). Same shape as `filterBy`. |
| `pageSizes` | block param | Available page sizes. Each block item has `size` (number). |
| `collections` | `string` | Comma-separated list of collections to search: `entries`, `compositions`, `assets`. Defaults to all three. |

**Slots:**

| Slot Name | Purpose | Typical Components |
|---|---|---|
| `search-top` | Toolbar area above results | SearchBox, SearchSorting, SearchPageSize, SearchTotalAmount |
| `search-main` | Main content area (sidebar + results grid) | SearchFilters, SearchList |
| `search-bottom` | Area below results | SearchPagination |

**Layout:** The component applies a max-width container, a top toolbar with a bottom border, a two-column grid (`240px` sidebar + fluid main area), and a bottom bar with a top border.

---

### SearchBox

**File:** `components/search/SearchBox.tsx`
**Uniform type:** `searchBox`

A text input for entering search queries. Includes a search icon and a clear button.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `placeholder` | `string` | Placeholder text shown when the input is empty. |
| `label` | `string` | Accessible label for the input (rendered as `sr-only` for screen readers). Editable via `UniformText`. |

**Behavior:**
- Calls `setSearchQuery()` from the search context on every keystroke.
- The SearchProvider debounces the query (300ms default) before committing to the URL and triggering a search.
- The clear button (`x`) appears only after the component has mounted (avoids hydration mismatch) and when there is a value.

---

### SearchList

**File:** `components/search/SearchList.tsx`
**Uniform type:** `searchList`

Renders the search results as a responsive grid of cards. Handles empty states and loading overlays.

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `noResultsFoundText` | `string` | `"No results found"` | Heading shown when there are no results. |
| `tryDifferentFiltersText` | `string` | `"Try different filters or"` | Message shown alongside the clear-all link. |
| `clearAllFilterText` | `string` | `"clear all filters"` | Text for the clear-all button. |

**How it renders each result:**

| Field | Source (first truthy value wins) |
|---|---|
| Thumbnail | `hit.thumbnail` (if it's a string URL) |
| Title | `hit.title` > `hit.name` > `hit.slug` > `hit.id` |
| Description | `hit.shortDescription` > `hit.searchableText` > `hit.extractedText` (truncated to 120 chars) |
| Content type | `hit.contentType` > `hit.compositionType` > `hit.mediaType` |
| Slug | `hit.slug` > `hit.path` |

The grid uses CSS `auto-fill` with a minimum column width of `220px`.

---

### SearchFilters

**File:** `components/search/SearchFilters/SearchFilters.tsx`
**Uniform type:** `searchFilters`

Renders a sidebar of filter groups. Each filter is defined in the `filterBy` block parameter on the parent `SearchEngine` component.

**No direct props** — it reads `filterOptions`, `selectedFilters`, `setSelectedFilters`, and `facets` from the search context.

**Filter types:**

| Type | Component | Behavior |
|---|---|---|
| `select` | `FilterBySelect` | Single-select checkboxes. Selecting a new value replaces the previous selection. |
| `multiSelect` | `FilterBySelect` | Multi-select checkboxes. Multiple values can be active simultaneously. |
| `range` | `FilterByRange` | Two number inputs (min/max). Values are committed on blur. |

**FilterBySelect** (`SearchFilters/FilterBySelect.tsx`):
- Renders a checkbox for each possible value
- Shows facet counts in parentheses next to each value (e.g. `Light Roast (12)`)
- Disables values with zero facet count (unless already selected)
- Uses 600ms debounce before applying filter changes

**FilterByRange** (`SearchFilters/FilterByRange.tsx`):
- Renders two `<input type="number">` fields for min and max
- Commits values on blur (not on every keystroke)

---

### SearchSorting

**File:** `components/search/SearchSorting.tsx`
**Uniform type:** `searchSorting`

A dropdown (`<select>`) for choosing the sort order of results.

**No direct props** — reads `orderByOptions`, `selectedOrderBy`, and `setOrderBy` from the search context. Sort options are defined by the `orderBy` block parameter on SearchEngine.

Hides itself completely if no sort options are configured.

---

### SearchPagination

**File:** `components/search/SearchPagination.tsx`
**Uniform type:** `searchPagination`

Page navigation with previous/next buttons and numbered page buttons. Uses the `useSearchPagination` hook which implements a pagination range algorithm with ellipsis (`...`) for large page counts.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `siblingCount` | `number` | How many page numbers to show on each side of the current page. Default is handled by the `usePagination` hook. |

**Behavior:**
- Hides itself when there are fewer than 2 pages
- Previous/Next buttons are disabled at the boundaries
- All buttons are disabled during loading
- Uses `aria-label` and `aria-current="page"` for accessibility

---

### SearchPageSize

**File:** `components/search/SearchPageSize.tsx`
**Uniform type:** `searchPageSize`

A dropdown for choosing how many results to show per page.

**No direct props** — reads `pageSize`, `setPageSize`, `pageSizes`, and `isLoading` from the search context. Page size options are defined by the `pageSizes` block parameter on SearchEngine.

Disabled during loading to prevent race conditions.

---

### SearchTotalAmount

**File:** `components/search/SearchTotalAmount.tsx`
**Uniform type:** `searchTotalAmount`

Displays a summary of the current search results.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `textTemplate` | `string` | A template string with placeholders: `{totalItems}`, `{page}`, `{perPage}`, `{totalPages}`. Example: `"Showing {perPage} of {totalItems} results"`. |

Hides itself when there are zero results.

---

## Shared UI Components

These are small, reusable presentational components used by the search components. They are **not** registered as Uniform components — they are plain React components.

| Component | File | Description |
|---|---|---|
| `Loading` | `search/ui/Loading.tsx` | A semi-transparent overlay with a pulsing "Loading" label. Covers the parent container with `position: absolute`. |
| `Checkbox` | `search/ui/Checkbox.tsx` | A generic `<input type="checkbox">` with an associated `<label>`. Uses `useId()` for accessible label linking. |
| `Select` | `search/ui/Select.tsx` | A generic `<select>` wrapper that forwards all native select props and className. |

---

## Adding Uniform Search to an Existing Next.js App

If you already have a Next.js (Pages Router) app with Uniform set up, follow these steps to add search.

### Step 1: Install the search package

```bash
npm install @uniformdev/search
```

### Step 2: Add environment variables

Add these to your `.env.local`:

```
NEXT_PUBLIC_UNIFORM_SEARCH_API_URL=https://your-search-api-url
NEXT_PUBLIC_UNIFORM_SEARCH_API_KEY=your-search-api-key
NEXT_PUBLIC_UNIFORM_PROJECT_ID=your-uniform-project-id
```

### Step 3: Create the search client

Create `lib/search/searchClient.ts`:

```typescript
import { createSearchClient } from '@uniformdev/search';

export const { performSearch } = createSearchClient({
  apiUrl: process.env.NEXT_PUBLIC_UNIFORM_SEARCH_API_URL || '',
  apiKey: process.env.NEXT_PUBLIC_UNIFORM_SEARCH_API_KEY,
  projectId: process.env.NEXT_PUBLIC_UNIFORM_PROJECT_ID,
});
```

### Step 4: Copy search components

Copy the `components/search/` directory from this starter into your project. Each component is self-contained and uses the `useSearch()` hook from `@uniformdev/search/react`.

### Step 5: Register the components

Import all search components in your canvas components barrel file (e.g. `canvasComponents.ts`):

```typescript
import "./search/SearchEngine";
import "./search/SearchBox";
import "./search/SearchList";
import "./search/SearchPagination";
import "./search/SearchSorting";
import "./search/SearchTotalAmount";
import "./search/SearchPageSize";
import "./search/SearchFilters";
```

Make sure this barrel file is imported in your `_app.tsx`.

### Step 6: Configure Uniform component definitions

In the Uniform dashboard, create component definitions that match the `type` values used in `registerUniformComponent`. At minimum you need:

1. A `searchEngine` component with three slots: `search-top`, `search-main`, and `search-bottom`.
2. Child components (`searchBox`, `searchList`, `searchFilters`, `searchSorting`, `searchPagination`, `searchPageSize`, `searchTotalAmount`) allowed in the appropriate slots.

Alternatively, run `npm run uniform:push` to push the component definitions from the `uniform-data/` directory that ships with this starter.

### Step 7: Build a search page

In the Uniform dashboard, create a composition and add a `SearchEngine` component. Configure its parameters (content type, filters, sort options, page sizes) and drop child components into its slots. Publish the composition and visit the corresponding route.

---

## npm Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Start the Next.js development server |
| `build` | `next build` | Build for production |
| `start` | `next start` | Start the production server |
| `uniform:manifest` | `uniform context manifest download --output ./lib/uniform/manifest.json` | Download the personalization/testing manifest |
| `uniform:pull` | `uniform sync pull` | Pull Uniform project data to local `uniform-data/` |
| `uniform:push` | `uniform sync push` | Push local `uniform-data/` to the Uniform project |
| `uniform:publish` | `uniform context manifest publish` | Publish the context manifest |
