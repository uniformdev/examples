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

The detailed write-up for each approach is added in its own commit:

- Approach #1 → see the section below once that commit is in your tree.
- Approach #2 → likewise.

## Important: Uniform Preview support

In order to support Uniform preview for Next.js 16 on Vercel, leave `middleware.ts`
named as such (do not rename to `proxy.ts`) and keep the runtime export:

```ts
export const runtime = "experimental-edge";
```
