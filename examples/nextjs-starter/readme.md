# Hello World Next.js starter for Uniform

This starter contains the essentials with pre-enabled Uniform capabilities. It has a single page type and a single component (Hero). It is enabled for visual experience management, personalization and A/B testing.

Recommended as a good starting point for green field projects or learning.

[Pre-deployed demo](https://uniform-hello-world.vercel.app/).

## Getting started

1. `npm install`
1. `npm run dev` and open http://localhost:3000

## Deploying to your own project

1. Setup your own project ID and API key values in `.env` with the API key that has Developer role.
2. `npm run uniform:push` to push content.
3. `npm run dev` and open localhost:3000

## Rendering modes
Both SSR (default) and SSG are supported, see `/pages/[[...slug]].tsx.ssg` and `/pages/[[...slug]].tsx.ssr` and enable the right mode for your use case.

## Edge personalization on Vercel

See the steps in `middleware.ts.disabled` on how to activate the mode.