# Uniform Mesh integration — JSON Rules Engine personalization

This Mesh integration registers a custom personalization selection algorithm on the Uniform canvas. Authors use it to define rule-based variant matching that runs against visitor facts (appointment dates, segment IDs, order status, etc.) on the front-end.

The rule format is the native condition format of [`json-rules-engine`](https://github.com/CacheControl/json-rules-engine) — leaf `{ fact, operator, value }` nodes inside recursive `all` / `any` groups. The runtime side that evaluates these rules lives in a separate app: see the companion runtime example below.

## Companion runtime app

This Mesh integration is the authoring half. To actually evaluate the rules at runtime you need the matching front-end app:

- **[`examples/react-vite-ssr-json-engine-rule-personalization`](../../examples/react-vite-ssr-json-engine-rule-personalization)** — Vite + React SSR app that registers a custom selection algorithm with the Uniform Context SDK and evaluates the rules authored here.

Both apps are required: the Mesh integration provides the authoring UI on the dashboard side, the Vite app provides the runtime that executes the rules in the visitor's browser.

## What's in this integration

Two locations are wired up in `mesh-manifest.json`:

- **`/rule-editor`** — `canvas.personalization.selectionAlgorithms.json-rules-engine.criteriaEditorUrl`. Renders on each personalized variant in the dashboard. Lets authors build the rule as a list of `fact / operator / value` rows joined by `all` (logical AND). The set of available facts comes from the integration settings.
- **`/settings`** — `settings.url`. Lets editors configure the list of facts that appear in the rule editor's "Fact" dropdown. The shipped default list matches the customer's reference rules (`appointment_date`, `user_segment_id`, `first_name`, …); edit it to match your own visitor data.

Supported operators in the editor: `equal`, `notEqual`, `greaterThanInclusive` (on-or-after), `lessThanInclusive` (on-or-before), `in`. These are forwarded verbatim to `json-rules-engine` at runtime, so any operator the library ships also works if you extend the editor.

## Installation

### Manual installation via CLI

- You will need a Uniform team and project, plus a team-admin API key.
- Copy `.env.example` to `.env` and fill in your team admin API key, team ID, and project ID.
- `npm install`
- `npm run register-to-team` — deploys `mesh-manifest.json` to your team.
- `npm run install-to-project` — enables the integration on your project.
- `npm run dev` — runs the integration UI on `http://localhost:9000`. The dashboard loads pages from this URL while editing.

### Manual installation via the Uniform dashboard

- Go to Team → Settings → Custom Integrations → New integration. Paste in `mesh-manifest.json`.
- Go to Project → Integrations and install the integration on your project.

## Using it

1. Open the integration settings page and confirm the fact list matches the facts your runtime app populates as Uniform quirks.
2. On a personalized component, change the personalization algorithm to **JSON Rules Engine**.
3. For each variant, build a rule in the criteria editor. A variant with zero conditions is a default — place it last in the variant list.
4. Publish. The runtime app reads the saved `conditions` tree off each variant and evaluates it against the visitor's quirks.

## Related links

- [`json-rules-engine` on GitHub](https://github.com/CacheControl/json-rules-engine) — the rule engine this integration's format is modeled on.
- Companion runtime: [`examples/react-vite-ssr-json-engine-rule-personalization`](../../examples/react-vite-ssr-json-engine-rule-personalization).
- Base Mesh integration starter: [`mesh/mesh-integration`](../mesh-integration) — a fuller example with edgehancers, AI editors, data connectors, and the reference manifest.
