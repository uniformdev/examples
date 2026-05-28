# Next.js App Router — Pagination patterns with Uniform

Two minimal demonstrations of paginating a list inside a Uniform composition rendered
with `@uniformdev/next-app-router` (the App Router / RSC SDK).

The two approaches sit at opposite ends of a tradeoff:

| Approach | Server-side re-render | Browser reload | Items in client RSC payload | Where pagination state lives |
| --- | --- | --- | --- | --- |
| **#1 — Datasource pagination via query strings** | Yes (route segment re-renders, fetch cached) | No (soft nav) | Only the visible window | URL query string |
| **#2 — Pagination container with `UniformSlot` wrapper** | No (no round trip after first render) | No | All items rendered upfront | Client component `useState` |

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
[`components/loadMore.tsx`](./components/loadMore.tsx).

The page size is a number in the URL (`?limit=5`, `?limit=10`, …). The list
re-renders **on the server** every time the page size changes, but it does so
through a soft navigation — no full document reload, and only the components
inside the new window are ever sent to the client.

How the data actually flows from the URL into the component:

1. The user clicks **Load more**, which calls
   `router.replace('?limit=10', { scroll: false })` inside `useTransition`.
   Soft navigation — no page reload, the existing list stays visible while the
   server works.
2. The middleware sees the new URL. **Because `limit` is declared as an allowed
   query string on the project map node**, it survives `buildRoutePath` and gets
   baked into the route the Route API is asked for. Without this declaration,
   query params are stripped here and never reach the API or the data resource.
3. The Uniform Route API resolves the route with `limit=10`, returns the
   edgehanced composition, and exposes `limit` as a *dynamic input* on the
   response.
4. `UniformComposition` lands the dynamic inputs on every component as
   `props.context.dynamicInputs`. `PaginatedList` reads `context.dynamicInputs.limit`,
   slices its source data to that length, and renders.

Key consequence: **the unrendered tail of the list never crosses the wire**.
Whether your underlying data has 47 items or 47,000, only the visible window
is rendered server-side and serialised into the RSC payload. The trade-off is
the cumulative re-send — each "load more" re-renders the cumulative window
(`?limit=10` re-renders all 10, not just the new 5) — but the upstream Route
fetch is cached per path (which includes the query string), so the marginal
cost is small.

What you need on the Uniform side: nothing beyond a project map node with the
query string declared. The screenshot of the node has `allowedQueryStrings:
[{ name: "limit", defaultValue: "5" }]`. No data type / data resource is
required for this minimal demo — the "data source" here is a constant array
in code that stands in for whatever real source you'd plug into the same
place.



## Important: Uniform Preview support

In order to support Uniform preview for Next.js 16 on Vercel, leave `middleware.ts`
named as such (do not rename to `proxy.ts`) and keep the runtime export:

```ts
export const runtime = "experimental-edge";
```
