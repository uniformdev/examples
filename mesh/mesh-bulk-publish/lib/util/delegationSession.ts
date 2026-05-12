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

export function readMeshDelegationCookieFromRequest(req: NextApiRequest): string | undefined {
  return parseCookies(req.headers.cookie ?? '')[DELEGATION_COOKIE_NAME];
}

export async function unsealMeshDelegationSession(jwe: string): Promise<DelegationSession | null> {
  const secret = process.env.MESH_SESSION_SECRET;
  if (!secret) {
    // eslint-disable-next-line no-console
    console.error('MESH_SESSION_SECRET env variable is not set');
    return null;
  }
  return unsealDelegationSession(jwe, secret);
}

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
  }

  return session;
}

export type { DelegationSession };
