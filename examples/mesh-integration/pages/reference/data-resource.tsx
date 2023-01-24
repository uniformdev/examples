/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createLocationValidator,
  DataResourceVariablesList,
  useMeshLocation,
} from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

import { HowToUseDialogs } from '../../reference-lib/HowToUseDialogs';
import { HowToUseValidation } from '../../reference-lib/HowToUseValidation';

/*
 * Data Resource UI demonstration
 * This location is rendered when editing a Data Resource of to the Data Archetype
 * the location is registered under the integration's manifest JSON.
 */

// HTTP Fallback: note that if the data resource location is removed from the mesh integration manifest,
// the UI from the standard 'HTTP Request' data connector will be used in its place automatically.
// This enables integration developers to produce fewer UIs if only looking to customize part of a data connector.

const DataResourceHelloWorld: NextPage = () => {
  const { setValue } = useMeshLocation('dataResource');

  return (
    <div>
      <DataResourceVariablesList setVariables={setValue} />
      <HowToUseDialogs namedDialogName="deDialog" />
      <HowToUseValidation />
    </div>
  );
};

// default vars vs custom
// custom vartype editors
// fetching data types
// readonly
const DataResourceCustomValidation: NextPage = () => {
  const { setValue } = useMeshLocation('dataResource');

  // to perform validation, one can intercept setValue calls
  const setValidatedValue = createLocationValidator(setValue, (newValue, currentResult) => {
    if (newValue.evil === 'true') {
      return { isValid: false, validationMessage: 'No being evil' };
    }

    return currentResult ?? { isValid: true };
  });

  return (
    <div>
      <DataResourceVariablesList setVariables={setValidatedValue} />
    </div>
  );
};

const DataResourceTypeBasedVariables: NextPage = () => {
  const { setValue } = useMeshLocation('dataResource');

  return (
    <div>
      <DataResourceVariablesList
        setVariables={setValue}
        typeRenderers={{
          // if you define variables in data type UIs, you may customize their UI while still using the default DataResourceVariablesList
          // for other variable types like so
          myVarType: ({ value, setValue, definition }) => (
            <div>
              This is a variable where the `type` in the variable definition (from the data type or data
              source) is set to `myVarType`. Its value is {value}. Help text: {definition.helpText}
            </div>
          ),
        }}
      />
    </div>
  );
};

const DataResourceCustom: NextPage = () => {
  const { value, metadata } = useMeshLocation('dataResource');

  return (
    // the DataResourceVariablesList is optional to use if you want to render completely custom UI
    // that it is not compatible with. Variable definitions can be read from metadata.
    <div>
      {Object.entries(value).map(([varName, varValue]) => (
        <div key={varName}>
          {varName} = {varValue} (Display name: {metadata.dataType.variables?.[varName].displayName})
        </div>
      ))}
    </div>
  );
};

export default DataResourceHelloWorld;
