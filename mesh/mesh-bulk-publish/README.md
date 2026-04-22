# Mesh bulk publish (Next.js)

This example shows how a **Mesh integration** can use **Identity Delegation** so users act in Uniform with their own account—without your app holding long‑lived Uniform API keys.

## What it demonstrates

- **Identity delegation** — the Mesh app receives a short‑lived delegation context from Canvas; your **BFF** (backend-for-frontend) exchanges it for tokens and keeps them in an **httpOnly** cookie.
- **JWE session sealing** — access/refresh token pairs are stored as an encrypted **JWE** (not a signed JWT), using a server-only secret.
- **Session and token exchange** — API routes read the cookie, refresh when needed, and call Uniform with a **Bearer** token (see `CanvasClient` usage with delegation, not API keys).

## Why delegation instead of API keys?

- **No API key in your integration** — you are not persisting a secret that could leak from the client or a misconfigured deploy. And you can reuse same integration accross projects.
- **Tighter security model** — tokens are short‑lived, scoped, and carried over **httpsOnly** cookies on your origin.
- **Content changes are authored by the delegated user** — publishes and edits are attributed to the person who approved the session in Canvas, which matters for audit and permissions.

## Documentation and availability

- Future product documentation will live at [Mesh Identity Delegation](https://docs.uniform.app/docs/integrations/mesh-integrations/identity-delegation) (in progress).
- **Feature availability:** Mesh Identity Delegation and the related packages are available starting from Uniform **`20.xx.x`** (e.g. `@uniformdev/mesh-sdk`, `@uniformdev/mesh-sdk-react`, `@uniformdev/canvas`).

## Why HTTPS (evev on localhost)?

Canvas and the **Uniform app shell are always served over HTTPS**, and your integration loads there as a **nested context** (iframe) from your own origin. Browsers **block or downgrade mixed content** when a secure top-level page embeds a plain `http://` app; you also need a **secure context** for modern cookie rules (`Secure` on session cookies) and a setup that **matches what you will ship in production** (TLS on the BFF, same site behavior). For local development, that means using HTTPS on the dev server (Next’s `experimental-https` handles the certificates) rather than unencrypted `http://localhost` only.

## Run locally

Copy `.env.example` to `.env`, fill the variables, then `npm run dev`. The dev server uses **Next.js** [`--experimental-https`](https://nextjs.org/docs/app/api-reference/cli/next#next-dev-options), which provisions **local TLS automatically** (no hand-managed PEM files). The Mesh manifest sets `"identityDelegation": true` in `mesh-manifest.json`; align `baseLocationUrl` with the URL Next prints (for example `https://localhost:9002`).
