# Svelte Starter for Uniform

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Prerequisites

1. Use `pnpm` instead of `npm` for dependency install (this is a temporary limitation).
1. npm token to access private packages, provided by Uniform.
1. Node.js 22+
1. Admin access to Uniform project so you can create an API key.

## Getting started


1. Set `NPM_TOKEN` environment variable on your command line with `export set NPM_TOKEN=<insert-npm-token-provided>`
1. Install dependencies with `pnpm install`.
1. Configure `.env` file, see `.env.example`. Get the values of `UNIFORM_API_KEY` and `UNIFORM_PROJECT_ID` from Uniform.app dashboard (Team -> Security -> API Key).

```sh
    UNIFORM_API_KEY=
    UNIFORM_PROJECT_ID=
    UNIFORM_PREVIEW_SECRET=hello-world
```

Afterwards, you should be able to start a development server and see :

```sh
pnpm dev
```

## Building

To create a production version of your app:

```sh
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
