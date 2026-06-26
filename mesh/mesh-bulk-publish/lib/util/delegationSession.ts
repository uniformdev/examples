import {
  DELEGATION_COOKIE_NAME,
  type DelegationSession,
  needsRefresh,
  parseCookies,
  sealDelegationSession,
  serializeSessionCookie,
  unsealDelegationSession,
} from '@uniformdev/mesh-identity-delegation-session';
import { DelegationTokenClient } from '@uniformdev/mesh-sdk';
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
 * Loads a usable delegation session for BFF routes: reads the httpOnly cookie, decrypts it,
 * proactively refreshes the token pair when it is close to expiry, and sets `Set-Cookie` on
 * the response when a refresh occurs. Returns null when there is no valid session.
 */
export async function loadMeshDelegationSession(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<DelegationSession | null> {
  const jwe = readMeshDelegationCookieFromRequest(req);
  if (!jwe) {
    return null;
  }

  let session = await unsealMeshDelegationSession(jwe);
  if (!session) {
    return null;
  }

  if (needsRefresh(session)) {
    if (!session.refreshToken) {
      return null;
    }

    const apiHost = process.env.UNIFORM_API_HOST!;
    const sessionSecret = process.env.MESH_SESSION_SECRET!;

    try {
      const client = new DelegationTokenClient({
        apiHost,
        integrationId: process.env.UNIFORM_INTEGRATION_ID!,
        integrationSecret: process.env.UNIFORM_INTEGRATION_SECRET!,
      });
      const refreshed = await client.refreshDelegationToken(session.refreshToken);
      session = {
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        expiresAt: Date.now() + refreshed.expiresIn * 1000,
      };
      const sealed = await sealDelegationSession(session, sessionSecret);
      res.setHeader('Set-Cookie', serializeSessionCookie(DELEGATION_COOKIE_NAME, sealed));
    } catch (err) {
      // Refresh can fail during key rotation, revocation, or transient API errors.
      // Clear the stale cookie so the client falls back to session-token exchange.
      console.error('Delegation token refresh failed', err);
      clearMeshDelegationSessionCookie(res);
      return null;
    }
  }

  return session;
}

export type { DelegationSession };
