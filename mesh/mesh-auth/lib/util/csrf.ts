import { type CsrfResult, verifyCsrf } from '@uniformdev/mesh-sdk/server';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Origins permitted to call state-changing BFF routes. Read from
 * `MESH_ALLOWED_ORIGINS` (comma-separated) at module load so a typo or a
 * forgotten env var crashes loudly during the first request rather than
 * silently allowing every origin.
 *
 * The package itself never reads `process.env`; the boot-time wiring lives
 * here so the BFF owns its allow-list explicitly.
 */
function readAllowedOrigins(): readonly string[] {
  const raw = process.env.MESH_ALLOWED_ORIGINS;
  if (!raw || raw.trim().length === 0) {
    throw new Error('MESH_ALLOWED_ORIGINS env variable must be set (comma-separated origin list)');
  }
  const origins = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (origins.length === 0) {
    throw new Error('MESH_ALLOWED_ORIGINS env variable must be set (comma-separated origin list)');
  }

  if (origins.some((origin) => !origin.startsWith('https://'))) {
    throw new Error('MESH_ALLOWED_ORIGINS env variable must be HTTPS');
  }

  return origins;
}

const ALLOWED_ORIGINS = readAllowedOrigins();

function firstHeader(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/**
 * Guards a state-changing BFF route by checking Origin/Referer against the
 * `MESH_ALLOWED_ORIGINS` list AND the custom `x-mesh-csrf` header.
 *
 * **The `X-Mesh-Csrf` value is not a secret** — it is a constant (`"1"`). Defense relies on
 * browsers refusing to set non–safelisted headers on cross-origin requests without a CORS
 * preflight. These BFF routes must stay same-origin / non–CORS-open; adding permissive CORS
 * would let attackers satisfy the header check and destroy this layer of protection.
 */
export function requireMeshCsrf(req: NextApiRequest, res: NextApiResponse): boolean {
  const result: CsrfResult = verifyCsrf(
    {
      origin: firstHeader(req.headers.origin),
      referer: firstHeader(req.headers.referer),
      secFetchSite: firstHeader(req.headers['sec-fetch-site']),
      customHeader: firstHeader(req.headers['x-mesh-csrf']),
    },
    {
      allowedOrigins: ALLOWED_ORIGINS,
      /**
       * Dev-only: Chromium often omits `Origin` on `https://localhost` iframe
       * subresource requests (https://issues.chromium.org/issues/40499674).
       */
      skipOriginValidation: process.env.NODE_ENV === 'development',
    }
  );
  if (!result.ok) {
    // eslint-disable-next-line no-console
    console.error('CSRF check failed', { reason: result.reason });
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  return true;
}
