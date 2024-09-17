import { Input, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

/**
 * This parameter type contains `allowedPlacement` property in the mesh manifest 
 * 
 * `allowedPlacement` defines where the parameter can be used.
 *
 * Possible values: 'parameter', 'field'.
 *
 * If the value contains 'parameter', the parameter can be used as a Component's parameter.
 * If the value contains 'field', the parameter can be used as an Entry's field.
 *
 * Default: '["parameter"]'
 */

const ParamTypePlacement: NextPage = () => {
  const { value, setValue, isReadOnly } = useMeshLocation<'paramType', string>('paramType');

  return (
    <Input
    type="text"
    value={value ?? ''}
    onChange={(e) => setValue(() => ({ newValue: e.target.value }))}
    disabled={isReadOnly}
  />
  );
};

export default ParamTypePlacement;
