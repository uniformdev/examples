/**
 * POST /api/session — exchange one-time session token for sealed delegation cookie.
 */
import { DelegationTokenClient } from '@uniformdev/mesh-sdk';

import { createCookieOptions, sealSession, serializeCookie } from '../cookieUtils.js';

export async function postApiSession(req, res) {
  const { sessionToken } = req.body ?? {};
  if (!sessionToken || typeof sessionToken !== 'string') {
    res.status(400).json({ error: 'sessionToken is required' });
    return;
  }

  const apiHost = process.env.UNIFORM_API_HOST;

  const client = new DelegationTokenClient({
    apiHost,
    integrationId: process.env.UNIFORM_INTEGRATION_ID,
    integrationSecret: process.env.UNIFORM_INTEGRATION_SECRET,
  });

  try {
    const token = await client.exchangeSessionToken(sessionToken);

    const session = {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: Date.now() + token.expiresIn * 1000,
    };
    const sealed = await sealSession(session, process.env.MESH_SESSION_SECRET);
    const cookieOpts = createCookieOptions(apiHost);
    res.setHeader('Set-Cookie', serializeCookie(cookieOpts.name, sealed, cookieOpts));
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Token exchange failed' });
  }
}
