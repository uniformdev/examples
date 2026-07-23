import { CSRF_HEADER_NAME, CSRF_HEADER_VALUE } from '@uniformdev/mesh-sdk';

/**
 * Returns whether an httpOnly delegation cookie is already active (GET /api/status).
 */
export async function checkActive(): Promise<boolean> {
  const res = await fetch('/api/status', {
    headers: {
      [CSRF_HEADER_NAME]: CSRF_HEADER_VALUE,
    },
  });
  if (!res.ok) {
    return false;
  }
  const body = (await res.json()) as { status: string };
  return body.status === 'active';
}

/**
 * POSTs the one-time Mesh session token to /api/session so the server can exchange it and set the sealed cookie.
 *
 * Sends `X-Mesh-Csrf` on every BFF call. The value is a fixed constant (`"1"`), not a per-user secret —
 * it only helps because browsers cannot attach custom headers on cross-origin requests without a CORS
 * preflight, and these routes are not CORS-open. Do not enable permissive CORS on guarded BFF routes.
 * See `lib/util/csrf.ts` (`verifyCsrf` from `@uniformdev/mesh-sdk/server`).
 */
export async function onSessionToken(sessionToken: string): Promise<void> {
  const res = await fetch('/api/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [CSRF_HEADER_NAME]: CSRF_HEADER_VALUE,
    },
    body: JSON.stringify({ sessionToken }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let detail = text;
    try {
      detail = (JSON.parse(text) as { error?: string }).error ?? text;
    } catch {
      /* not JSON */
    }
    throw new Error(detail || `Session exchange failed (${res.status})`);
  }
}
