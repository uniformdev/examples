# New Next.js App Router SDK v2 Starter

## 🚧 Developer Preview
Contact Uniform for `NPM_TOKEN` to get access to the pre-release package.

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

1. Set `NPM_TOKEN` env var with `export set NPM_TOKEN=value-you-got-from-uniform`.

1. Install dependencies:
    ```bash
    npm i install
    ```

1. One-time: push content into your empty project with this command:
    ```bash
    npm run uniform:push
    ```

1. Run the dev server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.