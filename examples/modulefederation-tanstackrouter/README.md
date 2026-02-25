# Module Federation + TanStack Router + Vite

This demonstrates how to use [@tanstack/react-router](https://tanstack.com/router/latest) in a [Module Federation](https://module-federation.io) architecture, with [Uniform](https://uniform.app) providing CMS-driven composition and visual editing.

1. Shared Uniform Components between micro-frontend modules
2. Content lives in multiple projects for separation of teams
3. Content editors get a visual preview experience
4. A "host" project to bring all micro-frontend projects together

## Architecture overview

There are two applications and one shared package:

- **Host** (`/host`) — the main application at `localhost:5173`
- **Subapp** (`/subapp`) — a federated micro-frontend at `localhost:5183`, mounted under `/subapp` in the host
- **`@repo/uniform-preview`** (`/packages/uniform-preview`) — a shared package that provides the Uniform server middleware, preview context, and composition API client

### TanStack Router + Module Federation

Both apps have their own TanStack Router and can run independently. In the host, the subapp's `routeTree` is loaded via module federation and merged into the host's route tree under a base path (`/subapp`).

- **Subapp** exposes its `routeTree` and a `SubAppBanner` component via `@module-federation/vite`
- **Host** dynamically loads the subapp's route tree and registers it as a subtree (see [./host/src/utils/registerSubtree.tsx](./host/src/utils/registerSubtree.tsx))
- A single router instance is used to avoid conflicts with browser history navigation
- Shared dependencies (`react`, `react-dom`, `@tanstack/react-router`, `@uniformdev/canvas`, `@uniformdev/canvas-react`) are configured as singletons in the federation config

Remote loading is handled manually (see [./host/src/utils/loadRemote.ts](./host/src/utils/loadRemote.ts)) rather than using `@module-federation/vite`'s built-in import syntax, so that a failed remote doesn't cause a blank page.

## Uniform integration

Uniform provides the content and layout for pages. Authors build compositions (pages) in the Uniform visual editor, and the frontend fetches and renders them using Uniform's SDK.

### How compositions are fetched and rendered

1. TanStack Router catch-all routes (`$`) call the composition API to fetch the Uniform composition for the current path
2. The composition data is passed to `<UniformComposition>` which maps each component `type` to a React component via a `resolveComponent` function
3. Each app has its own `resolveRenderer` that maps Uniform component types (e.g. `hero`, `page`, `siteHeader`) to React components
4. Components use `<UniformSlot>` for rendering child slots and `<UniformText>` / `<UniformRichText>` for inline-editable parameters

### The `@repo/uniform-preview` package

This shared package (`/packages/uniform-preview`) provides three entry points:

| Export | Description |
|---|---|
| `@repo/uniform-preview/vite` | `setupUniformServer()` — Vite dev server middleware that adds API endpoints for Uniform |
| `@repo/uniform-preview/react` | `PreviewProvider` and `usePreview()` — React context for managing preview/contextual editing state |
| `@repo/uniform-preview/api` | `createCompositionApi()` — factory that returns `fetchComposition()` and `fetchCompositionById()` methods |

### Uniform server integration with Vite

Instead of a separate backend, Uniform's API layer runs as Vite dev server middleware. This is sufficient for this POC, in production you will need to replicate these API endpoints in your own API layer.

The `setupUniformServer()` function from `@repo/uniform-preview/vite` is registered as a Vite plugin in each app's `vite.config.ts`:

```ts
// host/vite.config.ts (simplified)
import { setupUniformServer } from "@repo/uniform-preview/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      // ... other plugins
      {
        name: "uniform-server",
        configureServer(server) {
          setupUniformServer(server, {
            projectId: env.VITE_UNIFORM_PROJECT_ID,
            apiKey: env.UNIFORM_API_KEY,
            apiHost: env.UNIFORM_API_HOST,
            edgeApiHost: env.UNIFORM_EDGE_API_HOST,
          });
        },
      },
    ],
  };
});
```

This adds three middleware endpoints to the Vite dev server:

| Endpoint                                             | Purpose                                                                                                                                                                                                          |
|------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/api/preview?app=...&secret=...`                    | Handles Uniform Canvas contextual editing redirects. When the Uniform visual editor opens a preview, this endpoint redirects to the correct frontend route with `preview=true` and `compositionId` query params. |
| `/api/composition?path=...`                          | Fetches a composition by its route path using `RouteClient` from `@uniformdev/canvas`.                                                                                                                           |
| `/api/composition-by-id?compositionId=...&state=...` | Fetches a composition by ID using `CanvasClient`. Used during preview when the composition ID is known.                                                                                                          |

The middleware also handles:
- **CORS** — allows requests from Uniform Canvas origins (`*.uniform.app`) and configurable additional origins (used by the subapp to allow cross-MFE requests from the host)
- **Security headers** — sets `X-Content-Type-Options` and `X-XSS-Protection`
- **OPTIONS preflight** — responds to CORS preflight requests on all `/api/` routes

### Preview and contextual editing

The `PreviewProvider` React context (from `@repo/uniform-preview/react`) manages the preview lifecycle:

1. Detects preview mode, playground mode, and contextual editing mode from URL query parameters
2. Listens for `postMessage` events from the Uniform Canvas iframe (`uniform:composition:update`)
3. Provides the current preview state via the `usePreview()` hook so route loaders can decide whether to fetch published content or use the live preview composition

A playground route (`/uniform-playground` in the host) enables previewing Uniform Patterns (reusable component templates) within the app shell.

### Cross-MFE composition fetching

The subapp configures its composition API client to transform paths to strip its base path prefix:

```ts
// subapp/src/utils/uniform/composition.ts
const { fetchComposition, fetchCompositionById } = createCompositionApi({
  apiBase: 'http://localhost:5183',
  transformPath: (path) => path.replace('/subapp', '/'),
});
```

The subapp's Vite config also includes `allowedOrigins` to permit cross-origin requests from the host.

## Use the project

Install with pnpm from the root:

```sh
pnpm i
```

### Environment variables

You will need two Uniform projects, one for the host and one for the subapp.

Each app requires a `.env` file with Uniform credentials for it's project:

```
VITE_UNIFORM_PROJECT_ID=<your-project-id>
UNIFORM_PROJECT_ID=<your-project-id>
UNIFORM_API_KEY=<your-api-key>
UNIFORM_API_HOST=https://uniform.app
UNIFORM_EDGE_API_HOST=https://uniform.global
```

### Sync Uniform data into your Uniform Project

Push the latest component definitions and compositions to your Uniform project:

```sh
pnpm uniform:push
```

### Run all applications from the root:

```shell
pnpm dev
```

Or run each application separately.

The host starts at `http://localhost:5173`.

The subapp starts at `http://localhost:5183`. 
To use a different port, create a `.env.development.local` and override the `PORT` value.

## Known Limitations

### Uniform does not support nested compositions.

We get around this by using a `keepSingleSlot` util to render the header and footer slots above and below the Subapp's Outlet.

See: examples/modulefederation-tanstackrouter/host/src/routes/__root.tsx

```
-------------------------
| HOST:   Site Header   | <= UniformComposition
-------------------------
| SUBAPP: Page          | <= UniformComposition
-------------------------
| HOST:   Site Footer   | <= UniformComposition
-------------------------
```

### A page can only have a single Uniform Context

Only the host can include UniformContext in a page. All optimisations from MFEs will need to be synced with the host project using the CLI.

### Preview is no longer showing the current composition warning

The Canvas editor will show a warning when you are previewing a page from the Subapp in the host.
