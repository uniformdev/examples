/**
 * cookieUtils.ts — Session cookie helpers for identity delegation.
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
 *   3. Automatic CSRF protection — SameSite=Lax means the cookie is sent
 *      on same-site navigations and same-site fetch, but NOT on cross-site
 *      requests initiated by third-party pages.
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

/** Tokens stored in the encrypted session cookie. */
export interface DelegationSession {
  /** Short-lived Bearer token for calling Uniform APIs on behalf of the user. */
  accessToken: string;
  /**
   * Rolling refresh token — each use issues a new pair, invalidating the old one.
   * Undefined represents "This Session Only" consent, so refreshment would go via cross-frames communication.
   */
  refreshToken: string | undefined;
  /** Unix epoch milliseconds when accessToken expires. */
  expiresAt: number;
}

export interface CookieOptions {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
}

/**
 * Derives a 256-bit AES key from an arbitrary-length secret string using SHA-256.
 * Hashing normalises the key length and ensures that secrets longer than 32 bytes
 * are not silently truncated by the crypto layer.
 */
async function deriveKey(secret: string): Promise<Uint8Array> {
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
export async function sealSession(session: DelegationSession, secret: string): Promise<string> {
  const key = await deriveKey(secret);
  return new EncryptJWT(session as unknown as Record<string, unknown>)
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
export async function unsealSession(cookie: string, secret: string): Promise<DelegationSession | null> {
  try {
    const key = await deriveKey(secret);
    const { payload } = await jwtDecrypt(cookie, key);
    const { accessToken, refreshToken, expiresAt } = payload as unknown as Record<string, unknown>;
    if (
      typeof accessToken !== 'string' ||
      typeof refreshToken !== 'string' ||
      typeof expiresAt !== 'number'
    ) {
      return null;
    }
    return { accessToken, refreshToken, expiresAt };
  } catch {
    return null;
  }
}

/** Parses the Cookie request header into a key→value map. */
export function parseCookies(header: string): Record<string, string> {
  const result: Record<string, string> = {};
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
 *   - Secure: cookie is only sent over HTTPS. Skipped for plain-HTTP localhost
 *     because browsers refuse Secure cookies on http:// origins during development.
 *   - SameSite=Lax: cookie is sent on top-level same-site navigations and
 *     same-site fetch/XHR, but NOT on cross-site requests. This prevents CSRF
 *     without breaking normal same-origin API calls from the Mesh iframe.
 */
export function serializeCookie(name: string, value: string, opts: CookieOptions): string {
  const parts = [`${name}=${value}`, 'HttpOnly'];
  if (opts.secure) {
    parts.push('Secure');
  }
  parts.push(`SameSite=${opts.sameSite}`, `Path=${opts.path}`, `Max-Age=${opts.maxAge}`);
  return parts.join('; ');
}

/**
 * Builds cookie options from the Uniform API host.
 * Secure=false is set only for plain-HTTP localhost to allow local development
 * without HTTPS — all non-localhost environments always use Secure=true.
 */
export function createCookieOptions(apiHost: string): CookieOptions {
  let secure = true;
  try {
    const url = new URL(apiHost);
    if (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
      secure = false;
    }
  } catch {
    /* invalid URL — keep secure */
  }
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure,
    sameSite: 'lax',
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
export function needsRefresh(session: DelegationSession): boolean {
  return session.expiresAt - Date.now() < REFRESH_BUFFER_MS;
}
