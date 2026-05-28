# Next.js App Router — Pagination patterns with Uniform

Two minimal demonstrations of paginating a list inside a Uniform composition rendered
with `@uniformdev/next-app-router` (the App Router / RSC SDK).

The two approaches sit at opposite ends of a tradeoff:

| Approach | Server-side re-render | Browser reload | Items in client RSC payload | Where pagination state lives | Slicing |
| --- | --- | --- | --- | --- | --- |
| **#1 — Datasource pagination via dynamic path segment** | Yes (route segment re-renders, fetch cached) | No (soft nav) | Only the current page | URL path (`/pagination-datasource/<page>`) | In the Uniform data resource (server-side, before any code runs) |
| **#2 — Pagination container with `UniformSlot` wrapper** | No (no round trip after first render) | No | All items rendered upfront | Client component `useState` | In the React component (client-side, after server sent everything) |

Both demos show **page-at-a-time** navigation with Prev / Next buttons; what
differs is *where* the slicing happens and consequently what's in the page
payload.

Pick the one that matches your bottleneck — both are demonstrated here as separate
commits so you can read the diff for each independently.

## Routes

After running the example you'll have two demo pages under the home locale:

- `/en/pagination-datasource/1` — Composition **#1**, real blog entries from a Uniform data resource, soft navigation.
- `/en/pagination-slot` — Composition **#2**, client-side reveal via `UniformSlot`.

The original starter home page at `/en` is left intact so you can compare a baseline
composition with the pagination demos.

## Getting started

1. Set Uniform env vars in `.env` (see `.env.example`). The two demo compositions are
   already pushed to the connected Uniform project.

1. Install dependencies and pull the latest content state into git:

   ```bash
   npm install
   npm run uniform:pull
   ```

1. Run the dev server:

   ```bash
   npm run dev
   ```

Open <http://localhost:3000/en/pagination-datasource> and
<http://localhost:3000/en/pagination-slot> to see the two approaches side by side.

> The pagination demos share a single set of Prev / Next controls
> ([`components/paginationControls.tsx`](./components/paginationControls.tsx)).
> Each approach wires those controls to a different state mechanism
> (router navigation vs. `useState`) but the rendered UI is identical.

## How each approach works

### Approach #1 — Datasource pagination via dynamic path segment

**Route:** `/en/pagination-datasource/<page>` (composition `01 - Datasource Pagination`).
A bare `/en/pagination-datasource` (no page number) is treated as page 1.
**Files:**
- [`components/paginatedList.tsx`](./components/paginatedList.tsx) — server component, renders the data-resource cards.
- [`components/routerPagination.tsx`](./components/routerPagination.tsx) — client component, wires `PaginationControls` to a router soft navigation.
- [`components/paginationControls.tsx`](./components/paginationControls.tsx) — generic Prev / Next UI, also used by Approach #2.
- [`middleware.ts`](./middleware.ts) — rewrites `/pagination-datasource/<page>` to `/pagination-datasource/<offset>` before the SDK sees it.
- [`lib/paginationDatasource.ts`](./lib/paginationDatasource.ts) — `PAGE_SIZE` (default 5) and the page↔offset helpers, shared between middleware and component so they can't drift.

All the actual content comes from Uniform. The composition has a `paginatedList` whose `cards` slot
holds a `$loop` bound to a `Query Blog Entry Content` data resource (`queryBlogEntry` data type),
with the `offset` variable bound to the project map node's `:offset` dynamic input. Page size is
the data resource's `limit` (5). **The code does not contain any sample data, mapping, or slicing —
the only computation in TypeScript is `(page - 1) * PAGE_SIZE`.**

How the data actually flows from the URL into the rendered cards:

1. Visitor browses to `/en/pagination-datasource/3` (or clicks Next from page 2). The browser URL
   uses **page numbers** because that's what humans want to see and share. A bare path
   `/en/pagination-datasource` (or `…/`) is treated as page 1 — the middleware fills in the
   missing offset rather than letting Uniform 404.
2. The middleware's `rewriteRequestPath` transforms the path: `page = 3` → `offset = (3-1) * 5 = 10`,
   producing `/en/pagination-datasource/10`. This rewrite is what Uniform sees — the browser URL
   doesn't change.
3. The project map node `/:locale/pagination-datasource/:offset` matches, and Uniform exposes
   `offset = "10"` as a dynamic input. The `queryBlogEntry` data resource's `offset` variable is
   bound to that dynamic input, and `limit` is bound to `5`. The Route API resolves the data
   resource against the underlying blog entry source and returns exactly the 5-item window.
4. The `$loop` expands its template card per entry server-side. `paginatedList` receives
   `slots.cards` already containing 5 rendered card components with title/description bound to
   blog fields — nothing left to do but `<UniformSlot slot={slots.cards} />`.
5. `paginatedList` also reads `context.dynamicInputs.offset` to compute the current page back
   (`offset / PAGE_SIZE + 1`) and hands it to `PaginationControls`. Next is disabled when the
   returned slot has fewer than `PAGE_SIZE` items — the partial page is unambiguously the last one.

The button labels themselves come from the composition. `paginatedList` exposes
`previousLabel` and `nextLabel` text parameters that are rendered through
`<UniformText>`, so authors can edit them inline in the Canvas editor (or change
them per locale) without touching code.

Key consequence: **only the current page ever crosses the wire, and the code knows nothing about
the entries**. The data resource handles all slicing on the Uniform side; the React component is
content-agnostic. The trade-off is that every Prev/Next click is a server round-trip — but the
upstream Route fetch is cached per resolved path (which includes the offset), so distinct pages
each become their own cache entry.

What you need on the Uniform side:

- A `paginatedList` component definition with a `cards` slot and four parameters: `heading`,
  `previousLabel`, `nextLabel` (text, localizable).
- A dynamic project map node `/:locale/pagination-datasource/:offset` attached to the composition.
- The composition's data resource has `offset = ${offset}` and `limit = 5` in its variables (so
  the dynamic input drives the slice).

> ⚠️ **Project gotcha**: this starter customises the middleware with `rewriteRequestPath`, so the
> page→offset translation has to live in *that* function — adding a generic Next.js rewrite in
> `next.config.ts` wouldn't run before the Uniform SDK sees the path. See
> [`middleware.ts`](./middleware.ts).

### Approach #2 — Pagination container with `UniformSlot` wrapper

**Route:** `/en/pagination-slot` (composition `02 - Pagination Container`).
**Files:** [`components/paginationContainer.tsx`](./components/paginationContainer.tsx),
[`components/card.tsx`](./components/card.tsx).

This is the App Router port of the well-known pages-router pattern where a
`PaginationContainer` wraps a slot, holds the current page in `useState`, and
slices the slot's children to show one page at a time. In the pages-router
SDK (`@uniformdev/canvas-react`) the slice happens inside
`<UniformSlot wrapperComponent={({ items }) => …} />`. The App Router SDK
(`@uniformdev/next-app-router`) doesn't have an `items`-style wrapper prop —
its `UniformSlot` is per-child only. The clean equivalent is to call
[`getUniformSlot({ slot })`](https://github.com/uniformdev/uniform/blob/main/packages/next-app-router/src/components/getUniformSlot.ts)
directly — it returns the items as an array of React nodes that you slice and
render however you want. That's what `paginationContainer.tsx` does.

```tsx
"use client";

const allItems = getUniformSlot({ slot: slots.cards }) ?? [];
const start = clampedPage * pageSize;
const visibleItems = allItems.slice(offset + start, offset + start + pageSize);
// …render visibleItems + Prev/Next buttons driven by a useState page index.
```

In the composition, `paginationContainer.cards` is filled by a `$loop` bound to
the **same `Query Blog Entry Content` data resource as Approach #1** — but here
the resource fetches a bigger window (50 items, no offset) and the container
slices them client-side. The container's parameters are `defaultLimit` (page
size), `defaultOffset`, plus `previousLabel` / `nextLabel` — the same label
parameters Approach #1 uses, so authors edit them the same way. Prev / Next
come from the shared
[`PaginationControls`](./components/paginationControls.tsx) — same component
the datasource demo uses — wired here to a `useState` page index instead of a
router. Paging is **purely a client state change** — no server round-trip,
instant page changes, no URL change. The user sees exactly one page at a
time; clicking Prev / Next moves to the adjacent page (not cumulative — old
items disappear when you move forward).

**The tradeoff.** Because `PaginationContainer` is a client component
(it needs `useState`), every element passed to it as part of the `slots` prop
gets serialized into the RSC payload. That means **all 50 cards are rendered
server-side and shipped to the browser on first load**, even though only one
page is visible. Paging here is a *visual* pagination, not a payload reduction.
You're trading payload size for zero-latency page changes.

When to prefer #2: small bounded slots (a handful to maybe a few dozen items)
where the simplicity of pure-client state is worth it, and where shipping the
hidden pages with the initial document is acceptable. When to prefer #1: the
underlying list is large enough that shipping the unrendered tail is actually
expensive.



## Important: Uniform Preview support

In order to support Uniform preview for Next.js 16 on Vercel, leave `middleware.ts`
named as such (do not rename to `proxy.ts`) and keep the runtime export:

```ts
export const runtime = "experimental-edge";
```
