import { Input, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

const ParamTypePlacement: NextPage = () => {
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
    </>
  );
};

export default ParamTypePlacement;
