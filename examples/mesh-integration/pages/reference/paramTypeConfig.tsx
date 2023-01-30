import { Input, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

import { HowToUseDialogs } from '../../reference-lib/HowToUseDialogs';

const ParamTypeConfig: NextPage = () => {
  const { value, setValue, metadata } = useMeshLocation<'paramTypeConfig', { config?: string }>(
    'paramTypeConfig'
  );

  return (
    <div>
      <p>Parameter type configuration location (pid: {metadata.projectId})</p>
      <Input
        label="Example of setting a parameter configuration key"
        type="text"
        value={value?.config ?? ''}
        onChange={(e) => setValue((previous) => ({ newValue: { ...previous, config: e.target.value } }))}
      />
      <HowToUseDialogs namedDialogName="ptConfigure" />
    </div>
  );
};

export default ParamTypeConfig;
