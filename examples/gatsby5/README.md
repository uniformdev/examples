# Gatsby starter for Uniform

## Prerequisites
1. Uniform account. Request access [here](https://uniform.dev/try) if you don't have one already.
1. Node.js LTS installed.

## Repo structure

1. `.\web` contains Gatsby5 app wired up to Uniform SDK.
2. `.\uniform-source-plugin` contains Gatsby plugin for Uniform.

## Getting started

1. `git clone`
1. `cd .\uniform-source-plugin` and run `npm install`
2. `cd .\web` and run `npm install`
3. Create `.env` under `.\web` folder (see `.env.example`) and fill out two env vars based on your Uniform project:
   
   ```bash
    UNIFORM_API_KEY=
    UNIFORM_PROJECT_ID=
   ```
4. Run `npm run push` to push contents from disk (`/content` folder) into your project (this will overwrite your project contents, so be careful).
5. Run `npm run dev` to start dev server.
6. Configure preview in Canvas settings to use `http://localhost:8000/api/preview` while working locally

## Run production mode

1. Run `npm run build` to perform production build
2. Run `npm run serve` to startup the site (localhost:9000) will be used now.
3. Configure preview in Canvas settings to use `http://localhost:9000/api/preview` if you want preview to use production mode.

## Adding new content sources

[Check out our integrations docs](https://docs.uniform.app/docs/integrations) to see how to add content from your existing systems.