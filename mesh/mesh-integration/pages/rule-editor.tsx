import { AddListButton, Button, Input, InputSelect, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

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
  const { value, setValue, isReadOnly } = useMeshLocation<'personalizationCriteria', RuleCriteria>(
    'personalizationCriteria'
  );

  // Criteria may be missing or come from a different algorithm if the author switched
  // algorithms on the container — fall back to an empty row list in that case.
  const rows: Condition[] = Array.isArray(value?.conditions?.all) ? value!.conditions!.all! : [];

  const update = (next: Condition[]) => setValue(() => ({ newValue: { conditions: { all: next } } }));

  return (
    <div>
      {rows.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end' }}>
          <Input
            label="Fact"
            name={`fact-${i}`}
            value={c.fact ?? ''}
            disabled={isReadOnly}
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
        onButtonClick={() => update([...rows, { fact: '', operator: 'equal', value: '' }])}
      />
    </div>
  );
};

export default RuleEditor;
