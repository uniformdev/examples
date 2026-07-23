import {
  DELEGATION_COOKIE_NAME,
  type DelegationSession,
  needsRefresh,
  parseCookies,
  serializeSessionCookie,
  unsealDelegationSession,
} from '@uniformdev/mesh-sdk/server';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Returns the raw JWE string stored in the mesh delegation cookie on the request, if present.
 */
export function readMeshDelegationCookieFromRequest(req: NextApiRequest): string | undefined {
  return parseCookies(req.headers.cookie)[DELEGATION_COOKIE_NAME];
}

/**
 * Decrypts a mesh delegation session JWE using `MESH_SESSION_SECRET`.
 * Returns null when the cookie is missing, malformed, or uses the wrong secret.
 */
export async function unsealMeshDelegationSession(jwe: string): Promise<DelegationSession | null> {
  const secret = process.env.MESH_SESSION_SECRET;
  if (!secret) {
    // eslint-disable-next-line no-console
    console.error('MESH_SESSION_SECRET env variable is not set');
    return null;
  }
  return unsealDelegationSession(jwe, secret);
}

/**
 * Clears the mesh delegation session cookie so callers fall back to session-token exchange.
 */
export function clearMeshDelegationSessionCookie(res: NextApiResponse): void {
  res.setHeader('Set-Cookie', serializeSessionCookie(DELEGATION_COOKIE_NAME, '', { maxAge: 0 }));
}

/**
 * Loads a usable delegation session for BFF routes: reads the httpOnly cookie and decrypts it.
 * When the access token is expired or close to expiry, clears the cookie and returns null so
 * `DelegationProvider` re-exchanges a fresh Mesh session token via `onSessionToken`.
 */
export async function loadMeshDelegationSession(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<DelegationSession | null> {
  const jwe = readMeshDelegationCookieFromRequest(req);
  if (!jwe) {
    return null;
  }

  const session = await unsealMeshDelegationSession(jwe);
  if (!session) {
    return null;
  }

  if (needsRefresh(session)) {
    clearMeshDelegationSessionCookie(res);
    return null;
  }

  return session;
}

export type { DelegationSession };
