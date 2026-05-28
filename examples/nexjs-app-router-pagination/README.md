# Next.js App Router — Pagination patterns with Uniform

Two minimal demonstrations of paginating a list inside a Uniform composition rendered
with `@uniformdev/next-app-router` (the App Router / RSC SDK).

The two approaches sit at opposite ends of a tradeoff:

| Approach | Server-side re-render | Browser reload | Items in client RSC payload | Where pagination state lives |
| --- | --- | --- | --- | --- |
| **#1 — Datasource pagination via query strings** | Yes (route segment re-renders, fetch cached) | No (soft nav) | Only the current page | URL query string (`?page=`) |
| **#2 — Pagination container with `UniformSlot` wrapper** | No (no round trip after first render) | No | All items rendered upfront | Client component `useState` |

Both demos show **page-at-a-time** navigation with Prev / Next buttons; what
differs is *where* the slicing happens and consequently what's in the page
payload.

Pick the one that matches your bottleneck — both are demonstrated here as separate
commits so you can read the diff for each independently.

## Routes

After running the example you'll have two demo pages under the home locale:

- `/en/pagination-datasource` — Composition **#1**, query-string driven, soft navigation.
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

## How each approach works

### Approach #1 — Datasource pagination via query strings

**Route:** `/en/pagination-datasource` (composition `01 - Datasource Pagination`).
**Files:** [`components/paginatedList.tsx`](./components/paginatedList.tsx),
[`components/paginationControls.tsx`](./components/paginationControls.tsx).

The current page is a number in the URL (`?page=1`, `?page=2`, …). Page size
is a constant in `paginatedList.tsx` (5). Each click on Prev / Next causes a
**server-side re-render** of the route segment with the new page, through a
soft navigation — no full document reload, and only the current page's items
are ever sent to the client.

How the data actually flows from the URL into the component:

1. The user clicks **Next**, which calls
   `router.replace('?page=2', { scroll: false })` inside `useTransition`.
   Soft navigation — no page reload, the existing page stays visible while
   the server works.
2. The middleware sees the new URL. **Because `page` is declared as an allowed
   query string on the project map node**, it survives `buildRoutePath` and
   gets baked into the route the Route API is asked for. Without this
   declaration, query params are stripped here and never reach the API.

   > ⚠️ **Project gotcha**: this starter customises the middleware with
   > `rewriteRequestPath`, and that custom function must forward `url.search`
   > as well. See [`middleware.ts`](./middleware.ts) — the path returned to the
   > SDK is `formatPath(url.pathname, locales[0]) + url.search`. If you drop
   > `url.search` here, the SDK never sees the query and Approach #1 silently
   > falls back to the default `page`.
3. The Uniform Route API resolves the route with `page=2`, returns the
   edgehanced composition, and exposes `page` as a *dynamic input* on the
   response.
4. `UniformComposition` lands the dynamic inputs on every component as
   `props.context.dynamicInputs`. `PaginatedList` reads
   `context.dynamicInputs.page`, slices its source data to that window, and
   renders.

Key consequence: **only the current page ever crosses the wire**. Whether
your underlying data has 47 items or 47,000, exactly `PAGE_SIZE` items are
rendered server-side and serialised into the RSC payload. The trade-off is
that every Prev/Next click is a server round-trip — but the upstream Route
fetch is cached per path (which includes the query string), so the marginal
cost is small. Each distinct `?page=N` becomes its own cache entry.

What you need on the Uniform side: nothing beyond a project map node with
the query string declared. The node has `allowedQueryStrings: [{ name: "page",
defaultValue: "1" }]`. No data type / data resource is required for this
minimal demo — the "data source" here is a constant array in code that
stands in for whatever real source you'd plug into the same place.

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

The composition simply authors `paginationContainer` with 11 `card` children
in its `cards` slot. The container's `defaultLimit` (page size),
`defaultOffset`, and `loadMoreText` (Next-button label) parameters drive the
windowing. Paging is **purely a client state change** — no server round-trip,
instant page changes, no URL change. The user sees exactly one page at a time;
clicking Prev/Next moves to the adjacent page (not cumulative — old items
disappear when you move forward).

**The tradeoff.** Because `PaginationContainer` is a client component
(it needs `useState`), every element passed to it as part of the `slots` prop
gets serialized into the RSC payload. That means **all 11 cards are rendered
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
