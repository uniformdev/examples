# Bulk publish reference example

A minimal Next.js mesh integration that demonstrates the **identity delegation** flow end-to-end:

1. The dashboard mints a short-lived session token for the signed-in user (10s TTL).
2. This Next.js BFF exchanges the session token + integration secret for a delegation
   access token (and, when consent permits, a refresh token).
3. The token pair is sealed into an `HttpOnly`, `Secure`, partitioned (`SameSite=None`)
   JWE cookie. The browser never sees the raw tokens.
4. The bulk-publish tool calls Uniform Canvas APIs through this Next.js BFF using the
   sealed cookie; the BFF attaches the delegation access token as a Bearer header.

The integration registers mesh locations:

- **`/bulk-publish`** (project tool): exercises the full delegation flow.
- **`/admin-only-tool`** (project tool): manifest-declared `teamAdminRequired` access.
- **`/metadata-role-check`** (project tool): metadata-driven admin check (defense in depth).
- **`/settings`**: intentionally renders without delegation. Use it to verify that the
  delegation/consent paths are scoped only to locations that need them.

## Why delegation instead of API keys?

- **No API key in your integration** — you are not persisting a secret that could leak from the client or a misconfigured deploy.
- **Tighter security model** — tokens are short-lived, scoped, and carried over **httpOnly** cookies on your origin.
- **Content changes are authored by the delegated user** — publishes and edits are attributed to the person who approved the session in Canvas.

## Documentation and availability

- Product documentation: [Mesh Identity Delegation](https://docs.uniform.app/docs/integrations/mesh-integrations/identity-delegation) (in progress).
- **Feature availability:** Mesh Identity Delegation and the related packages are available starting from Uniform **`20.xx.x`** (e.g. `@uniformdev/mesh-sdk`, `@uniformdev/mesh-sdk-react`, `@uniformdev/canvas`). This example uses **`20.50.2-alpha.117`**.

## Prerequisites

- A Custom Integration in your Uniform dashboard with **Identity delegation**
  enabled. Note the generated `integrationId` and `appSecret` — they go into
  `UNIFORM_INTEGRATION_ID` and `UNIFORM_INTEGRATION_SECRET` below.
- For local development: [mkcert](https://github.com/FiloSottile/mkcert) installed and
  `mkcert -install` run once, plus TLS certificates for `localhost` in `./certificates/`:

  ```bash
  mkdir -p certificates
  mkcert -key-file certificates/localhost-key.pem -cert-file certificates/localhost.pem localhost
  ```

## Setup

1. Copy the env template and fill in the values:

   ```bash
   cp .env.example .env
   ```

   - `UNIFORM_API_HOST` — typically `https://uniform.app`, or `https://eu.uniform.app`, or your local dashboard API (e.g. `https://localhost:8889`).
   - `UNIFORM_EDGE_API_HOST` — similar to `UNIFORM_API_HOST`
   - `UNIFORM_INTEGRATION_ID` — UUID of the Custom Integration created in the dashboard.
   - `UNIFORM_INTEGRATION_SECRET` — plaintext app secret returned when the integration was
     created or its secret was last regenerated.
   - `MESH_SESSION_SECRET` — at least 32 characters of random data. Generate with:

     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - `MESH_ALLOWED_ORIGINS` — comma-separated list of origins allowed to call state-changing
     BFF routes. For local dev use `https://localhost:9002`; for the deployed example use
     `https://project-lq3uv.vercel.app`.

   > ⚠️ **Never set `NODE_TLS_REJECT_UNAUTHORIZED=0`.**
   > It disables TLS verification process-wide.

   ### TLS for the local token-exchange call

   The BFF calls `UNIFORM_API_HOST` (e.g. `https://localhost:8889`) server-side. That endpoint
   may use an mkcert-issued cert for `localhost`, which Node does not trust out of the box.

   The `dev` script passes `--experimental-https-ca "$(mkcert -CAROOT)/rootCA.pem"` to
   `next dev`, which is the mechanism Next.js honors for trusting an extra CA inside its
   dev-worker process.

2. Register the integration in the dashboard. Either upload `mesh-manifest.json` (or
   `mesh-manifest.local.json` for local dev) from the dashboard's Custom Integrations UI,
   or paste its contents into the manifest input field.

3. For local backend trust the dashboard dev certificate in your browser if you have not
   already, so the iframe at `https://localhost:9002` can talk to `https://localhost:8889`.
   Otherwise open `https://localhost:9002` separately and trust the certificate for the mesh app.

## Run

```bash
npm install
npm run dev
```

This boots Next.js on `https://localhost:9002`. Open the dashboard, navigate to a project
where the integration is installed, and load the **Bulk Publish Tool** project tool location.
The first time, the consent drawer prompts the team admin to grant either "30 days"
(issues a refresh token) or "this session only" (no refresh token). Non-admins skip the
drawer and receive a refresh-enabled session.

## Troubleshooting

- **The iframe shows "Bad cookie" or empty session.** Ensure your browser allows
  third-party cookies for the dashboard origin and that `MESH_SESSION_SECRET` is set to a
  stable value across BFF restarts.
- **`fetch` errors with `SELF_SIGNED_CERT_IN_CHAIN` or similar.** Ensure mkcert is installed,
  `mkcert -install` has been run, and you did a cold restart of `npm run dev` after any
  TLS-related change.
- **`Token exchange failed (401): ...`** indicates a wrong integration secret or that the
  caller's session token belongs to a different integration.
- **`Token exchange failed (403): ...`** indicates the caller is not a member of the
  project, or the integration is installed on a different team.
- **The dashboard never loads the iframe.** Confirm `mesh-manifest.json`'s
  `baseLocationUrl` matches the dev URL Next.js prints (`https://localhost:9002`) and
  that the dashboard build picks up the manifest update.
