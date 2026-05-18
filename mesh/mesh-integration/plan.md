# Plan: JSON Rules Engine personalization — Mesh integration side

This Mesh integration adds a custom personalization-criteria editor to the Uniform dashboard so authors can express rules in [json-rules-engine](https://github.com/CacheControl/json-rules-engine) format against per-visitor facts. The matching runtime lives in the customer app — see the companion plan in [`examples/react-vite-ssr/plan.md`](../../examples/react-vite-ssr/plan.md).

## v1 editor UI scope

The stored data is json-rules-engine's native condition format (recursive `all`/`any` groups, leaf `{ fact, operator, value }` nodes, any operator name the library or a custom operator supports). The v1 editor UI surfaces only what the customer's sample rules need:

- A single top-level `conditions.all` group; no UI for `any` or nesting.
- Five operators in the dropdown: `equal`, `notEqual`, `greaterThanInclusive`, `lessThanInclusive`, `in`.
- Values typed as strings; for `in`, comma-separated input splits into an array.

The runtime accepts any valid json-rules-engine condition tree, so future editor versions can expand the UI (nested groups, more operators, fact-dictionary autocomplete) without runtime changes.

Out of scope for v1: editor UI for nested groups or `any`, additional operators, fact-dictionary autocomplete, live "would this match?" preview, validation against a fact schema.

## What this side ships

- A new entry in `mesh-manifest.json` under `canvas.personalization.selectionAlgorithms` registering the algorithm key + criteria editor URL.
- A new Next.js page `pages/rule-editor.tsx` rendered inside the variant editor iframe in the Uniform dashboard. Reads/writes `variant.pz` via `useMeshLocation('personalizationCriteria')`.

The integration ships only the authoring UI — it does not run the algorithm.

## Contract with the runtime

Two things only:

1. **Algorithm key**: the string `"json-rules-engine"` in `mesh-manifest.json` must match the key registered in the runtime's `ContextPlugin.personalizationSelectionAlgorithms`. Tied by string equality.
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

The editor's v1 UI only writes a subset of this shape (top-level `conditions.all` of leaf rows), but the storage contract is the full json-rules-engine condition tree. The runtime evaluates whatever the editor writes.

## Implementation steps

### 1. Register the algorithm in `mesh-manifest.json`

Under `canvas.personalization.selectionAlgorithms`, add:

```json
{
  "json-rules-engine": {
    "displayName": "Custom Rules",
    "description": "Match a variant when conditions on visitor facts hold (date and value comparisons).",
    "criteriaEditorUrl": "/rule-editor"
  }
}
```

`mesh-manifest.reference.json` in this folder is the canonical example for the surrounding structure — see its `personalization.selectionAlgorithms` block.

### 2. Build the rule editor page

Create `pages/rule-editor.tsx`. The UI is intentionally minimal: a list of rows; each row has three fields and a remove button; a single button at the bottom to add another row.

**No custom UI primitives.** Use `@uniformdev/mesh-sdk-react` exports as-is (they re-export `@uniformdev/design-system` components). The day-of-week reference example in this repo (`personalization/dayOfWeekPersonalizationAlgorithm.ts` + its corresponding page) uses `InputSelect` + `useMeshLocation` exactly this way — same pattern, more rows.

```tsx
import {
  Input, InputSelect, Button, AddListButton,
  useMeshLocation,
} from '@uniformdev/mesh-sdk-react';

// json-rules-engine condition shape. The v1 UI only ever renders/writes the
// flat `conditions.all` of leaf rows, but the storage type is the full tree.
type Condition = {
  fact?: string;
  operator?: string;
  value?: unknown;
  all?: Condition[];
  any?: Condition[];
};

type RuleCriteria = { conditions: Condition };

const OPERATOR_OPTIONS = [
  { label: 'equals',         value: 'equal' },
  { label: 'does not equal', value: 'notEqual' },
  { label: 'on or after',    value: 'greaterThanInclusive' },
  { label: 'on or before',   value: 'lessThanInclusive' },
  { label: 'is one of',      value: 'in' },
];

function asString(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ');
  return v == null ? '' : String(v);
}
function parseValue(s: string, op: string): unknown {
  return op === 'in' ? s.split(',').map((x) => x.trim()).filter(Boolean) : s;
}

export default function RuleEditor() {
  const { value, setValue, isReadOnly } = useMeshLocation<
    'personalizationCriteria',
    RuleCriteria
  >('personalizationCriteria');

  // Defensive: criteria may be missing or come from a different algorithm if the
  // author switched algorithms on the container.
  const rows: Condition[] = Array.isArray(value?.conditions?.all)
    ? value!.conditions!.all!
    : [];

  const update = (next: Condition[]) =>
    setValue(() => ({ newValue: { conditions: { all: next } } }));

  return (
    <div>
      {rows.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <Input
            label="Fact"
            value={c.fact ?? ''}
            disabled={isReadOnly}
            onChange={(e) =>
              update(rows.map((r, j) =>
                j === i ? { ...r, fact: e.target.value } : r))}
          />
          <InputSelect
            label="Operator"
            value={c.operator ?? 'equal'}
            disabled={isReadOnly}
            options={OPERATOR_OPTIONS}
            onChange={(e) => {
              const op = e.target.value;
              update(rows.map((r, j) =>
                j === i ? { ...r, operator: op, value: parseValue(asString(r.value), op) } : r));
            }}
          />
          <Input
            label={c.operator === 'in' ? 'Values (comma-separated)' : 'Value'}
            value={asString(c.value)}
            disabled={isReadOnly}
            onChange={(e) =>
              update(rows.map((r, j) =>
                j === i ? { ...r, value: parseValue(e.target.value, r.operator ?? 'equal') } : r))}
          />
          <Button
            type="button"
            disabled={isReadOnly}
            onClick={() => update(rows.filter((_, j) => j !== i))}
          >
            Remove
          </Button>
        </div>
      ))}
      <AddListButton
        disabled={isReadOnly}
        onClick={() =>
          update([...rows, { fact: '', operator: 'equal', value: '' }])
        }
      >
        Add condition
      </AddListButton>
    </div>
  );
}
```

That's the whole UI. No date picker, no per-operator input type — authors type ISO dates as strings ("2026-06-01"). The runtime coerces ISO strings to numbers for the `*ThanInclusive` operators (see runtime plan §3). Keeping it text-only avoids browser date-picker inconsistencies in the iframe and matches what the customer is already storing in their JSON rules.

### 3. Deploy

The starter scripts handle this:

```bash
npm run register-to-team       # publish integration definition
npm run install-to-project     # enable it on the target project
```

Host the Next.js app somewhere reachable from the Uniform dashboard (Vercel works). The hosted URL becomes the integration's `baseLocationUrl`.

## Authoring flow once deployed

1. Author opens a composition and picks a slot for personalized content.
2. Adds a personalization variant on that slot. Algorithm dropdown → "Custom Rules".
3. The variant editor panel iframes this Mesh app's `/rule-editor`.
4. Author defines conditions, e.g. `fact: order_appointment_date`, `operator: on or after`, `value: 2026-06-01`.
5. On the same variant, the author drops any existing component and configures its parameters through the standard Uniform pickers. This editor has no role in parameter binding.
6. Publishes.

## Reference files in this repo

- `mesh-manifest.reference.json` — full feature inventory; see the `personalization.selectionAlgorithms` block.
- `personalization/dayOfWeekPersonalizationAlgorithm.ts` — the reference algorithm + its corresponding criteria editor page is the structural template for the runtime side (and validates the `useMeshLocation` + `InputSelect` pattern used above).

## Out of scope (here)

- The runtime evaluation of `variant.pz` against facts — runtime plan.
- Where visitor facts come from — runtime plan.
- Component parameter binding (data resources, content sources) — handled by Uniform's standard pickers, not by this editor.
