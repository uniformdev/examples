# Angular Starter for Uniform

Standalone Angular 21 SSR app that consumes the published Uniform Angular packages
from npm:

- `@uniformdev/context-angular`
- `@uniformdev/canvas-angular`

## Setup

```bash
cd examples/angular-starter
cp .env.example .env   # fill UNIFORM_PROJECT_ID / UNIFORM_API_KEY / UNIFORM_PREVIEW_SECRET
npm install
npm start              # http://localhost:4200
```

Without credentials the app serves the bundled sample composition (offline mode).

### SSR production build

```bash
npm run build
npm run serve:ssr
```

### Refresh the Context manifest

```bash
npm run manifest:pull
```

## Canvas preview URL

In Uniform project settings:

```
http://localhost:4200/api/preview?secret=<UNIFORM_PREVIEW_SECRET>
```

## Notes

- Personalization and A/B testing are SSR'd (no prerender) so variants don't flash.
- The in-page Context inspector (`@uniformdev/context-angular-devtools`) is not wired
  here yet — that package is not on npm. Use the Uniform Context Chrome extension
  (`enableContextDevTools()` is already enabled) instead.
