import { Button, Input, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import { useState } from 'react';

import { HowToUseDialogs } from '../../reference-lib/HowToUseDialogs';

// ngm usage - use data sources for instance config
const Settings: NextPage = () => {
  const { value, setValue } = useMeshLocation<'settings', { setting: string }>('settings');

  // note: integration settings write immediately to the database when setValue is called, so it
  // should be called on a submit action unlike other locations where the value is saved from an external action
  // and should be updated whenever the mesh app state changes.

  // note: setting a validation result when setting the value does not have a meaning when in settings location,
  // because this component can own its entire form, and thus perform its own validation internally

  const [settingValue, setSettingValue] = useState(value?.setting ?? '');

  return (
    <div>
      <p>Integration settings</p>
      <Input type="text" value={settingValue} onChange={(e) => setSettingValue(e.currentTarget.value)} />
      <Button
        type="submit"
        onClick={() => {
          setValue((previous) => ({ newValue: { ...previous, setting: settingValue } }));
        }}
      >
        Save Settings
      </Button>

      <HowToUseDialogs namedDialogName="settingsDialog" />
    </div>
  );
};

export default Settings;
