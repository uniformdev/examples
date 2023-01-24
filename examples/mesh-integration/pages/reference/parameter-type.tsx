import { Input, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

import { HowToUseDialogs } from '../../reference-lib/HowToUseDialogs';

const ParamType: NextPage = () => {
  const { value, setValue, metadata } = useMeshLocation<'paramType', string>('paramType');

  return (
    <div>
      <p>
        Param type (pid: {metadata.projectId}, param: {metadata.parameterDefinition.name}, type:{' '}
        {metadata.parameterDefinition.name})
      </p>
      <Input
        type="text"
        value={value ?? ''}
        onChange={(e) => setValue(() => ({ newValue: e.target.value }))}
      />
      <HowToUseDialogs namedDialogName="ptEdit" />
    </div>
  );
};

export default ParamType;
