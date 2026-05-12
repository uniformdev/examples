import { CSRF_HEADER_NAME, CSRF_HEADER_VALUE } from '@uniformdev/mesh-identity-delegation-session';

export async function checkActive(): Promise<boolean> {
  const res = await fetch('/api/status');
  if (!res.ok) {
    return false;
  }
  const body = (await res.json()) as { status: string };
  return body.status === 'active';
}

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
