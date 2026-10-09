# New Next.js 16 App Router Starter

Featuring `Cache Components` support (disabled by default in this starter, read later on how to enable).

## Demo

See [this live url](https://nextjs-app-router-v2.vercel.app/) to experience personalization and edge personalization.

## Getting Started

1. Prepare an empty Uniform project.

1. Set your own Uniform env vars with developer permission API key in `.env`.

1. Install dependencies:
    ```bash
    npm install
    ```

1. One-time: push content into your empty project with this command:
    ```bash
    npm run uniform:push
    ```

1. Publish manifest with Uniform personalization and test configuration:
    ```bash
    npm run uniform:manifest
    ```

1. Run the dev server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production build

Run `npm run build` for production build and `npm start` to start server in production mode locally.

## Uniform toolbar

In development, the floating product toolbar mounts from
`lib/uniform/CustomUniformClientContext.tsx` (same Context instance as
`UniformComposition`).

`package.json` overrides `@uniformdev/context` so the toolbar uses the same
version as the app. The toolbar's peer range (`^20.72`) does not include
prerelease versions of the SDK.

## Edge personalization (NESI)

`middleware.ts` uses `vercelUniformEdgeMiddleware` from `@uniformdev/next-app-router/vercel`.

- Every visitor of a route shares one cached page (`/uniform/[code]`). Personalizations and tests
  are in that page between NESI tags.
- For an HTML document request, the middleware fetches the cached page and keeps only the
  visitor's variants as it streams through. The first paint shows the right variant, with no flicker.
- The middleware loads the published Context manifest at runtime and keeps it in the Vercel runtime
  cache. `app/api/preview/route.ts` passes `expireVercelRuntimeCacheTags` to the POST handler, so a
  publish expires the cached manifest and page records. Point a Uniform webhook at `/api/preview`
  for this.
- Pages that the middleware learns have no placements are rewritten without processing.
  `generateStaticParams` prebuilds both edge mode values (`edgeMode: [true, false]`) for this.
- The `missing` header rule in the matcher stops the middleware from running again on its own
  fetch of the cached page (`x-uniform-edge-origin`).
- Visibility rules run in the browser. NESI does not support them.
- Outside Vercel (`next start` locally), the runtime cache falls back to memory.

## Important: Uniform Preview support

In order to support Uniform preview for Next.js 16 on Vercel, you need to leave `middleware.ts` named as such, don't rename it to `proxy.ts` ([vercel/next.js#82344](https://github.com/vercel/next.js/issues/82344)) and keep the edge runtime in its config:

```
export const config = {
  matcher: [/* ... */],
  runtime: 'experimental-edge',
};
```

## How to enable cache components support

Cache components allow to stream dynamic user state-dependent experience without blocking full page rendering. Depending on your use case you may or may not need this feature, so it is not enabled by default.

1. Enable `cache components` feature in next.config
```bash
    const nextConfig: NextConfig = {
        cacheComponents: true,
    };
```

2. Update your `./app/uniform/[code]/page.tsx` to import `resolveRouteFromCode` function from another path:
```bash
import { resolveRouteFromCode } from '@uniformdev/next-app-router/cache';
```

3. Uncomment the remaining parts commented out related to cache component support in `./app/uniform/[code]/page.tsx`