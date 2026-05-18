# Plan: JSON Rules Engine personalization — runtime side

This Vite SSR app evaluates per-visitor personalization rules authored in the Uniform dashboard. The rule shape is [json-rules-engine](https://github.com/CacheControl/json-rules-engine)'s native condition format — any operator the library ships, recursive `all`/`any` groups, leaf `{ fact, operator, value }` nodes. The authoring UI lives in a separate Mesh integration — see [`mesh/mesh-integration/plan.md`](../../mesh/mesh-integration/plan.md).

This app currently uses `@uniformdev/canvas` + `@uniformdev/canvas-react`. Personalization requires adding `@uniformdev/context` and wiring a custom selection algorithm.

## v1 design decisions (locked)

- **Client-side personalization only.** The algorithm runs in the browser. SSR renders the control/default variant; the personalized variant swaps in after hydration once visitor facts load. No server-side facts, no edge personalization, no SSR-correct personalized HTML. This is fine for the customer's use case — the personalized blocks are below-the-fold alert banners and offers, not SEO-critical.

## What this side ships

- `src/uniform/jsonRulesPlugin.ts` — a `ContextPlugin` that registers a `PersonalizationSelectionAlgorithm` keyed `"json-rules-engine"`. Evaluates `variant.pz` against a visitor-facts quirk and returns matching variants.
- `src/uniform/factsLoader.ts` — populates the visitor-facts quirk on the client after mount. v1 uses a hardcoded local sample object so the rules can be exercised end-to-end without a backend.
- Update to `src/entry-client.jsx` to construct a `Context` with the plugin and wrap the app in `<UniformContext>`.

No new component code. Any component the customer already has can be placed inside a personalization slot — variants store their own parameter values, which Uniform resolves and passes as props in the usual way.

## Contract with the Mesh authoring side

Two things only:

1. **Algorithm key**: the string `"json-rules-engine"` registered in `ContextPlugin.personalizationSelectionAlgorithms` must match the key in the Mesh app's `mesh-manifest.json` under `canvas.personalization.selectionAlgorithms`. Tied by string equality.
2. **`pz` value shape** — json-rules-engine's native condition format:

```ts
type Condition = {
  fact?: string;
  operator?: string;
  value?: unknown;
  all?: Condition[];
  any?: Condition[];
};

type RuleCriteria = { conditions: Condition };
```

Both sides treat the value as a json-rules-engine condition tree. The runtime evaluates whatever the editor writes; the editor's v1 UI is free to produce only a subset (see the Mesh plan).

## Implementation steps

### 1. Add dependencies

```bash
npm install @uniformdev/context @uniformdev/context-react json-rules-engine
```

The project's existing `@uniformdev/canvas`/`canvas-react` are pinned to ^20.5.0, but the custom-algorithm API (`PersonalizationSelectionAlgorithm`, `ContextPlugin.personalizationSelectionAlgorithms`) doesn't ship until later 20.x. Bump all `@uniformdev/*` packages to ^20.63.0 (latest at the time of writing) so the types are available. Both Context packages are required: `@uniformdev/context-react` does not re-export the `Context` class, `ContextPlugin` type, or `PersonalizationSelectionAlgorithm` type — those live in `@uniformdev/context`. Declare it explicitly to keep the dependency graph honest.

### 2. Why json-rules-engine — and which part we use

The customer's source rules are in `json-rules-engine` format; we keep that schema verbatim so the rule documents are portable. The trick is using the library without its async `Engine.run()`:

- `Engine.run()` is async because it has to schedule rule events, resolve facts (which can be Promise-returning), and walk an `Almanac` — none of which we need.
- The library's `Operator` class (`equal`, `notEqual`, `lessThan`, `lessThanInclusive`, `greaterThan`, `greaterThanInclusive`, `in`, `notIn`, `contains`, `doesNotContain`) is **synchronous** under the hood — operators take `(factValue, jsonValue) => boolean`.
- `Engine` exposes its operator map as `engine.operators` (a `Map<string, Operator>`). That's the public, sync entry point.

So we instantiate one `Engine` to get the default operators registered, then dispatch through `engine.operators.get(name).evaluate(lhs, rhs)` ourselves. This gives us:

- Canonical json-rules-engine operator semantics (no reimplementation drift).
- Sync evaluation, no Promise bridge.
- Extensibility — `engine.addOperator('myOp', (l, r) => …)` for custom operators.
- Condition JSON shape compatible with the library's docs and the customer's existing rules.

If you ever need an operator the library doesn't ship (e.g. timezone-aware date math), add it via `engine.addOperator()`; no shim required.

### 3. Create `src/uniform/jsonRulesPlugin.ts`

```ts
import { ContextPlugin, PersonalizationSelectionAlgorithm, PersonalizedVariant } from '@uniformdev/context';
import { Engine } from 'json-rules-engine';

export const VISITOR_FACTS_QUIRK = 'visitor_facts';

// json-rules-engine's published types omit `engine.operators` (on Engine) and
// `evaluate` (on Operator) — both are public runtime API. Declare them here.
interface SyncOperator { evaluate(lhs: unknown, rhs: unknown): boolean }
interface OperatorRegistry { get(name: string): SyncOperator | undefined }

// Single Engine instance — used only as a registry of operators. We never call
// engine.run() because it's async; instead we dispatch through engine.operators
// directly (sync). Custom operators can be added here:
//   engine.addOperator('dateGte', (lhs, rhs) => new Date(lhs) >= new Date(rhs))
const engine = new Engine() as Engine & { operators: OperatorRegistry };

// Condition shape matches json-rules-engine docs verbatim. The customer's
// existing rule JSON documents paste in unmodified.
type Condition = {
  fact?: string;
  operator?: string;
  value?: unknown;
  all?: Condition[];
  any?: Condition[];
};

type RuleCriteria = { conditions: Condition };

function evaluate(c: Condition, facts: Record<string, unknown>): boolean {
  if (c.all) return c.all.every((sub) => evaluate(sub, facts));
  if (c.any) return c.any.some((sub) => evaluate(sub, facts));
  if (!c.fact || !c.operator) return false;
  const op = engine.operators.get(c.operator);          // public API, sync
  if (!op) return false;                                // unknown operator → fail closed
  return op.evaluate(facts[c.fact], c.value);
}

function safeJson(s: string): Record<string, unknown> {
  try { const v = JSON.parse(s); return v && typeof v === 'object' ? v : {}; }
  catch { return {}; }
}

type MatchedVariant = PersonalizedVariant<RuleCriteria> & { control: boolean };

const algorithm: PersonalizationSelectionAlgorithm<RuleCriteria> = ({
  variations, context, take = 1,
}) => {
  const raw = context.quirks[VISITOR_FACTS_QUIRK];
  const facts = typeof raw === 'string' ? safeJson(raw) : {};
  const matched: MatchedVariant[] = [];
  for (const v of variations) {
    if (!v.pz?.conditions) continue;                    // foreign algorithm or empty — skip
    if (evaluate(v.pz.conditions, facts)) {
      matched.push({ ...v, control: false });
      if (matched.length >= take) break;
    }
  }
  return { personalized: matched.length > 0, variations: matched };
};

export const jsonRulesPlugin: ContextPlugin = {
  personalizationSelectionAlgorithms: {
    'json-rules-engine': algorithm,                     // MUST match Mesh manifest key
  },
};
```

**Date-format note.** json-rules-engine's `greaterThanInclusive`/`lessThanInclusive` operators do numeric comparison via JavaScript's standard comparison operators. ISO 8601 date strings (`"2026-06-01"`) sort lexicographically in the same order as chronologically, so the customer's sample rules work as-is. If a fact is not ISO-format (e.g. `"06/01/2026"`), register a custom operator with `engine.addOperator()` or normalize at the fact-flattening step.

### 4. Wire the plugin into the existing Context

The starter already constructs a `Context` at module scope in `src/App.tsx` and wraps the app in `<UniformContext>`. Just register the plugin on that existing instance:

```tsx
// src/App.tsx
import { jsonRulesPlugin } from "./uniform/jsonRulesPlugin";
import { useLoadVisitorFacts } from "./uniform/factsLoader";

const context = new Context({
  manifest,
  defaultConsent: true,
  plugins: [jsonRulesPlugin],
});

function AppInner({ composition }: { composition?: RootComponentInstance }) {
  useLoadVisitorFacts();
  return (
    <UniformComposition
      data={composition}
      behaviorTracking="onLoad"
      resolveRenderer={resolveRenderer}
    />
  );
}
```

SSR still renders the composition without personalized variants showing: the algorithm only matches when the visitor-facts quirk is populated, and `useLoadVisitorFacts` runs in a `useEffect` (client-only). On the server pass, no facts → no matches → control content. On the client pass, facts populate after hydration and the matching variant swaps in.

### 5. Populate visitor facts

Create `src/uniform/factsLoader.ts`. v1 ships a hardcoded local object so the rules can be exercised without a backend — the customer swaps it for a real fetch later.

```ts
import { useEffect } from 'react';
import { useUniformContext } from '@uniformdev/context-react';
import { VISITOR_FACTS_QUIRK } from './jsonRulesPlugin';

// v1 sample facts. FLAT object — top-level keys only, no nested structure.
// Authors reference these keys verbatim as `fact` in the rule editor.
//
// The customer's source JSON rules used JSONPath like "$.order_appointment_date"
// against a nested visitor payload. In v1 we just write the flattened keys here,
// so authors type `order_appointment_date` directly. No `path` field needed.
const SAMPLE_VISITOR_FACTS: Record<string, unknown> = {
  order_appointment_date:   '2026-06-05',
  order_appointment_status: 'Waiting Confirmation',
  order_appointment_end_time: '2026-06-10',
  order_status:             'Active',
  product_instance_product_id: 'Internet',
  user_segment_id:          '3873823683',
  first_name:               'Alex',
  alert_set_status:         'active',
  marketing_campaign_start_date: '2026-06-01',
};

export function useLoadVisitorFacts() {
  const { context } = useUniformContext();
  useEffect(() => {
    context.update({
      quirks: { [VISITOR_FACTS_QUIRK]: JSON.stringify(SAMPLE_VISITOR_FACTS) },
    });
  }, [context]);
}
```

Call `useLoadVisitorFacts()` once near the top of `src/App.tsx`. To exercise different rule paths during development, edit the values in `SAMPLE_VISITOR_FACTS` and hot-reload.

When the customer wires this to their real visitor data, replace the constant + effect body with a fetch — the rest of the plumbing stays unchanged. The flattening responsibility (resolving the original `$.order_appointment_date`-style paths into top-level keys) lives in whatever produces this object.

### 6. Author personalization slots in Uniform (no component changes)

The feature works with **any existing component** in the app. In Uniform (via dashboard or `uniform.config.ts` + `npm run uniform:push`):

- Pick a slot in a composition where personalized content should appear.
- Add personalization variants on that slot. Algorithm = `json-rules-engine`.
- For each variant, the author sets:
  - `pz` via the Mesh app rule editor (the conditions).
  - The variant's regular component parameters, including any data-resource parameters bound through Uniform's data type connectors.

The algorithm doesn't read variant parameters; Uniform resolves them for the matched variant and passes them as props in the normal way.

### 7. SSR behavior

Context is constructed at module scope in `App.tsx`, so the provider tree is identical on server and client. On the server pass, the visitor-facts quirk is empty (the loader runs in `useEffect`), so no rule matches and control content renders. On the client, `useLoadVisitorFacts` populates the quirk after hydration, Context re-evaluates personalization slots, and the matching variant swaps in. Users may briefly see the control content; for the customer's banner/offers use case this is acceptable.

If SEO-correct personalization becomes a requirement later, the path is to make facts available server-side (cookie, edge KV, or request handler) and populate the quirk synchronously in `entry-server.jsx`. Out of scope for v1.

## Async caveat — why we don't call `engine.run()`

`PersonalizationSelectionAlgorithm` is typed sync. If you wrap `engine.run()` directly (returning its Promise), TypeScript's structural typing + generics will silently accept it, but at runtime:

1. **Result fields read as `undefined`.** `Context.personalize()` reads `.variations` off your return value synchronously. On a Promise, `.variations` is `undefined`. Every placement falls through to control.
2. **React already rendered.** `<UniformSlot>` calls `personalize()` during render — no await point. By the time the Promise resolves, the wrong content is on screen.
3. **Possible `TypeError`.** Code paths that do `Array.from(result.variations)` crash on `Array.from(undefined)`. Symptom: console error, empty placement, sometimes a render crash that takes out the composition.

Net effect: personalization "silently doesn't work" — control content always shows, hard to debug because typings look fine.

The §3 design avoids this entirely by going through `engine.operators` (sync) instead of `engine.run()` (async). Alternatives considered and rejected:

- **Background-evaluate, then force re-render.** No clean public API to trigger a re-personalize from inside the algorithm. Would require writing dummy quirks or other hacks.
- **Pre-evaluate at fact-load time.** Requires knowing all variants ahead of facts, but variants live on compositions fetched by Canvas — the fact loader doesn't see them.
- **Subclass `Engine` to expose a sync `run`.** Couples to library internals (the `Almanac` walker, fact-resolution machinery). Fragile across library upgrades.

The operator-dispatch path uses only json-rules-engine's public surface and gets the same operator semantics with none of the async problems.

## Authoring flow once deployed

1. Author opens a composition and picks a slot for personalized content.
2. Adds a personalization variant on that slot; algorithm dropdown → "Custom Rules".
3. The Mesh app rule editor iframes in; author writes conditions.
4. Author drops any existing component into the variant and configures its parameters via the standard pickers.
5. Publishes.

At request time: client app loads composition (SSR shows control), `useLoadVisitorFacts` writes the sample (or real) facts to the quirk, algorithm evaluates each variant's `pz`, first matching variant renders with its resolved props.

## Open questions

- **Real visitor facts source.** v1 hardcodes a sample object. The customer's production wiring needs to produce a flat object with the same keys — that's where the JSONPath flattening from the original rules will live.
- **Dynamic parameter interpolation.** The original `event.params.dynamic_parameters` (`first_name`, `appointment_date` placeholders inside the entry) — handled by whichever component renders the entry, reading from the same facts blob the algorithm uses. v1 has no opinion on this; v2 can add a macro-expansion helper.
- **Rule volume and change cadence.** Drives whether v2 needs `any`, nested groups, or fact-dictionary autocomplete in the editor.

## Out of scope for v1

- Server-side personalization (and any SSR-correct personalized HTML).
- JSONPath `path` field on conditions — flattened at the fact-load step instead, so leaf conditions read top-level fact keys directly.
- Custom operators beyond what json-rules-engine ships by default. Add via `engine.addOperator()` when needed.
- A/B testing layered on the rules.
