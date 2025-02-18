# Uniform Examples

This repo contains various examples to facilitate your getting-started experience with Uniform capabilities, such as Uniform Context, Uniform Canvas, and Uniform Mesh.

> ‼️ For a more complete starter kit, consider looking at the [Component Starter Kit](https://github.com/uniformdev/component-starter-kit-next-approuter) instead.

## Basic starters

These starters don't have a lot of functionality, they are single page, single component sort of "hello world" starters typically used to learn the essentials of Uniform SDK and be used as a starting point for the greenfield projects. Preview, personalization and A/B testing is enabled on all of these starters.

- [Hello world starter for Next.js 15 App Router](./examples/nextjs-app-router) - essential 1 page, 1 component starter, recommended baseline for new projects using Next.js 15 app router.

- [Hello world starter for Next.js Page Router](./examples/nextjs-starter) - essential 1 page, 1 component starter, recommended baseline for new projects using Next.js page router.

- [Search starter](./examples/nextjs-search) - essential saerch API example starter based on Next.js 15 app router.

- [Nuxt hello world starter](./examples/nuxtjs-starter) - essential 1 page, 1 component starter, recommended baseline for new projects using Nuxt 3. The starter is available to be installed via `npx @uniformdev/cli@latest new`.

- [Gatsby 5 starter](./examples/gatsby5) - a simple marketing site showing the essentials of Uniform + Gatsby.js integration, including personalization and A/B testing!

- [Remix starter](./examples/remix-cloudflare-starter/) - essential 1 page, 1 component starter for Remix configured with Cloudlare, recommended as reference for new projects using Uniform Remix SDK.

## Localization starters

- 🆕 [Next.js starter for App Router](./examples/nextjs-app-router-localization-starter) - essential localization enabled starter for Next.js with app router and React Server Components.

- 🆕 [Next.js starter for Page Router](./examples/nextjs-page-router-localization-starter) - essential localization enabled starter for Next.js.

## Starters pre-wired with integrations

- 🆕 [Next.js starter for Klevu](./examples/klevu-starter) - Next.js starter that contains Klevu search components pre-wired to be managed in Uniform, see more docs [here](https://docs.uniform.app/docs/integrations/search/klevu).

- [Segment CDP personalization example](./examples/segment-personalization) - Next.js starter pre-wired to work with Twilio Segment Profile API to enable personalization. See the related docs [here](https://docs.uniform.app/docs/integrations/data/segment).

- [Next.js starter for Sitecore](./examples/nextjs-starter) - essential 1 page, 1 component starter pre-wired with the Sitecore XM/XP integration. Recommended baseline for new projects using Next.js.

- [Next.js starter for Algolia](./examples/algolia-starter) - Next.js starter that contains Algolia instant search components pre-wired to be managed in Uniform, see more docs [here](https://docs.uniform.app/docs/integrations/search/algolia/algolia-components).
  
- [Next.js starter for Coveo](./examples/coveo-starter) - Next.js starter that contains Coveo search components pre-wired to be managed in Uniform, see more docs [here](https://docs.uniform.app/docs/integrations/search/coveo).

## Uniform Context examples

These starters are enabled with edge-side personalization SDK without visual workspace / Canvas:

1. [Next.js app router](./examples/nextjs-app-router-context/)
1. [For Akamai using Edge Workers](./examples/context-edge-akamai/)
1. [For Cloudflare using Workers](./examples/context-edge-cloudflare-worker/)
1. [For Netlify using Edge Functions](./examples/context-edge-netlify/)
1. [For Vercel using Edge Middleware](./examples/context-edge-vercel/)

## Uniform Mesh starter

[This Next.js starter](./examples/mesh-integration/) is provided to streamline your first mesh integration development experience. See [the docs here](https://docs.uniform.app/docs/integrations/mesh-integrations/custom-integrations) for info on how to extend Uniform Mesh.

## Other starters and examples

There are more useful starters and examples in other repos:

- [Component Starter Kit](https://github.com/uniformdev/component-starter-kit-next-approuter) - essential set of components you need to start building personalizable web experiences with Uniform. Built with TailwindCSS, DaisyUI, React, and Next.js
- [Salesforce Composable Storefront](https://github.com/uniformdev/salesforce-composable-storefront-starter) - Uniform Composable Storefront Starter for Salesforce B2C Commerce.
- [Next.js Marketing Starter](https://github.com/uniformdev/uniformconf) - imaginary conference site in Next.js leveraging all the Uniform goodness: Canvas and Context.
- [Nuxt Marketing Starter](https://github.com/uniformdev/uniformconf-nuxt) - imaginary conference site in Nuxt 3 leveraging all the Uniform goodness: Canvas and Context.