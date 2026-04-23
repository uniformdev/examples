import { CSRF_HEADER_NAME, CSRF_HEADER_VALUE } from './csrf';

/**
 * Returns whether an httpOnly delegation cookie is already active (GET /api/status).
 */
export async function checkActive(): Promise<boolean> {
  const res = await fetch('/api/status');
  if (!res.ok) {
    return false;
  }
  const body = (await res.json()) as { status: string };
  return body.status === 'active';
}

/**
 * POSTs the one-time Mesh session token to /api/session so the server can exchange it and set the sealed cookie.
 * The custom `X-Mesh-Csrf` header is what our BFF uses to distinguish this call
 * from a cross-site CSRF attempt — see `lib/csrf.ts`.
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
