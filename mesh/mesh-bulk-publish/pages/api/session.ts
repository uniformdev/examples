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
 *     The token pair (access + refresh) is encrypted into a JWE cookie
 *     and sent back via Set-Cookie. The browser never sees the raw tokens.
 *
 *   Step 3 — Subsequent BFF API calls (/api/compositions, /api/publish):
 *     Each BFF route reads the httpOnly cookie, decrypts it, and uses the
 *     access token as `Authorization: Bearer <token>` when calling Uniform.
 *     The browser only ever calls your own Next.js routes — it never has
 *     a token it could use to call Uniform directly.
 *
 * SECURITY: Why exchange server-side?
 *   - The integration secret (UNIFORM_INTEGRATION_SECRET) must be presented
 *     to the token endpoint. It must never be sent to the browser.
 *   - The session token itself is single-use and very short-lived, but
 *     intercepting it mid-flight would still allow an attacker to perform
 *     the exchange. Doing the exchange server-side minimises this window.
 *   - DelegationTokenClient from @uniformdev/mesh-sdk wraps the token
 *     endpoint: POST /api/v1/token with grant_type=delegation_token.
 *   - The token endpoint as well as all Uniform APIs are not open for CORS,
 *     so you need backend anyway :)
 *
 * Body: { sessionToken: string }
 * Response: 200 { status: 'ok' } + Set-Cookie with sealed delegation session
 */
import { DelegationTokenClient } from '@uniformdev/mesh-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createCookieOptions, sealSession, serializeCookie } from '../../lib/cookieUtils';
import { requireCsrfHeader } from '../../lib/csrf';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!requireCsrfHeader(req, res)) {
    return;
  }

  const { sessionToken } = req.body as { sessionToken?: string };
  if (!sessionToken || typeof sessionToken !== 'string') {
    res.status(400).json({ error: 'sessionToken is required' });
    return;
  }

  const apiHost = process.env.UNIFORM_API_HOST!;

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
    integrationId: process.env.UNIFORM_INTEGRATION_ID!,
    integrationSecret: process.env.UNIFORM_INTEGRATION_SECRET!,
  });

  try {
    const token = await client.exchangeSessionToken(sessionToken);

    // Seal the token pair into an encrypted JWE cookie (see cookieUtils.ts for details).
    // The browser will send this cookie on every subsequent same-site request,
    // but cannot read its contents because it is HttpOnly + encrypted.
    const session = {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: Date.now() + token.expiresIn * 1000,
    };
    const sealed = await sealSession(session, process.env.MESH_SESSION_SECRET!);
    const cookieOpts = createCookieOptions();
    res.setHeader('Set-Cookie', serializeCookie(cookieOpts.name, sealed, cookieOpts));
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Token exchange failed' });
  }
}
