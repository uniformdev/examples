# Mesh Auth Example

Reference Mesh integration for **authentication and authorization** with the Mesh SDK.

- **Identity delegation** — session token exchange, JWE-sealed `HttpOnly` cookie, CSRF-guarded BFF routes
- **Manifest access control** — `access.teamAdminRequired` on a project tool
- **Metadata access control** — `metadata.user` role and permission checks (defense in depth)

The delegation demo fetches a single composition by ID through your BFF. The UI is intentionally minimal — the focus is SDK usage and error handling.

Official guide: [Identity delegation](https://docs.uniform.app/docs/integrations/mesh-integrations/identity-delegation)

## Delegation lifecycle

This demo does **not** use refresh tokens. When the delegation access token expires (~15 minutes), the client obtains a new Mesh session token and re-exchanges it via `POST /api/session`.

### Initial session

1. `DelegationProvider` calls `checkActive()` → `GET /api/status` (HttpOnly cookie is not readable from JS).
2. If status is not `active`, the provider calls `sdk.getSessionToken()` (user may see a consent step).
3. `onSessionToken` posts the one-time session token to `POST /api/session`; the BFF exchanges it and sets the sealed cookie.

### Expiry and reacquire

There are two recovery paths:

| When | What happens |
| --- | --- |
| **Tab returns after being hidden** | `DelegationProvider` re-checks via `checkActive` (default: after 30s hidden, `revalidateOnFocus`). If `/api/status` returns `expired` or `none`, it runs the full session-token exchange again. |
| **Mid-session BFF call** | BFF routes clear the cookie when `needsRefresh(session)` applies or Uniform returns an invalid token. They respond with `401` and `code: 'delegation_expired'`. `useDelegationFetch` (or manual `reacquire()` from `useDelegation`) re-exchanges and **retries the request once**. A second expiry is returned to the caller as-is. |

## CSRF on BFF routes

All guarded BFF routes (`POST /api/session`, `GET /api/status`, `GET /api/composition`, …) require:

1. `Origin` / `Referer` in `MESH_ALLOWED_ORIGINS`
2. The `X-Mesh-Csrf: 1` header on every request from your frontend code (`useDelegationFetch` adds this automatically)

The header value is a **constant**, not a secret. It only defends because browsers cannot set custom headers on cross-origin requests without a CORS preflight, and these routes are **not** CORS-open.

**Do not enable permissive CORS** on guarded BFF routes. Doing so would let cross-site pages pass the header check and silently remove this protection.

## Locations

| URL | Kind | Demonstrates |
| --- | --- | --- |
| `/delegation-demo` | project tool | `DelegationProvider`, `DelegationGate`, `useDelegationFetch`, `GET /api/composition` |
| `/admin-only-tool` | project tool | Manifest `access.teamAdminRequired: true` |
| `/metadata-role-check` | project tool | `metadata.user` — `isAdmin`, `hasRole()`, `hasPermissions()` (no manifest `access`) |
| `/settings` | settings | Location that does not use delegation |

## Prerequisites

- A Uniform team and project
- A custom integration with **Identity delegation** enabled
- HTTPS (required for identity delegation). For local development, serve this app over HTTPS and set `baseLocationUrl` in `mesh-manifest.json` to match.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy and fill environment variables:

   ```bash
   cp .env.example .env
   ```

   | Variable | Purpose |
   | --- | --- |
   | `UNIFORM_API_HOST` | Uniform API origin (e.g. `https://uniform.app`) |
   | `UNIFORM_EDGE_API_HOST` | Uniform edge API host (e.g. `https://uniform.global`) |
   | `UNIFORM_INTEGRATION_ID` | Integration UUID from the dashboard |
   | `UNIFORM_INTEGRATION_SECRET` | Plaintext app secret from integration create/regenerate |
   | `MESH_SESSION_SECRET` | ≥32 random bytes for JWE sealing — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `MESH_ALLOWED_ORIGINS` | Comma-separated HTTPS origin(s) of this mesh app (e.g. `https://localhost:9002`). Must be HTTPS. |

3. Register `mesh-manifest.json` as a custom integration in your Uniform team (Settings → Custom Integrations). Set `"identityDelegation": true` and update `baseLocationUrl` to your deployed or local HTTPS URL.

4. Install the integration on a project.

## Run

```bash
npm run dev
```

`next dev --webpack --experimental-https` generates a self-signed certificate on first run and serves the app on `https://localhost:9002` (your browser may show a one-time trust warning). No monorepo tooling or pre-generated certificates are required.

Open **Delegation Demo** from the project tools menu.

## Project structure

```
pages/
  delegation-demo.tsx            # DelegationProvider + useDelegationFetch
  admin-only-tool.tsx            # Manifest access control
  metadata-role-check.tsx        # Metadata access control
  settings.tsx                   # Location without delegation
  index.tsx                      # Standalone landing (open from dashboard)
  api/
    session.ts                   # Session token → delegation token exchange
    status.ts                    # Delegation cookie status probe
    composition.ts               # BFF: fetch composition by ID
lib/
  delegationSessionCallbacks.ts  # checkActive, onSessionToken for DelegationProvider
  util/
    csrf.ts                      # CSRF guard for BFF routes
    delegationSession.ts         # Cookie read / session load helpers
    getDelegationTokenClient.ts  # DelegationTokenClient singleton
```
