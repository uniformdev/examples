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

Until the packages are on npm, this starter depends on a local clone via `file:`:

```
../../../toolbar/packages/toolbar
../../../toolbar/packages/toolbar-element
../../../toolbar/packages/toolbar-react
```

`.npmrc` sets `install-links=true` so those `file:` deps are copied instead of
symlinked — required for Next.js Turbopack (symlinks outside the project resolve as
missing modules).

Toolbar peers expect `@uniformdev/context` `^20.72`. This starter is still on `20.70` —
install with `npm install --legacy-peer-deps` until you bump the Uniform packages.
After publish, switch the toolbar deps to the published versions (for example `^20.73.0`)
and you can drop `install-links`.

## Important: Uniform Preview support

In order to support Uniform preview for Next.js 16 on Vercel, you need to leave `middleware.ts` named as such, don't rename it to `proxy.ts` and keep this export in it:

```
export const runtime = 'experimental-edge';
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