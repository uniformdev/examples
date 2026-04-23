/**
 * csrf.ts — Minimal custom-header CSRF guard for BFF routes.
 *
 * WHY THIS EXISTS
 * ---------------
 * Our session cookie is `SameSite=None; Partitioned` because we are embedded
 * as a cross-site iframe (see `cookieUtils.ts`). That means the browser no
 * longer refuses to attach the cookie on cross-site requests for us — so we
 * have to add back the CSRF protection that `SameSite=Lax` used to provide
 * for free.
 *
 * HOW A CUSTOM-HEADER CHECK BLOCKS CSRF
 * -------------------------------------
 * A browser will NOT attach a non-CORS-safelisted request header (like
 * `X-Mesh-Csrf`) on a cross-origin request unless the target server first
 * approves it via a CORS preflight. Our API routes do not serve permissive
 * CORS (no `Access-Control-Allow-Origin: *`, no
 * `Access-Control-Allow-Headers: x-mesh-csrf`), so any request that arrives
 * with the header must have originated from our own JS, from our own origin.
 *
 * This is deliberately the SMALLEST defence that works. It covers the
 * classic "attacker page POSTs to our endpoint with ambient cookies" case
 * but does nothing against (a) XSS in our own app — a compromised script can
 * trivially add the header — or (b) same-site subdomain takeovers.
 *
 * WANT STRONGER GUARANTEES? (defence-in-depth options)
 * ----------------------------------------------------
 *   1. Origin / Referer allow-list — reject POSTs whose `Origin` header is
 *      not in `{ https://uniform.app, https://<your-mesh-host> }`. Cheap,
 *      closes the "attacker ran your bundle in their iframe" edge case.
 *   2. Double-submit token — issue a random CSRF token at session start,
 *      store it in a non-HttpOnly cookie, require it echoed in the header
 *      on every state-changing call. Resists header-only replays in
 *      environments where Origin is spoofable (non-browser clients).
 *   3. `Sec-Fetch-Site: same-origin` check — supplementary; Chromium-only
 *      but cheap to layer in.
 *   4. Per-request nonce bound to the session JWE — strongest, but needs a
 *      round-trip to mint the nonce. Use when issuing destructive actions
 *      (project deletes, permission changes).
 *   5. Hard-isolate via `__Host-` cookie prefix and/or a dedicated BFF
 *      subdomain you don't let any other app embed.
 */
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Request header the Mesh iframe must attach to every state-changing call.
 * Any fixed, non-CORS-safelisted header name works — the value is irrelevant
 * to the security argument, only the presence matters.
 */
export const CSRF_HEADER_NAME = 'x-mesh-csrf';

/** Constant expected header value. Kept for symmetry / easier debugging. */
export const CSRF_HEADER_VALUE = '1';

/**
 * Guards a BFF route against cross-site request forgery by requiring the
 * Mesh custom header. Returns `true` when the request passes the check.
 *
 * On failure this writes a 403 response and returns `false` so callers can
 * early-return without double-responding.
 */
export function requireCsrfHeader(req: NextApiRequest, res: NextApiResponse): boolean {
  const received = req.headers[CSRF_HEADER_NAME];
  if (received !== CSRF_HEADER_VALUE) {
    res.status(403).json({ error: 'Missing or invalid CSRF header' });
    return false;
  }
  return true;
}
