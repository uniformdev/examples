# Gatsby starter for Uniform
This starter showcases the latest Uniform capabilities with Gatsby and is enabled for personalization and A/B testing.

## Prerequisites
1. Uniform account. Request access [here](https://uniform.dev/try) if you don't have one already.
1. Node.js LTS installed.

## Repo structure

1. `.\web` contains Gatsby5 app wired up to Uniform SDK.
1. `.\uniform-source-plugin` contains Gatsby plugin for Uniform.

## Getting started

1. `git clone`
1. `cd .\uniform-source-plugin` and run `npm install`
1. `cd .\web` and run `npm install`
1. Create `.env` under `.\web` folder (see `.env.example`) and fill out two env vars based on your Uniform project:
   
   ```bash
    UNIFORM_API_KEY=
    UNIFORM_PROJECT_ID=
   ```
1. Run `npm run uniform:push` to push contents from disk (`/content` folder) into your project (this will overwrite your project contents, so be careful).
    > The UNIFORM_API_KEY must have the Developer role assigned to be able to push content into the project. 
1. Run `npm run uniform:publish` to publish all compositions (optional if you intend to be working in dev mode).
1. Run `npm run dev` to start dev server.
1. Configure preview in Canvas settings to use `http://localhost:8000/api/preview` while working locally

## Run production mode

1. Run `npm run build` to perform production build
1. Run `npm run serve` to startup the site (localhost:9000) will be used now.
1. Configure preview in Canvas settings to use `http://localhost:9000/api/preview` if you want preview to use production mode.

## Adding new content sources

[Check out our integrations docs](https://docs.uniform.app/docs/integrations) to see how to add content from your existing systems.