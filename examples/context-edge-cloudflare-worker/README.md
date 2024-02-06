# Example for Cloudflare Edge Workers

This is an example supporting [this tutorial](https://docs.uniform.app/context/reference/cloudflare).

## Pre-requisites

1. Set `NPM_TOKEN` environment variable to the value provided by your Uniform rep. This will be needed to be able to run `npm install` since this project is using some private packages.

2. Uniform project with at least 1 signal or enrichment created. Publish from the Personalization section at least once.

3. The latest version of Wrangler CLI installed:
    ```bash
    npm i @cloudflare/wrangler -g
    ```

4. An origin site is rendering with "edge" output type and available for the worker to connect to. This could be either a server-side rendered site, or a statically generated site, the important part is that `UniformContext` must have `outputType` set to `edge`, example from our React-based apps (similar setup needed for Vue.js apps):
   ```tsx
        <UniformContext
            ...
            outputType={"edge"}
        >
        ...
        </UniformContext>
   ```

## Setup

1. Open `wrangler.toml` and set `ORIGIN_URL` to the value of either your server (if you are doing SSR), or your static origin in case of SSG. This could be any origin, for example, Azure Blob Storage, S3, etc., make sure it starts with `https://`.

    ```bash
    [vars]
    ORIGIN_URL = "https://yoursloworigin.com"
    ```

1. Set the worker name and account_id (can be retrieved from your Cloudflare panel)

    ```bash
    name = "your-worker-name"
    account_id = "abc"
    ```

1. Update your .env file according to your Uniform project settings:

    ```bash
    UNIFORM_API_KEY=your-project-api-key
    UNIFORM_PROJECT_ID=your-project-id
    ```

## Run locally

1. Run this command to download Uniform manifest with personalization configuration:

    ```bash
    npm run uniform:manifest
    ```

1. Run the following command for local worker to start:

    ```bash
    wrangler dev
    ```

1. Open http://localhost:8787 after it is successful

## Publishing

Run this command to publish the worker:
```bash
wrangler publish
```