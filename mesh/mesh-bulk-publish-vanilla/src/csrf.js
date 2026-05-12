import {
  CSRF_HEADER_NAME,
  CSRF_HEADER_VALUE,
  verifyCsrf,
} from '@uniformdev/mesh-identity-delegation-session';

function readAllowedOrigins() {
  const raw = process.env.MESH_ALLOWED_ORIGINS;
  if (!raw || raw.trim().length === 0) {
    throw new Error('MESH_ALLOWED_ORIGINS env variable must be set (comma-separated origin list)');
  }
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

const ALLOWED_ORIGINS = readAllowedOrigins();

function firstHeader(value) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export function requireMeshCsrf(req, res) {
  const result = verifyCsrf(
    {
      origin: firstHeader(req.headers.origin),
      referer: firstHeader(req.headers.referer),
      secFetchSite: firstHeader(req.headers['sec-fetch-site']),
      customHeader: firstHeader(req.headers[CSRF_HEADER_NAME]),
    },
    { allowedOrigins: ALLOWED_ORIGINS }
  );

  if (!result.ok) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }

  return true;
}

export { CSRF_HEADER_NAME, CSRF_HEADER_VALUE };
