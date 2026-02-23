# New Next.js 16 App Router SDK v2 Starter

Featuring `Cache Components` support (disabled in this starter, read later on how to enable).

## 🚧 Release Candidate
This is a late release candidate of the SDK. While we don't anticipate any breaking changes at this point, there may be additional fixes and changes before GA.

## Important: Uniform Preview support

In order to support Uniform preview for Next.js 16, you need to leave `middleware.ts` named as such, don't rename it to `proxy.ts` and keep this export in it:

```
export const runtime = 'experimental-edge';
```

## Demo

See [this live url](https://nextjs-app-router-v2.vercel.app/) to experience personalization and edge personalization.

## Getting Started

1. Prepare an empty Uniform project.

1. Set your Uniform env vars with developer permission API key in .env.

1. Install dependencies:
    ```bash
    npm i install
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

## How to enable cache components support

1. Enable `cache components` feature in next.config
```bash
    const nextConfig: NextConfig = {
        cacheComponents: true,
    };
```

2. Update your `page.tsx` to import `resolveRouteFromCode` function from another path:
```bash
import { resolveRouteFromCode } from '@uniformdev/next-app-router/cache';
```