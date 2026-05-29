import { ContextPlugin, PersonalizationSelectionAlgorithm, PersonalizedVariant } from "@uniformdev/context";
import { Engine } from "json-rules-engine";

// Visitor facts live as individual Uniform quirks (one per fact). Storing them
// flat instead of in a single JSON blob means each fact is also a top-level
// entry in the `ufvdqk` cookie / dev tools panel, and any server-side code
// that reads quirks can pull e.g. `quirks.first_name` directly.

// Sync surface of json-rules-engine's Operator + its operators registry.
// Both are runtime public API but the published types don't expose `operators`
// on Engine or `evaluate` on Operator — declare them here.
interface SyncOperator {
  evaluate(lhs: unknown, rhs: unknown): boolean;
}
interface OperatorRegistry {
  get(name: string): SyncOperator | undefined;
}

// Single Engine instance — used only as a registry of operators. We never call
// engine.run() because it's async; instead we dispatch through engine.operators
// directly (sync). Add custom operators here when needed:
//   engine.addOperator('dateGte', (lhs, rhs) => new Date(lhs) >= new Date(rhs))
const engine = new Engine() as Engine & { operators: OperatorRegistry };

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
  const op = engine.operators.get(c.operator);
  if (!op) return false;
  return op.evaluate(facts[c.fact], c.value);
}

type MatchedVariant = PersonalizedVariant<RuleCriteria> & { control: boolean };

// A variant with no conditions (or an empty top-level `all: []`) is treated
// as a default — it always matches. Place such variants last in the variant
// list so they are selected only when no other variant matched first.
function isDefaultVariant(conditions: Condition | undefined): boolean {
  if (!conditions) return true;
  if (
    Array.isArray(conditions.all) &&
    conditions.all.length === 0 &&
    !conditions.any &&
    !conditions.fact
  ) {
    return true;
  }
  return false;
}

const algorithm: PersonalizationSelectionAlgorithm<RuleCriteria> = ({
  variations,
  context,
  take = 1,
}) => {
  // Each quirk is a fact; rule conditions reference them by name. Cast to
  // unknown so the operator dispatch can accept arbitrary value types (string
  // dates, numerics-as-strings, etc.) without further coercion.
  const facts = context.quirks as Record<string, unknown>;
  const matched: MatchedVariant[] = [];
  for (const v of variations) {
    const conditions = v.pz?.conditions;
    const matches = isDefaultVariant(conditions) || evaluate(conditions!, facts);
    if (matches) {
      matched.push({ ...v, control: false });
      if (matched.length >= take) break;
    }
  }
  return { personalized: matched.length > 0, variations: matched };
};

export const jsonRulesPlugin: ContextPlugin = {
  personalizationSelectionAlgorithms: {
    "json-rules-engine": algorithm,
  },
};
