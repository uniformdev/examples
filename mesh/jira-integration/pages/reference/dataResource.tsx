/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createLocationValidator,
  DataResourceDynamicInputProvider,
  DataResourceVariablesList,
  useMeshLocation,
} from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

import { HowToFetchData } from '../../reference-lib/HowToFetchData';
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

/*
 * Data Resource name proposal: if you would like to propose a default name for new data resources of this archetype,
 * setting the special `proposedName` variable will signal to the UI that you are providing a custom
 * default name. Note that this only applies when creating new data resources; as soon as it has been saved once, the proposed name
 * is ignored, and the existing name is always used.

  useEffect(() => {
    setValue((prev) => ({ newValue: { ...prev, proposedName: 'My Custom Proposed Data Resource Name' } }));
  }, [setValue]);
 */

const DataResourceHelloWorld: NextPage = () => {
  const { setValue } = useMeshLocation('dataResource');

  return (
    <DataResourceDynamicInputProvider>
      <DataResourceVariablesList setVariables={setValue} />
      <HowToUseDialogs namedDialogName="deDialog" />
      <HowToUseValidation />
      <HowToFetchData />
    </DataResourceDynamicInputProvider>
  );
};

/**
 * Example showing how to write declarative validation.
 * This works well with libraries such as `zod`.
 */
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

/**
 * Example showing how to use the standard variables list component,
 * but render something custom for specific types of variables.
 *
 * The data source or data type editor would set the type of the variable.
 */
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

/** Example showing how to access and render variables without using the DataResourceVariablesList component */
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
