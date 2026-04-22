import { DelegationTokenClient } from '@uniformdev/mesh-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  COOKIE_NAME,
  createCookieOptions,
  type DelegationSession,
  needsRefresh,
  parseCookies,
  sealSession,
  serializeCookie,
  unsealSession,
} from '../cookieUtils';

/**
 * Returns the raw JWE string stored in the mesh delegation cookie on the request, if present.
 */
export function readMeshDelegationCookieFromRequest(req: NextApiRequest): string | undefined {
  return parseCookies(req.headers.cookie ?? '')[COOKIE_NAME];
}

/**
 * Decrypts a mesh delegation session JWE using `MESH_SESSION_SECRET`.
 * Returns null when the cookie is missing, malformed, or uses the wrong secret.
 */
export async function unsealMeshDelegationSession(jwe: string): Promise<DelegationSession | null> {
  const secret = process.env.MESH_SESSION_SECRET;
  if (!secret) {
    return null;
  }
  return unsealSession(jwe, secret);
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

  const apiHost = process.env.UNIFORM_API_HOST!;
  const sessionSecret = process.env.MESH_SESSION_SECRET!;

  if (needsRefresh(session)) {
    // Dashboard did not give consent for refreshing the token
    if (!session.refreshToken) {
      return null;
    }

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
    const sealed = await sealSession(session, sessionSecret);
    const cookieOpts = createCookieOptions(apiHost);
    res.setHeader('Set-Cookie', serializeCookie(cookieOpts.name, sealed, cookieOpts));
  }

  return session;
}

export type { DelegationSession };
