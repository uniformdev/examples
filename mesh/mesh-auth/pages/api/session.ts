/**
 * POST /api/session
 *
 * THE DELEGATION FLOW — STEP 2 OF 3
 * -----------------------------------
 * This endpoint is the server-side half of the identity delegation handshake.
 * Here is the full three-step flow so you understand where this fits:
 *
 *   Step 1 — Frontend (browser, inside Mesh iframe):
 *     The DelegationProvider calls `sdk.getSessionToken()`. This is a
 *     postMessage call to the Uniform dashboard parent frame. The dashboard
 *     responds with a short-lived, one-time-use session token that proves
 *     the current user's identity without exposing their credentials.
 *     The token is scoped to this integration and expires in seconds.
 *
 *   Step 2 — THIS FILE (Next.js API route, runs on your server):
 *     The browser POSTs the session token here. Your server exchanges it
 *     for a delegation token using your integration secret, which NEVER
 *     leaves the server. The delegation token is a Bearer token that can
 *     call Uniform APIs on behalf of the user.
 *     The access token is encrypted into a JWE cookie and sent back via
 *     Set-Cookie. The browser never sees the raw token.
 *
 *   Step 3 — Subsequent BFF API calls (e.g. `/api/composition`):
 *     Each BFF route reads the httpOnly cookie, decrypts it, and uses the
 *     access token as `Authorization: Bearer <token>` when calling Uniform.
 *     The browser only ever calls your own Next.js routes — it never has
 *     a token it could use to call Uniform directly.
 *     When the access token expires, the BFF clears the cookie and returns
 *     401 with `code: 'delegation_expired'`. `useDelegationFetch` (or
 *     `reacquire()`) obtains a new Mesh session token and repeats step 1–2
 *     (this demo does not use refresh tokens).
 *
 * SECURITY: Why exchange server-side?
 *   - The integration secret (UNIFORM_INTEGRATION_SECRET) must be presented
 *     to the token endpoint. It must never be sent to the browser.
 *   - The session token is very short-lived (10s TTL) but is bearer-replayable
 *     within that window.
 *     Intercepting it mid-flight allows an attacker to perform the exchange
 *     within ~10 seconds. Doing the exchange server-side with ID+Secret second leg security check minimises this security hole.
 *   - DelegationTokenClient from @uniformdev/mesh-sdk/server wraps the token
 *     endpoint: POST /api/v1/token with grantType=delegation_token.
 *   - The token endpoint as well as all Uniform APIs are not open for CORS,
 *     so you need backend anyway :)
 *
 * Body: { sessionToken: string }
 * Response: 200 { status: 'ok' } + Set-Cookie with sealed delegation session
 */
import {
  DELEGATION_COOKIE_NAME,
  sealDelegationSession,
  serializeSessionCookie,
} from '@uniformdev/mesh-sdk/server';
import type { NextApiRequest, NextApiResponse } from 'next';

import { requireMeshCsrf } from '../../lib/util/csrf';
import { getDelegationTokenClient } from '../../lib/util/getDelegationTokenClient';

if (!process.env.MESH_SESSION_SECRET) {
  throw new Error('MESH_SESSION_SECRET is not set');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!requireMeshCsrf(req, res)) {
    return;
  }

  const { sessionToken } = req.body as { sessionToken?: string };
  if (!sessionToken || typeof sessionToken !== 'string') {
    res.status(400).json({ error: 'sessionToken is required' });
    return;
  }

  try {
    const token = await getDelegationTokenClient().exchangeSessionToken(sessionToken);

    // Seal the access token into an encrypted JWE cookie. The browser will
    // send this cookie on every subsequent same-site request but cannot
    // read its contents because it is HttpOnly + encrypted.
    const session = {
      accessToken: token.accessToken,
      refreshToken: undefined,
      expiresAt: Date.now() + token.expiresIn * 1000,
    };
    const sealed = await sealDelegationSession(session, process.env.MESH_SESSION_SECRET!);
    res.setHeader('Set-Cookie', serializeSessionCookie(DELEGATION_COOKIE_NAME, sealed));
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Error exchanging session token', err);
    res.status(500).json({ error: 'Token exchange failed' });
  }
}
