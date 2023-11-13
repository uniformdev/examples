import {
  Button,
  createLocationValidator,
  DataTypeEditor,
  Heading,
  useMeshLocation,
  useVariables,
} from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import { useEffect } from 'react';

import { HowToEditRequests } from '../../reference-lib/HowToEditRequests';
import { HowToFetchData } from '../../reference-lib/HowToFetchData';
import { HowToUseDialogs } from '../../reference-lib/HowToUseDialogs';

// HTTP Fallback: note that if the data type location is removed from the mesh integration manifest,
// the UI from the standard 'HTTP Request' data connector will be used in its place automatically.
// This enables integration developers to produce fewer UIs if only looking to customize part of a data connector.

// We recommend using the <DataTypeEditor> wrapper when authoring data type UIs. This enables
// usage of the Request and Variables family of components and hooks to simplify interactions with the location
// data. See the storybook at https://mesh-design-system.netlify.app for more on Request and Variables.

// Secrets: Please note that data types are not intended to contain secret values such as authentication tokens.
// Values stored in data types are viewable by any user of your Uniform project with Canvas permissions.
// To store secret values, plase use Data Sources which are secured.

const DataType: NextPage = () => {
  const { setValue, metadata } = useMeshLocation('dataType');

  // to perform custom validation, one can intercept setValue calls
  const setValidatedValue = createLocationValidator(setValue, (newValue, currentResult) => {
    if (newValue.method === 'POST' && newValue.body !== 'valid') {
      return {
        isValid: false,
        validationMessage:
          'createLocationValidator example: this validator denies usage of the POST method unless the body equals "valid."',
      };
    }

    return currentResult ?? { isValid: true };
  });

  /*
   * Data Type name proposal: if you would like to propose a default name for new data types,
   * setting the special `custom.proposedName` property will signal to the UI that you are providing a custom
   * default name. Note that this only applies when creating new data types; as soon as it has been saved once, the proposed name
   * is ignored, and the existing name is always used.
   */
  useEffect(() => {
    setValue((prev) => ({
      newValue: { ...prev, custom: { ...prev.custom, proposedName: 'My Custom Proposed Name' } },
    }));
  }, [setValue]);

  return (
    <DataTypeEditor onChange={setValidatedValue}>
      <div>
        <p>
          Data type relative path (pid: {metadata.projectId}, connector: {metadata.dataSource.displayName},
          data source: {metadata.dataSource.displayName})
        </p>
        <HowToEditRequests />
        <HowToFetchData />
        <HowToUseDialogs namedDialogName="teDialog" />
        <HowToUseVariables />
      </div>
    </DataTypeEditor>
  );
};

export default DataType;

function HowToUseVariables() {
  const { dispatch, variables } = useVariables();

  return (
    <div>
      <Heading level={4}>Variables Example</Heading>

      <p>
        Variables let data types expose mutable values for authors to change on data resources. Within any
        URL, query parameter value, or header value you may refer to <code>$&#123;varName&#125;</code> to
        expand the variable value.
      </p>

      <p>Current Variables</p>
      <pre>{JSON.stringify(variables, null, 2)}</pre>

      <p>Setting your own variable</p>
      <Button
        onClick={() => {
          dispatch({
            type: 'set',
            variable: {
              name: 'myVariable',
              displayName: 'My Variable',
              // note that all variables have string values given their usage
              // in string based headers, params, and URLs
              default: 'woohoo',
              helpText: 'Help help this variable is being repressed',
              // this type is provided to the data resource editor, which can use it
              // to make decisions about how to render it
              type: 'myVarType',
            },
          });
        }}
      >
        Set My Variable
      </Button>
    </div>
  );
}
