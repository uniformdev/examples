# Uniform + Netlify edge-side personalization starter

## Pre-requisites

1. Netlify account (start for free [here](https://app.netlify.com/signup)).
2. Uniform account (start for free [here](https://uniform.dev/free)).
3. `IMPORTANT!` Set `NPM_TOKEN` environment variable -> [contact us](https://uniform.dev/contact) to get one.

## Docs / resources

1. [Blog post](https://uniform.dev/blogs/uniform-optimizes-site-performance-with-netlify-edge-functions) on why this matters

1. [Uniform docs](https://docs.uniform.app/integrations/cdn/netlify/personalization)

1. [Learn with Jason session recording](https://www.youtube.com/watch?v=pEiCZvKj9xE) with the developer walk-through.

## Getting started

1. `npm install` (don't forget about `NPM_TOKEN`)
2. `npm run dev` to run locally, or `netlify dev` to run with local Netlify.
3. Change the .env vars to yours after creating Uniform project.
4. `netlify deploy --build` to deploy to Netlify.