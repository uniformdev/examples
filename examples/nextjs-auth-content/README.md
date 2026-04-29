# Next.js Authenticated Content and Protected Routes Example

## Important: Uniform Preview support

In order to support Uniform preview for Next.js 16, you need to leave `middleware.ts` named as such, don't rename it to `proxy.ts` and keep this export in it:

```
export const runtime = 'experimental-edge';
```

## Getting Started

1. Prepare an empty Uniform project.
2. Set your Uniform env vars with developer permission API key in .env.
3. Configure your BETTER_AUTH_SECRET in .env
4. Configure a Google OAuth client ID and secret in .env
5. Install dependencies:
    ```bash
    npm i install
    ```
6. One-time: push content into your empty project with this command:
    ```bash
    npm run uniform:push
    ```
7. Publish manifest with Uniform personalization and test configuration:
    ```bash
    npm run uniform:manifest
    ```
8. Run the dev server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setting up Edge Config

If you leave Edge Config variables blank, reads from Edge Config are skipped. Instead, the local development server will use DEFAULT_ACCESS_CONFIG and production will default to
ERROR_ACCESS_CONFIG to prevent accidental public access to protected content.

### 1. Create Edge Config in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Edge Config**
3. Create Edge Config

### 2. Get Edge Config Connection String

After creating the Edge Config:

1. Click on your Edge Config
2. Copy the **Connection String** and save to .env (starts with `https://edge-config.vercel.com/...`)
3. Copy the **Edge Config ID** and save to .env (visible in the URL or settings)

### 3. Create Vercel API Token

1. Go to **Settings** → **Tokens** in your Vercel dashboard
2. Click **Create Token**
3. Give it a name
4. Select the appropriate scope (needs access to Edge Config)
5. Copy the token immediately (you won't see it again) and save to .env

## Setting up the Uniform Webhook

There is a custom webhook at `/api/webhooks/uniform` which handles updates to the protected routes access config.

This guide explains how to set it up

1. Ensure that ALLOWED_PAGE_TYPES includes all the Public IDs of composition components you have configured in Uniform.
2. Go to your Uniform project dashboard
3. Navigate to **Settings** → **Webhooks**
4. Click **Add Webhook**
5. Configure:
   - **URL**: `https://your-domain.com/api/webhooks/uniform`
   - **Events**: Select:
      - `composition.published`
      - `composition.deleted`
      - `entry.published`
      - `entry.deleted`
   - **Advanced > Custom Headers**: Add the `uniform-secret` header and use the same value as `UNIFORM_PREVIEW_SECRET`
6. Save the webhook

### Test the webhook

You can test updating the protected routes by using this script.

Test against localhost (default)

```sh
./scripts/test-webhook.sh
```

Test against custom URL

```sh
./scripts/test-webhook.sh https://your-domain.vercel.app
```

