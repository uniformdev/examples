import { AddListButton, Button, Input, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import { useState } from 'react';

import { DEFAULT_FACTS, IntegrationSettings } from '../lib/jsonRulesSettings';

const Settings: NextPage = () => {
  const { value, setValue } = useMeshLocation<'settings', IntegrationSettings>('settings');

  // Settings location writes on submit, so manage form state locally and only
  // call setValue when the user clicks Save.
  const initialFacts = Array.isArray(value?.facts) && value!.facts!.length > 0 ? value!.facts! : DEFAULT_FACTS;
  const [facts, setFacts] = useState<string[]>(initialFacts);

  const updateFact = (index: number, next: string) =>
    setFacts(facts.map((f, i) => (i === index ? next : f)));
  const removeFact = (index: number) => setFacts(facts.filter((_, i) => i !== index));
  const addFact = () => setFacts([...facts, '']);

  return (
    <div>
      <h1>Custom personalization — settings</h1>
      <p>
        Define the visitor facts available in the rule editor. Each fact appears in the &quot;Fact&quot; dropdown
        when authors build personalization rules. The runtime evaluates rules against a quirk that holds
        the visitor&apos;s current values for these facts.
      </p>

      <h2>Available facts</h2>
      {facts.map((fact, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end' }}>
          <Input
            label={`Fact ${i + 1}`}
            name={`fact-${i}`}
            value={fact}
            onChange={(e) => updateFact(i, e.target.value)}
          />
          <Button type="button" buttonType="secondary" onClick={() => removeFact(i)}>
            Remove
          </Button>
        </div>
      ))}
      <AddListButton buttonText="Add fact" onButtonClick={addFact} />

      <div style={{ marginTop: 24 }}>
        <Button
          type="submit"
          onClick={() => {
            const cleaned = facts.map((f) => f.trim()).filter(Boolean);
            setValue((previous) => ({ newValue: { ...previous, facts: cleaned } }));
          }}
        >
          Save settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
