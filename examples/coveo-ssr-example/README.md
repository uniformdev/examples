This example is based on the nextjs-app-router-v2 example in this repo. 

## Getting Started

1. Prepare an empty Uniform project.

1. Set your Uniform env vars with developer permission API key in .env.

1. Install dependencies:
    ```bash
    npm install
    ```

1. One-time: push content into your empty project with this command:
    ```bash
    npm run uniform:push
    ```

1. Publish manifest with Uniform personalization and test configuration:
    ```bash
    npm run uniform:manifest
    ```

1. Run the dev server:

    ```bash
    npm run dev
    ```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 

## How to setup Coveo

The code is based on the [Coveo nextjs app router SSR sample](https://github.com/coveo/ui-kit/tree/main/samples/headless-ssr/search-nextjs) and [Coveo SSR docs](https://docs.coveo.com/en/p25b0411/coveo-for-commerce/build-search-interfaces-ssr).

Unless you specify the Coveo environment variables, it uses `getSampleSearchEngineConfiguration()` to pull the same content. 

### Coveo pipeline setup

Often, you may want to see filtered data and not everything in the source. You can create a Coveo pipeline and set the name in the Search Container parameter in Uniform

## Pushing data into Coveo

The `/api/index-rebuild` endpoint handles adding data into the Coveo push source. You need to set up a new push source and configure these environment varioabbles:
```bash
  COVEO_ORG_ID;
  COVEO_SOURCE_ID;
  COVEO_BEARER_TOKEN;
```
For authentication, the `secret` query string parameter must match the `UNIFORM_PREVIEW_SECRET`     environment variable. The logic or rebuild gets all published project map nodes, gets corresponding compositions and read the `searchtitle` and `searchdescription` composition parameters. You can update the code to push more data accoring to your needs. 

### Notes and limitations:

- If you need specific facets, they need to be setup in the `engine-definition.ts` and configured in the facet `SearchFacets.tsx` component. The values are no exposed as Uniform parameters because of the dynamic nature of facets and the need to setup a hook for each facet
- The approach is using a Coveo public API key anonymous approach, which means the site visitor can see the API key and may be able to access the Coveo data directly. If you need to secure the search results, please check [this article](https://docs.coveo.com/en/1369/build-a-search-ui/choose-and-implement-a-search-authentication-method)
- The index rebuild code performs full rebuild, i.e. all new documents are pushed and older documents are deleted using this Coveo approach [https://docs.coveo.com/en/131/index-content/delete-old-items-in-a-push-source](https://docs.coveo.com/en/131/index-content/delete-old-items-in-a-push-source)
- The index rebuild only uses `searchtitle` and `searchdescription` composition parameters. You will need to update the index-rebuild code to push more data.

## How to enable cache components support

1. Enable `cache components` feature in next.config
```bash
    const nextConfig: NextConfig = {
        cacheComponents: true,
    };
```

2. Update your `page.tsx` to import `resolveRouteFromCode` function from another path:
```bash
import { resolveRouteFromCode } from '@uniformdev/next-app-router/cache';
```