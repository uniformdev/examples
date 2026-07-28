import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM,
  IN_CONTEXT_EDITOR_PLAYGROUND_QUERY_STRING_PARAM,
  IN_CONTEXT_EDITOR_QUERY_STRING_PARAM,
  RouteClient,
  SECRET_QUERY_STRING_PARAM,
  isAllowedReferrer,
} from '@uniformdev/canvas';
import express from 'express';
import { join } from 'node:path';

import type { UniformRequestContext } from './uniform/manifest-source';
import { getUniformManifest, refreshUniformManifest } from './uniform/manifest.server';

// Load Uniform credentials (UNIFORM_PROJECT_ID / UNIFORM_API_KEY / UNIFORM_PREVIEW_SECRET)
// from .env. Existing environment variables take precedence.
try {
  process.loadEnvFile(join(process.cwd(), '.env'));
} catch {
  // File not found — rely on real environment variables.
}

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const first = (value: unknown): string | undefined =>
  Array.isArray(value) ? String(value[0]) : value == null ? undefined : String(value);

/** Route the Canvas editor loads to live-preview component/composition patterns. */
const PLAYGROUND_PATH = '/playground';

/**
 * Uniform preview endpoint (the Canvas editor's "Preview URL").
 *
 * Configure in Uniform project settings as:
 *   http://localhost:4200/api/preview?secret=<UNIFORM_PREVIEW_SECRET>
 *
 * Mirrors `createPreviewHandler` from `@uniformdev/canvas-next`: validates the preview
 * secret, then redirects to the composition's project map path with draft mode enabled
 * (`preview=<secret>`, consumed by `uniformRouteResolver`), preserving the
 * contextual-editing query params the editor appends.
 */
app.get('/api/preview', (req, res) => {
  // The Canvas editor probes the preview URL (no-cors / config check) to validate it.
  if (req.headers['sec-fetch-mode'] === 'no-cors') {
    res.status(204).end();
    return;
  }

  if (first(req.query[IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM]) === 'true') {
    res.json({ hasPlayground: true, isUsingCustomFullPathResolver: false });
    return;
  }

  const secret = process.env['UNIFORM_PREVIEW_SECRET'];
  const providedSecret = first(req.query[SECRET_QUERY_STRING_PARAM]);

  if (secret && providedSecret !== secret) {
    res.status(401).json({ message: 'Invalid preview secret' });
    return;
  }

  // Pattern previews render on the playground route; the pattern itself arrives over
  // the canvas channel (there is no path/slug for patterns).
  const isPlayground = first(req.query[IN_CONTEXT_EDITOR_PLAYGROUND_QUERY_STRING_PARAM]) === 'true';

  const targetPath = isPlayground
    ? PLAYGROUND_PATH
    : first(req.query['path']) || first(req.query['slug']);

  // Disallow open redirects: the target must be a local, same-origin path.
  const redirectUrl = targetPath ? new URL(targetPath, 'http://localhost') : undefined;

  if (!targetPath || !redirectUrl || redirectUrl.origin !== 'http://localhost') {
    res.status(400).json({ message: 'Could not resolve the full path of the preview page' });
    return;
  }

  const isContextualEditing =
    first(req.query[IN_CONTEXT_EDITOR_QUERY_STRING_PARAM]) === 'true' &&
    isAllowedReferrer(req.headers.referer);

  const omitted = new Set([SECRET_QUERY_STRING_PARAM, 'path', 'slug', 'id', 'locale']);

  for (const [name, value] of Object.entries(req.query)) {
    if (omitted.has(name)) {
      continue;
    }

    for (const single of Array.isArray(value) ? value : [value]) {
      if (typeof single === 'string') {
        redirectUrl.searchParams.append(name, single);
      }
    }
  }

  // Only keep the editor query params when the request genuinely comes from the editor.
  if (!isContextualEditing) {
    redirectUrl.searchParams.delete(IN_CONTEXT_EDITOR_QUERY_STRING_PARAM);
    redirectUrl.searchParams.delete(IN_CONTEXT_EDITOR_PLAYGROUND_QUERY_STRING_PARAM);
  }

  // Enables draft-state fetching in `uniformRouteResolver` (validated against the secret there).
  redirectUrl.searchParams.set('preview', providedSecret ?? 'true');

  res.redirect(redirectUrl.pathname + redirectUrl.search);
});

/**
 * Resolves a Uniform route on behalf of the browser (client-side navigations).
 * Keeps the API key server-side: `uniformRouteResolver` calls this endpoint when it
 * runs in the browser without credentials in the bundle. Draft state requires the
 * preview secret, same as SSR.
 */
app.get('/api/uniform-route', async (req, res) => {
  const projectId = process.env['UNIFORM_PROJECT_ID'];
  const apiKey = process.env['UNIFORM_API_KEY'];

  if (!projectId || !apiKey) {
    // Signals local demo mode to the resolver.
    res.status(404).json({ message: 'Uniform credentials are not configured' });
    return;
  }

  const path = first(req.query['path']);

  if (!path || !path.startsWith('/')) {
    res.status(400).json({ message: 'A local `path` query parameter is required' });
    return;
  }

  const secret = process.env['UNIFORM_PREVIEW_SECRET'];
  const previewParam = first(req.query['preview']);
  const isPreview = previewParam
    ? secret
      ? previewParam === secret
      : previewParam === 'true'
    : false;

  try {
    const client = new RouteClient({ projectId, apiKey, disableSWR: true });
    const route = await client.getRoute({
      path,
      state: isPreview ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
      locale: first(req.query['locale']) || 'en-US',
    });

    res.json(route);
  } catch (error) {
    console.error('[demo] Failed to resolve Uniform route', error);
    res.status(502).json({ message: 'Failed to resolve the Uniform route' });
  }
});

/**
 * Authorizes manifest-refresh requests (the `manifest.published` webhook and the
 * toolbar's manual refresh).
 *
 * Mirrors `createPreviewPOSTRouteHandler` from `@uniformdev/next-app-router`: the shared
 * secret is required when one is configured, and when neither secret is set the request
 * is allowed with a warning so local development works out of the box.
 */
function isManifestRefreshAuthorized(req: express.Request): boolean {
  const secret = process.env['UNIFORM_WEBHOOK_SECRET'] || process.env['UNIFORM_PREVIEW_SECRET'];

  if (!secret) {
    console.warn(
      '[demo] Neither UNIFORM_WEBHOOK_SECRET nor UNIFORM_PREVIEW_SECRET is set; ' +
        'the manifest refresh endpoint is unauthenticated.'
    );
    return true;
  }

  return (
    first(req.query[SECRET_QUERY_STRING_PARAM]) === secret ||
    req.headers['x-uniform-secret'] === secret
  );
}

/**
 * Current Context manifest the server renders with.
 *
 * The browser polls this to notice that a newer manifest has been published: the
 * `revision` it booted with is in the SSR TransferState, so a differing revision here
 * means a reload will pick up fresh signals/enrichments.
 */
app.get('/api/uniform-manifest', async (req, res) => {
  const { manifest, ...meta } = await getUniformManifest();

  // `?meta=true` keeps the polling payload to a few bytes; the manifest itself is only
  // needed when inspecting what the server is actually rendering with.
  res.json(first(req.query['meta']) === 'true' ? meta : { ...meta, manifest });
});

/**
 * Uniform webhook receiver. Configure in Uniform project settings as:
 *   http://localhost:4200/api/uniform-webhook?secret=<UNIFORM_WEBHOOK_SECRET>
 *
 * A `manifest.published` event drops the cached manifest and refetches it immediately
 * (bypassing Uniform's edge cache), so the next render personalizes against the
 * just-published signals and enrichments without restarting the app. This is the
 * Express counterpart of `revalidateTag('manifest')` in the Next.js App Router SDK.
 */
app.post('/api/uniform-webhook', express.json(), async (req, res) => {
  if (!isManifestRefreshAuthorized(req)) {
    res.status(401).json({ message: 'The request could not be validated.' });
    return;
  }

  // Uniform sends the event name as `type`; the webhook payload schema calls it `eventType`.
  const body: unknown = req.body;
  const event =
    body && typeof body === 'object'
      ? ((body as Record<string, unknown>)['type'] ??
        (body as Record<string, unknown>)['eventType'])
      : undefined;

  if (event !== 'manifest.published') {
    res.json({ handled: false, event });
    return;
  }

  const { snapshot, changed } = await refreshUniformManifest();

  console.log(
    `[demo] manifest.published: reloaded the Context manifest (revision ${snapshot.revision}, ${changed ? 'changed' : 'unchanged'})`
  );

  res.json({ handled: true, event, revision: snapshot.revision, changed });
});

/** Manual equivalent of the webhook, for local development and the debug toolbar. */
app.post('/api/uniform-manifest/refresh', async (req, res) => {
  if (!isManifestRefreshAuthorized(req)) {
    res.status(401).json({ message: 'The request could not be validated.' });
    return;
  }

  const { snapshot, changed } = await refreshUniformManifest();

  res.json({ revision: snapshot.revision, source: snapshot.source, changed });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 *
 * The live Context manifest rides along as the request context, where
 * `resolveUniformManifest()` picks it up to build this request's Context (and passes it
 * to the browser via TransferState).
 */
app.use((req, res, next) => {
  getUniformManifest()
    .then((snapshot) => {
      const requestContext: UniformRequestContext = {
        uniformManifest: snapshot.manifest,
        uniformManifestRevision: snapshot.revision,
      };

      return angularApp.handle(req, requestContext);
    })
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  // express 4 style (no error argument) — matches the Spartacus storefront's express major.
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
