import { Input, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

import { HowToUseDialogs } from '../../reference-lib/HowToUseDialogs';
import { HowToUseValidation } from '../../reference-lib/HowToUseValidation';

/** A parameter type which renders a text box for its value and some example usage patterns */
const ParamTypeTextBox: NextPage = () => {
  const { value, setValue, metadata, isReadOnly } = useMeshLocation<'paramType', string>('paramType');

  return (
    <>
      <p>
        Param type (pid: {metadata.projectId}, param: {metadata.parameterDefinition.name}, type:{' '}
        {metadata.parameterDefinition.name})
      </p>
      <Input
        type="text"
        value={value ?? ''}
        onChange={(e) => setValue(() => ({ newValue: e.target.value }))}
        disabled={isReadOnly}
      />
      <HowToUseValidation />
      <HowToUseDialogs namedDialogName="ptEdit" />
    </>
  );
};

export default ParamTypeTextBox;
