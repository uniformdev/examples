# Context tracker events with Intersection Observer

This is an example showing how to emit events related to Uniform personalization and A/B testing only when component enters the viewport.

This is using IntersectionObserver API, emitting custom events `personalization_seen` and `test_seen` (see how these events are managed in PageComposition) and modified gtm plugin to send events in these conditions, see `enableGtmAnalytics` in `uniformContext.ts`.

## Getting started

1. `npm install`
1. `npm run dev` and open localhost:3000

## Deploying to your own project

1. Setup your own project id and API key values in `.env` with the API key that has Developer role.
2. `npm run uniform:push` to push content.
3. `npm run dev` and open localhost:3000

## Rendering modes
Both SSR (default) and SSG are supported, see `/pages/[[...slug]].tsx.ssg` and `/pages/[[...slug]].tsx.ssr` and enable the right mode for your use case.