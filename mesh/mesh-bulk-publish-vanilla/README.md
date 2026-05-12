# Mesh bulk publish (Express + HTMX)

This example is the same **Identity Delegation** story as the Next.js bulk-publish sample, but implemented with **Express**, **HTMX**, and a small **esbuild**-bundled client—useful if you want a minimal server and no React.

## What it demonstrates

- **Identity delegation** — the integration receives a delegation handoff from Mesh; the server exchanges it for tokens and stores them in an **httpOnly** **JWE**-sealed session cookie.
- **BFF pattern** — `/api/*` routes decrypt the session, refresh tokens when needed, and call **Uniform Canvas** with a **Bearer** token (via `createDelegationCanvasClient` / `CanvasClient` configured for delegation only, no API key on the client).
- **JWE and session token exchange** — see `src/services/delegationSession.js`, the shared `@uniformdev/mesh-identity-delegation-session` helpers, and the API route handlers for the end-to-end flow.

## Why delegation instead of API keys?

- **No long-lived API key in the Mesh app** — the integration does not need a stored secret that would grant broad access if exposed.
- **Security** — short‑lived tokens, server-side sealing, and **httpsOnly** cookies keep credentials off the client and scoped to the session.
- **Delegated user as author** — composition and publish operations run as the user who consented in Canvas, aligning with your org’s permissions and audit trail.

## Documentation and availability

- Deeper product documentation is planned at [Mesh Identity Delegation](https://docs.uniform.app/docs/integrations/mesh-integrations/identity-delegation) (in progress).
- **Feature availability:** use Uniform **`20.xx.x`** or newer for the Mesh delegation APIs and packages (e.g. `@uniformdev/mesh-sdk`, `@uniformdev/canvas`).

## Why HTTPS (even on localhost)?

Your integration runs **inside the Uniform Canvas** UI, which is **HTTPS-only**. Browsers expect embedded apps in that role to be served with **TLS** as well, so you avoid **mixed content** and inconsistent behavior, and you align with **`Secure` cookies** and other **secure-context** requirements used for the delegation session. A local BFF on **`https://localhost`** (self-signed in this sample, or your own cert) is the same pattern you will use when the integration is deployed, instead of a one-off unencrypted `http://` dev URL.

## Run locally

Copy `.env.example` to `.env`, install dependencies, then `pnpm dev` (client bundle is built in `predev`). The dev server runs over **HTTPS**; if you do not set `HTTPS_KEY` and `HTTPS_CERT`, it uses a **generated self-signed** certificate for that process (your browser may show a trust warning). Set `MESH_ALLOWED_ORIGINS` to your app origin (for local dev that is `https://localhost:9003`). Point your Mesh app’s `baseLocationUrl` in `mesh-manifest.json` at `https://localhost:9003` and set `"identityDelegation": true`.
