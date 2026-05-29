import { AddListButton, Button, DateEditor, Input, InputSelect, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import { useEffect } from 'react';

import { DEFAULT_FACTS, IntegrationSettings, getConfiguredFacts } from '../lib/jsonRulesSettings';

type Condition = {
  fact?: string;
  operator?: string;
  value?: unknown;
  all?: Condition[];
  any?: Condition[];
};

// The stored value is shaped by the platform's VariationMatchMetadata: it always
// has a `name` (managed by the parent UI) and may have a stale `crit` array from
// the default-algorithm variant initializer. Acknowledge both so we can clear
// `crit` — leaving it intact triggers the platform's "Please select a valid
// dimension" validator at publish time.
type RuleCriteria = {
  conditions?: Condition;
  crit?: unknown[];
};

const OPERATOR_OPTIONS = [
  { label: 'equals', value: 'equal' },
  { label: 'does not equal', value: 'notEqual' },
  { label: 'on or after', value: 'greaterThanInclusive' },
  { label: 'on or before', value: 'lessThanInclusive' },
  { label: 'is one of', value: 'in' },
];

function asString(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ');
  return v == null ? '' : String(v);
}

function parseValue(s: string, op: string): unknown {
  return op === 'in' ? s.split(',').map((x) => x.trim()).filter(Boolean) : s;
}

// Heuristic: a fact is a date-time fact if its name mentions "date" or "time".
// Covers the customer's sample (appointment_date, appointment_end_time,
// marketing_campaign_start_date, …). The date picker is only used for single
// values — the "is one of" operator still falls back to comma-separated text.
function isDateFact(fact: string | undefined): boolean {
  if (!fact) return false;
  const lower = fact.toLowerCase();
  return lower.includes('date') || lower.includes('time');
}

const RuleEditor: NextPage = () => {
  const { value, setValue, isReadOnly, metadata } = useMeshLocation<'personalizationCriteria', RuleCriteria>(
    'personalizationCriteria'
  );

  // Integration settings are typed `unknown` by the SDK; cast to our shape.
  // Falls back to the bundled defaults when settings haven't been configured.
  const facts = getConfiguredFacts(metadata.settings as IntegrationSettings | undefined);
  const factOptions = [
    { label: 'Select a fact…', value: '' },
    ...facts.map((f) => ({ label: f, value: f })),
  ];

  // Criteria may be missing or come from a different algorithm if the author switched
  // algorithms on the container — fall back to an empty row list in that case.
  const rows: Condition[] = Array.isArray(value?.conditions?.all) ? value!.conditions!.all! : [];

  // Clear the platform's default `crit` once when the editor mounts on a variant
  // that was created via the "personalize" action but never edited with this
  // algorithm. Without this, a default variant (no conditions) cannot be
  // published because the seeded `crit: [{ l: '', op: '>', r: 0 }]` fails the
  // dimension validator.
  useEffect(() => {
    if (!isReadOnly && Array.isArray(value?.crit) && value!.crit!.length > 0) {
      setValue((previous) => ({ newValue: { ...(previous ?? {}), crit: [] } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Always send `crit: []` so it overrides any stale legacy `crit` left from the
  // built-in algorithm. Our custom selection algorithm reads `conditions`, not
  // `crit`, but the platform validator still inspects `crit` on every variant.
  const update = (next: Condition[]) =>
    setValue(() => ({ newValue: { crit: [], conditions: { all: next } } }));

  const isDefault = rows.length === 0;

  return (
    <div>
      <h2>Variant matching conditions</h2>
      {isDefault ? (
        <p style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: 4 }}>
          <strong>Default variant.</strong> No conditions defined — this variant always matches.
          Place it last in the variant list so it is selected only when no other variant&apos;s
          conditions are met. Add a condition below to restrict it.
        </p>
      ) : (
        <p>
          <strong>ALL</strong> of the following conditions must be true for this variant to match:
        </p>
      )}

      {rows.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end' }}>
          <InputSelect
            label="Fact"
            name={`fact-${i}`}
            value={c.fact ?? ''}
            disabled={isReadOnly}
            options={factOptions}
            onChange={(e) => update(rows.map((r, j) => (j === i ? { ...r, fact: e.target.value } : r)))}
          />
          <InputSelect
            label="Operator"
            name={`operator-${i}`}
            value={c.operator ?? 'equal'}
            disabled={isReadOnly}
            options={OPERATOR_OPTIONS}
            onChange={(e) => {
              const op = e.target.value;
              update(
                rows.map((r, j) =>
                  j === i ? { ...r, operator: op, value: parseValue(asString(r.value), op) } : r
                )
              );
            }}
          />
          {isDateFact(c.fact) && c.operator !== 'in' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 500 }} htmlFor={`value-${i}`}>Value</label>
              <DateEditor
                ariaLabel="Value"
                editorType="date"
                filterFieldName={`value-${i}`}
                value={asString(c.value)}
                readOnly={isReadOnly}
                onChange={(next) =>
                  update(rows.map((r, j) => (j === i ? { ...r, value: next ?? '' } : r)))
                }
              />
            </div>
          ) : (
            <Input
              label={c.operator === 'in' ? 'Values (comma-separated)' : 'Value'}
              name={`value-${i}`}
              value={asString(c.value)}
              disabled={isReadOnly}
              onChange={(e) =>
                update(rows.map((r, j) => (j === i ? { ...r, value: parseValue(e.target.value, r.operator ?? 'equal') } : r)))
              }
            />
          )}
          <Button
            type="button"
            buttonType="secondary"
            disabled={isReadOnly}
            onClick={() => update(rows.filter((_, j) => j !== i))}
          >
            Remove
          </Button>
        </div>
      ))}
      <AddListButton
        buttonText="Add condition"
        disabled={isReadOnly}
        onButtonClick={() => update([...rows, { fact: facts[0] ?? '', operator: 'equal', value: '' }])}
      />

      {isDefault && facts.length === 0 && (
        <p style={{ marginTop: 16, color: '#9c5d00' }}>
          No facts are configured. Add facts on the integration settings page first.
          Defaults: {DEFAULT_FACTS.join(', ')}.
        </p>
      )}
    </div>
  );
};

export default RuleEditor;
