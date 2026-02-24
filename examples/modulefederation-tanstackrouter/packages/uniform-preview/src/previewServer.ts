import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  CanvasClient,
  IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM,
  IN_CONTEXT_EDITOR_PLAYGROUND_QUERY_STRING_PARAM,
  RouteClient,
  SECRET_QUERY_STRING_PARAM,
} from '@uniformdev/canvas';

export interface UniformServerOptions {
  projectId: string;
  apiKey: string;
  apiHost?: string;
  edgeApiHost?: string;
  playgroundPath?: string;
  /** Additional origins allowed for CORS (beyond Uniform defaults) */
  allowedOrigins?: string[];
}

// Uniform Canvas origins that are always allowed
const UNIFORM_ORIGINS = [
  'https://uniform.app',
  'https://eu.uniform.app',
  'https://app.uniform.app',
  'https://eu-app.uniform.app',
];

function isAllowedOrigin(origin: string | undefined, extraOrigins: string[]): boolean {
  if (!origin) return false;
  if (UNIFORM_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.uniform.app')) return true;
  if (extraOrigins.includes(origin)) return true;
  return false;
}

function setCorsHeaders(req: IncomingMessage, res: ServerResponse, allowedOrigins: string[]) {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(origin, allowedOrigins)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function setSecurityHeaders(res: ServerResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer-Policy intentionally omitted — this middleware only runs in the
  // Vite dev server (configureServer) where localhost would conflict with
  // Uniform Canvas iframe referrer validation. Production deployments should
  // set Referrer-Policy: no-referrer-when-downgrade at the hosting layer.
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

/**
 * Vite dev server middleware for Uniform.
 *
 * Handles:
 * - /api/preview — Canvas contextual editing redirect
 * - /api/composition — fetch composition by path
 * - /api/composition-by-id — fetch composition by ID
 *
 * Includes CORS support for Uniform Canvas origins and
 * configurable additional origins (e.g. for cross-MFE requests).
 */
export function setupUniformServer(server: ViteDevServer, options: UniformServerOptions) {
  const {
    projectId,
    apiKey,
    apiHost = 'https://uniform.app',
    edgeApiHost = 'https://uniform.global',
    playgroundPath,
    allowedOrigins = [],
  } = options;

  // CORS preflight handler for all /api/ routes
  server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!req.url?.startsWith('/api/')) {
      return next();
    }

    setCorsHeaders(req, res, allowedOrigins);
    setSecurityHeaders(res);

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    next();
  });

  // Preview handler
  server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!req.url?.startsWith('/api/preview')) {
      return next();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    const isConfigCheck = url.searchParams.get(IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM) === 'true';
    if (isConfigCheck) {
      sendJson(res, 200, {
        hasPlayground: Boolean(playgroundPath),
        isUsingCustomFullPathResolver: false,
      });
      return;
    }

    if (req.headers['sec-fetch-mode'] === 'no-cors') {
      res.statusCode = 204;
      res.end();
      return;
    }

    const isPlayground = url.searchParams.get(IN_CONTEXT_EDITOR_PLAYGROUND_QUERY_STRING_PARAM) === 'true';
    let targetPath: string;

    if (isPlayground && playgroundPath) {
      targetPath = playgroundPath;
    } else {
      targetPath = url.searchParams.get('path') || url.searchParams.get('slug') || '/';
    }

    const redirectUrl = new URL(targetPath, url.origin);
    const compositionId = url.searchParams.get('id');

    url.searchParams.forEach((value, key) => {
      if (key === SECRET_QUERY_STRING_PARAM) return;
      if (key === 'id' && compositionId) {
        redirectUrl.searchParams.set('compositionId', compositionId);
        return;
      }
      if (['path', 'slug', 'locale'].includes(key)) return;
      redirectUrl.searchParams.set(key, value);
    });

    redirectUrl.searchParams.set('preview', 'true');

    res.statusCode = 307;
    res.setHeader('Location', `${redirectUrl.pathname}${redirectUrl.search}`);
    res.end();
  });

  // Composition by path
  server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!req.url?.startsWith('/api/composition?')) {
      return next();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.searchParams.get('path') || '/';

    try {
      console.log(`Getting route for project: ${projectId} and path: ${path}`)
      const client = new RouteClient({ projectId, apiKey, edgeApiHost });
      const response = await client.getRoute({ path });

      if (response.type === 'composition') {
        sendJson(res, 200, response.compositionApiResponse.composition);
      } else {
        sendJson(res, 404, { error: 'No composition found for path' });
      }
    } catch (err) {
      console.error('Failed to fetch composition by path', err);
      sendJson(res, 500, { error: 'Failed to fetch composition' });
    }
  });

  // Composition by ID
  server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!req.url?.startsWith('/api/composition-by-id?')) {
      return next();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const compositionId = url.searchParams.get('compositionId');
    const state = url.searchParams.get('state') === 'draft' ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE;

    if (!compositionId) {
      sendJson(res, 400, { error: 'compositionId query parameter is required' });
      return;
    }

    try {
      const client = new CanvasClient({ projectId, apiKey, apiHost, edgeApiHost });
      const { composition } = await client.getCompositionById({ compositionId, state });

      if (composition) {
        sendJson(res, 200, composition);
      } else {
        sendJson(res, 404, { error: 'Composition not found' });
      }
    } catch (err) {
      console.error('Failed to fetch composition by ID', err);
      sendJson(res, 500, { error: 'Failed to fetch composition' });
    }
  });
}
