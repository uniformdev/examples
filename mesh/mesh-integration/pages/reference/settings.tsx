import { Button, hasPermissions, hasRole, Input, useMeshLocation } from '@uniformdev/mesh-sdk-react';
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
      <h1>Integration settings</h1>
      <Input type="text" value={settingValue} onChange={(e) => setSettingValue(e.currentTarget.value)} />
      <Button
        type="submit"
        onClick={() => {
          setValue((previous) => ({ newValue: { ...previous, setting: settingValue } }));
        }}
      >
        Save Settings
      </Button>

      <HowToUseUserMetadata />
      <HowToUseDialogs namedDialogName="settingsDialog" />
    </div>
  );
};

export const HowToUseUserMetadata = () => {
  // Every location has a metadata object that contains information about the current user
  // and the current project. This can be used to determine if the user has permissions to
  // perform certain actions, or to display information about the user any other way.
  const { metadata } = useMeshLocation();

  return (
    <div>
      <p>Am I admin? {metadata.user.isAdmin ? 'YES' : 'NO'}</p>
      <p>
        Do I have permissions to Manage Data Sources and Data Types?{' '}
        {hasPermissions(['DATA_SOURCES_MANAGE', 'DATA_TYPES_MANAGE'], metadata.user) ? 'YES' : 'NO'}
      </p>
      <p>Do I have an Editor Role? {hasRole('Editor', metadata.user) ? 'YES' : 'NO'}</p>
      <p>My email is {metadata.user.email}</p>
      <p>My Profile ID is {metadata.user.id}</p>
    </div>
  );
};

export default Settings;
