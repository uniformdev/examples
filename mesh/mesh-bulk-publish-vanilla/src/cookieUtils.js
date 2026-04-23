/**
 * cookieUtils.js — Session cookie helpers for identity delegation.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The Uniform identity delegation flow issues short-lived access tokens and
 * long-lived refresh tokens. These need to be stored somewhere after the
 * initial exchange. We use a server-sealed httpOnly cookie so:
 *
 *   1. The tokens NEVER reach JavaScript in the browser — the cookie is
 *      marked HttpOnly, so `document.cookie` cannot read it.
 *   2. The raw tokens never appear in API responses — the browser only
 *      receives an opaque encrypted blob via Set-Cookie.
 *
 * COOKIE CONTEXT: WE LIVE IN AN IFRAME
 * ------------------------------------
 * This app is embedded inside the Uniform dashboard as a Mesh iframe. From
 * the browser's point of view every request our JS makes to our own backend
 * is a CROSS-SITE subresource request (top-level site = uniform.app, request
 * site = our host). That changes what cookie flags make sense:
 *
 *   - SameSite=Lax would be stored but NEVER returned on our own fetches
 *     from inside the iframe (Chrome warns about this explicitly). So we
 *     must use `SameSite=None` to get the cookie attached at all.
 *   - `SameSite=None` requires `Secure`, so the cookie only flows over
 *     HTTPS. Plain-HTTP localhost is no longer supported — run dev with
 *     HTTPS enabled (set HTTPS=1 and optionally provide HTTPS_KEY/HTTPS_CERT).
 *   - `Partitioned` is ALWAYS emitted — it opts us into CHIPS (Cookies
 *     Having Independent Partitioned State). The cookie is keyed to BOTH
 *     our origin AND the embedding top-level site, which (a) survives
 *     Chrome's third-party cookie phase-out and (b) gives us isolation per
 *     embedding host even in scenarios where the browser would otherwise
 *     treat us as first-party (e.g. local dev with dashboard on
 *     localhost:3000 and this app on localhost:9003 — same site by the
 *     registrable-domain rules, but we still want per-host sessions).
 *
 * CSRF PROTECTION
 * ---------------
 * Switching to `SameSite=None` gives up the free CSRF protection that Lax
 * provides. We compensate with a custom request header check — see
 * `csrf.js` and `requireCsrfHeader`. State-changing routes
 * (POST /api/session, POST /api/publish, …) require that header; a browser
 * will not attach it on a cross-origin request without a CORS preflight, so
 * third-party pages cannot forge these calls.
 *
 * COOKIE SEALING: JWE, NOT JWT
 * -----------------------------
 * We use JSON Web Encryption (JWE) via the `jose` library, NOT a plain
 * signed JWT. The difference matters:
 *
 *   - JWT (signed): payload is Base64-encoded and readable by anyone.
 *     The signature only proves authenticity, not confidentiality.
 *   - JWE (encrypted): payload is AES-256-GCM encrypted. Without the
 *     server secret, the tokens inside are completely opaque.
 *
 * This means even if someone extracts the raw cookie value (e.g. from
 * server logs, a CDN cache, or a cookie-stealing attack), they cannot
 * read or reuse the access/refresh tokens without the server secret.
 *
 * KEY DERIVATION
 * --------------
 * AES-256-GCM requires exactly 32 bytes. Rather than demanding a
 * precisely-sized secret from the operator, we hash the secret string
 * with SHA-256. This also means a longer passphrase doesn't silently
 * truncate — every byte of the secret influences the key.
 *
 * TOKEN LIFETIME
 * --------------
 * The cookie TTL (SESSION_TTL_SECONDS = 8h) matches the refresh token
 * lifetime. After 8 hours the cookie expires and the user must
 * re-authenticate by presenting a new session token to /api/session.
 *
 * The access token itself is much shorter-lived (typically 15–60 min).
 * BFF routes check needsRefresh() before every Uniform API call and
 * silently rotate the token pair when within REFRESH_BUFFER_MS of expiry,
 * writing a new sealed cookie in the same response.
 */

import { EncryptJWT, jwtDecrypt } from 'jose';

export const COOKIE_NAME = '__mesh_delegation';
const COOKIE_PATH = '/';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

/**
 * How far before access-token expiry we proactively refresh.
 * 60 seconds gives enough runway to absorb network latency and minor
 * clock skew between the app server and the Uniform token endpoint.
 */
const REFRESH_BUFFER_MS = 60_000;

/**
 * Derives a 256-bit AES key from an arbitrary-length secret string using SHA-256.
 * Hashing normalises the key length and ensures that secrets longer than 32 bytes
 * are not silently truncated by the crypto layer.
 */
async function deriveKey(secret) {
  const encoded = new TextEncoder().encode(secret);
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return new Uint8Array(hash);
}

/**
 * Encrypts a DelegationSession into an AES-256-GCM JWE string suitable for
 * storage in an httpOnly cookie.
 *
 * The encrypted token is opaque to the browser — it cannot be decoded without
 * the server secret (MESH_SESSION_SECRET env var). The JWE also carries an
 * expiry claim (`exp`) so that a stolen old token cannot be replayed after
 * the cookie has been rotated.
 */
export async function sealSession(session, secret) {
  const key = await deriveKey(secret);
  return new EncryptJWT(session)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .encrypt(key);
}

/**
 * Decrypts a JWE cookie string back into a DelegationSession.
 * Returns null (instead of throwing) for any failure — expired token,
 * tampered ciphertext, wrong secret. Callers treat null as "no session".
 */
export async function unsealSession(cookie, secret) {
  try {
    const key = await deriveKey(secret);
    const { payload } = await jwtDecrypt(cookie, key);
    const { accessToken, refreshToken, expiresAt } = payload;
    if (typeof accessToken !== 'string' || typeof expiresAt !== 'number') {
      // eslint-disable-next-line no-console
      console.error('Invalid cookie payload', { accessToken, refreshToken, expiresAt });
      return null;
    }
    return { accessToken, refreshToken: refreshToken ?? undefined, expiresAt };
  } catch {
    // eslint-disable-next-line no-console
    console.error('Error decrypting cookie');
    return null;
  }
}

/** Parses the Cookie request header into a key→value map. */
export function parseCookies(header) {
  const result = {};
  for (const pair of header.split(';')) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) {
      continue;
    }
    result[pair.slice(0, eqIdx).trim()] = pair.slice(eqIdx + 1).trim();
  }
  return result;
}

/**
 * Serialises a Set-Cookie header value.
 *
 * Security flags applied:
 *   - HttpOnly: JavaScript (including injected scripts or browser extensions)
 *     cannot read this cookie via document.cookie.
 *   - Secure: cookie is only sent over HTTPS. Always set. Plain-HTTP localhost
 *     is intentionally NOT supported — use HTTPS=1 with dev certs.
 *   - SameSite=None: required so the browser attaches the cookie on requests
 *     made from inside a cross-site iframe (which is how the Mesh dashboard
 *     loads us). CSRF is handled separately via the custom-header check in
 *     `csrf.js`.
 *   - Partitioned: ALWAYS emitted. Opts into CHIPS so the cookie is stored
 *     under a partition keyed by (our origin × top-level site). This both
 *     survives the third-party cookie phase-out and gives us "free"
 *     isolation between embedding hosts even in scenarios where the browser
 *     treats us as first-party (e.g. local dev with dashboard and Mesh app
 *     both on localhost but on different ports — same site, different
 *     origins). There is no supported configuration in which we want this
 *     flag off, so it is not a knob.
 */
export function serializeCookie(name, value, opts) {
  const parts = [`${name}=${value}`, 'HttpOnly'];
  if (opts.secure) {
    parts.push('Secure');
  }
  parts.push(`SameSite=${opts.sameSite}`, `Path=${opts.path}`, `Max-Age=${opts.maxAge}`, 'Partitioned');
  return parts.join('; ');
}

/**
 * Builds cookie options for the delegation session cookie.
 *
 * `Secure` is always `true` and `SameSite=None; Partitioned` is always emitted
 * (by `serializeCookie`) because we are loaded as a cross-site iframe by the
 * Uniform dashboard — there is no configuration in which weaker flags would
 * be correct.
 */
export function createCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: COOKIE_PATH,
    maxAge: SESSION_TTL_SECONDS,
  };
}

/**
 * Returns true when the access token will expire within REFRESH_BUFFER_MS.
 *
 * BFF routes call this before every upstream Uniform API call. When true,
 * they refresh the token pair via DelegationTokenClient.refreshDelegationToken()
 * and write a new sealed cookie onto the response BEFORE making the actual
 * API call. This keeps the session alive transparently without requiring a
 * dedicated refresh round-trip from the browser.
 */
export function needsRefresh(session) {
  return session.expiresAt - Date.now() < REFRESH_BUFFER_MS;
}
