import {
  ParameterConnectOptions,
  ParameterVariables,
  ParamTypeDynamicDataProvider,
  useMeshLocation,
} from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

/**
 * this param type has a primitive-value (string) that can be connected to Uniform's dynamic tokens
 */
const ParamTypeTextWithDynamicTokens: NextPage = () => {
  const { value, setValue, isReadOnly } = useMeshLocation<'paramType', string>('paramType');

  return (
    <ParamTypeDynamicDataProvider>
      <ParameterVariables<ParameterConnectOptions>
        value={value}
        onChange={(newValue) => setValue(() => ({ newValue: newValue ?? '' }))}
        disabled={isReadOnly}
        showAddVariableMenuOption="Insert dynamic token"
        getEditorContext={() => ({ connectsTo: ['string'] })}
        // if you want to use a different component when there are no variable values, you can use the inputWhenNoVariables prop here
        // to define the component to render in that case.
      />
    </ParamTypeDynamicDataProvider>
  );
};

export default ParamTypeTextWithDynamicTokens;
