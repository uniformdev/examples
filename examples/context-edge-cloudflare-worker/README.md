# Example for Cloudflare Edge Workers

This is an example supporting [this tutorial](https://docs.uniform.app/context/reference/cloudflare).

## Pre-requisites
1. Node 16.x. On newer versions of node.js, you may get the following error during `npm run build`:

    ```
    opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
    library: 'digital envelope routines',
    reason: 'unsupported',
    code: 'ERR_OSSL_EVP_UNSUPPORTED'
    ```
1. Uniform project with at least 1 signal or enrichment created. Publish from the Personalization section at least once.

1. A static site generated with `outputType=edge` and available for the worker to connect to.

## Setup

1. Open wrangler.toml and set `ORIGIN_URL` to the value of your static origin (could be any origin, for example, Azure Blob Storage):

```bash
[vars]
ORIGIN_URL = "yoursite.z5.web.core.windows.net"
```

1. Set the worker name and account_id (can be retrieved from your Cloudflare panel)

```bash
name = "charliebanana"
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
npm run download:manifest
```

1. Run the following command for local worker to start:

```bash
wrangler dev ./src/index.ts --compatibility-date 2022-11-12
```

1. Open http://localhost:8787 after it is successful

## Publishing

Run this command to publish the worker:
```bash
wrangler publish ./src/index.ts --compatibility-date 2022-11-12
```