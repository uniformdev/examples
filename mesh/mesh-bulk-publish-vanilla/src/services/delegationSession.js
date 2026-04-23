/**
 * Shared delegation cookie handling: parse, unseal, and proactive access-token refresh
 * (used by BFF routes that call Uniform APIs with the user's Bearer token).
 */
import { DelegationTokenClient } from '@uniformdev/mesh-sdk';

import {
  COOKIE_NAME,
  createCookieOptions,
  needsRefresh,
  parseCookies,
  sealSession,
  serializeCookie,
  unsealSession,
} from '../cookieUtils.js';

/**
 * @typedef {{ accessToken: string; refreshToken: string | undefined; expiresAt: number }} DelegationSession
 */

/**
 * Reads the sealed cookie and returns a session without calling the token endpoint.
 * Use for read-only checks (e.g. GET /api/status).
 *
 * @param {string | undefined} cookieHeader
 * @returns {Promise<DelegationSession | null>}
 */
export async function readDelegationSessionWithoutRefresh(cookieHeader) {
  const meshSecret = process.env.MESH_SESSION_SECRET;
  const cookie = parseCookies(cookieHeader ?? '')[COOKIE_NAME];
  if (!cookie) {
    return null;
  }
  return unsealSession(cookie, meshSecret);
}

/**
 * Resolves a usable delegation session for upstream Uniform API calls: unseals the cookie,
 * refreshes the token pair when {@link needsRefresh}, and returns a `Set-Cookie` value when rotated.
 *
 * @param {string | undefined} cookieHeader
 * @returns {Promise<
 *   | { ok: true; session: DelegationSession; setCookieHeader?: string }
 *   | { ok: false; status: number; error: string }
 * >}
 */
export async function resolveDelegationSession(cookieHeader) {
  const meshSecret = process.env.MESH_SESSION_SECRET;
  const apiHost = process.env.UNIFORM_API_HOST;

  const cookie = parseCookies(cookieHeader ?? '')[COOKIE_NAME];
  if (!cookie) {
    return { ok: false, status: 401, error: 'No delegation session' };
  }

  let session = await unsealSession(cookie, meshSecret);
  if (!session) {
    return { ok: false, status: 401, error: 'Invalid delegation session' };
  }

  let setCookieHeader;

  if (needsRefresh(session)) {
    // Dashboard did not give consent for refreshing the token
    if (!session.refreshToken) {
      return { ok: false, status: 401, error: 'No refresh token' };
    }

    const client = new DelegationTokenClient({
      apiHost,
      integrationId: process.env.UNIFORM_INTEGRATION_ID,
      integrationSecret: process.env.UNIFORM_INTEGRATION_SECRET,
    });
    const refreshed = await client.refreshDelegationToken(session.refreshToken);
    session = {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      expiresAt: Date.now() + refreshed.expiresIn * 1000,
    };
    const sealed = await sealSession(session, meshSecret);
    const cookieOpts = createCookieOptions();
    setCookieHeader = serializeCookie(cookieOpts.name, sealed, cookieOpts);
  }

  return { ok: true, session, setCookieHeader };
}
