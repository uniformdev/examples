# Mesh Auth Example

Reference Mesh integration for **authentication and authorization** with the Mesh SDK.

- **Identity delegation** — session token exchange, JWE-sealed `HttpOnly` cookie, CSRF-guarded BFF routes
- **Manifest access control** — `access.teamAdminRequired` on a project tool
- **Metadata access control** — in-iframe `metadata.user.isAdmin` check (defense in depth)

The delegation demo fetches a single composition by ID through your BFF. The UI is intentionally minimal — the focus is SDK usage and error handling.

When the delegation access token expires, the browser obtains a new Mesh session token and re-exchanges it with `/api/session`. This demo does **not** use refresh tokens.

## CSRF on BFF routes

State-changing BFF routes (`POST /api/session`, `GET /api/status`, `GET /api/composition`, …) require:

1. `Origin` / `Referer` in `MESH_ALLOWED_ORIGINS`
2. The `X-Mesh-Csrf: 1` header on every request from your frontend code

The header value is a **constant**, not a secret. It only defends because browsers cannot set custom headers on cross-origin requests without a CORS preflight, and these routes are **not** CORS-open.

**Do not enable permissive CORS** on guarded BFF routes. Doing so would let cross-site pages pass the header check and silently remove this protection.

## Locations

| URL | Kind | Demonstrates |
| --- | --- | --- |
| `/delegation-demo` | project tool | `DelegationProvider`, consent flow, `GET /api/composition` |
| `/admin-only-tool` | project tool | Manifest `access.teamAdminRequired: true` |
| `/metadata-role-check` | project tool | `metadata.user.isAdmin` gate without manifest `access` |
| `/settings` | settings | Location that does not use delegation |

## Prerequisites

- A Uniform team and project
- A custom integration with **Identity delegation** enabled
- HTTPS for production (required for identity delegation). For local development, serve this app over HTTPS and set `baseLocationUrl` in `mesh-manifest.json` to match.

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
   | `UNIFORM_EDGE_API_HOST` | Uniform edge API host |
   | `UNIFORM_INTEGRATION_ID` | Integration UUID from the dashboard |
   | `UNIFORM_INTEGRATION_SECRET` | Plaintext app secret from integration create/regenerate |
   | `MESH_SESSION_SECRET` | ≥32 random bytes for JWE sealing — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `MESH_ALLOWED_ORIGINS` | Comma-separated HTTPS origin(s) of this mesh app (e.g. `https://localhost:9002`). Must be HTTPS. |

3. Register `mesh-manifest.json` as a custom integration in your Uniform team (Settings → Custom Integrations). Update `baseLocationUrl` to your deployed or local HTTPS URL.

4. Install the integration on a project.

## Run

```bash
npm run dev
```

`next dev --experimental-https` generates a self-signed certificate on first run and serves the app on `https://localhost:9002` (your browser may show a one-time trust warning). No monorepo tooling or pre-generated certificates are required.

Open **Delegation Demo** from the project tools menu.

## Project structure

```
pages/
  delegation-demo.tsx       # DelegationProvider + client fetch example
  admin-only-tool.tsx       # Manifest access control
  metadata-role-check.tsx   # Metadata access control
  settings.tsx              # Location without delegation
  api/
    session.ts              # Session token → delegation token exchange
    status.ts               # Delegation cookie status probe
    composition.ts          # BFF: fetch composition by ID
lib/
  delegationSessionCallbacks.ts  # DelegationProvider callbacks
  util/
    csrf.ts                 # CSRF guard for BFF routes
    delegationSession.ts    # Cookie read / session load helpers
```
