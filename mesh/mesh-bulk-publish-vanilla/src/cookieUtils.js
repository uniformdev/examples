/**
 * Session cookie helpers for identity delegation.
 * (Same behavior as experiments/mesh-bulk-publish/lib/cookieUtils.ts)
 */
import { EncryptJWT, jwtDecrypt } from 'jose';

export const COOKIE_NAME = '__mesh_delegation';
const COOKIE_PATH = '/';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

const REFRESH_BUFFER_MS = 60_000;

async function deriveKey(secret) {
  const encoded = new TextEncoder().encode(secret);
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return new Uint8Array(hash);
}

export async function sealSession(session, secret) {
  const key = await deriveKey(secret);
  return new EncryptJWT(session)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .encrypt(key);
}

export async function unsealSession(cookie, secret) {
  try {
    const key = await deriveKey(secret);
    const { payload } = await jwtDecrypt(cookie, key);
    const { accessToken, refreshToken, expiresAt } = payload;
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

export function serializeCookie(name, value, opts) {
  const parts = [`${name}=${value}`, 'HttpOnly'];
  if (opts.secure) {
    parts.push('Secure');
  }
  parts.push(`SameSite=${opts.sameSite}`, `Path=${opts.path}`, `Max-Age=${opts.maxAge}`);
  return parts.join('; ');
}

export function createCookieOptions(apiHost) {
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

export function needsRefresh(session) {
  return session.expiresAt - Date.now() < REFRESH_BUFFER_MS;
}
