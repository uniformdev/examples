import { AddListButton, Button, Input, InputSelect, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

import { DEFAULT_FACTS, IntegrationSettings, getConfiguredFacts } from '../lib/jsonRulesSettings';

type Condition = {
  fact?: string;
  operator?: string;
  value?: unknown;
  all?: Condition[];
  any?: Condition[];
};

type RuleCriteria = { conditions: Condition };

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

  const update = (next: Condition[]) => setValue(() => ({ newValue: { conditions: { all: next } } }));

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
          <Input
            label={c.operator === 'in' ? 'Values (comma-separated)' : 'Value'}
            name={`value-${i}`}
            value={asString(c.value)}
            disabled={isReadOnly}
            onChange={(e) =>
              update(rows.map((r, j) => (j === i ? { ...r, value: parseValue(e.target.value, r.operator ?? 'equal') } : r)))
            }
          />
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
