import {
  DELEGATION_COOKIE_NAME,
  sealDelegationSession,
  serializeSessionCookie,
} from '@uniformdev/mesh-identity-delegation-session';
import { DelegationTokenClient } from '@uniformdev/mesh-sdk';

import { requireMeshCsrf } from '../csrf.js';

export async function postApiSession(req, res) {
  if (!requireMeshCsrf(req, res)) {
    return;
  }

  const { sessionToken } = req.body ?? {};
  if (!sessionToken || typeof sessionToken !== 'string') {
    res.status(400).json({ error: 'sessionToken is required' });
    return;
  }

  const apiHost = process.env.UNIFORM_API_HOST;

  /**
   * DelegationTokenClient is a thin server-side client from @uniformdev/mesh-sdk.
   * It calls POST /api/v1/token on the Uniform API with:
   *   - grant_type: 'delegation_token'
   *   - sessionToken: the one-time token from the browser
   *   - integrationId + integrationSecret: your integration credentials
   *
   * It returns { accessToken, refreshToken, expiresIn, tokenType: 'Bearer' }.
   * The integration secret is ONLY used here — it never goes to the browser.
   */
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
    const sealed = await sealDelegationSession(session, process.env.MESH_SESSION_SECRET);
    res.setHeader('Set-Cookie', serializeSessionCookie(DELEGATION_COOKIE_NAME, sealed));
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Token exchange failed' });
  }
}
