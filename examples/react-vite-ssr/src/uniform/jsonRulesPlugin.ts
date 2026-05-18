import { ContextPlugin, PersonalizationSelectionAlgorithm, PersonalizedVariant } from "@uniformdev/context";
import { Engine } from "json-rules-engine";

export const VISITOR_FACTS_QUIRK = "visitor_facts";

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

function safeJson(s: string): Record<string, unknown> {
  try {
    const v = JSON.parse(s);
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

type MatchedVariant = PersonalizedVariant<RuleCriteria> & { control: boolean };

const algorithm: PersonalizationSelectionAlgorithm<RuleCriteria> = ({
  variations,
  context,
  take = 1,
}) => {
  const raw = context.quirks[VISITOR_FACTS_QUIRK];
  const facts = typeof raw === "string" ? safeJson(raw) : {};
  const matched: MatchedVariant[] = [];
  for (const v of variations) {
    if (!v.pz?.conditions) continue;
    if (evaluate(v.pz.conditions, facts)) {
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
