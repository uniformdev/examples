import {
  Button,
  createLocationValidator,
  DataTypeEditor,
  Label,
  RequestHeaders,
  RequestMethodSelect,
  RequestParameters,
  RequestUrl,
  RequestUrlInput,
  useMeshLocation,
} from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

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
  const { setValue, metadata, getDataResource } = useMeshLocation('dataType');

  // to perform custom validation, one can intercept setValue calls
  const setValidatedValue = createLocationValidator(setValue, (newValue, currentResult) => {
    if (newValue.method === 'POST') {
      return { isValid: false, validationMessage: 'No POSTing allowed!' };
    }

    return currentResult ?? { isValid: true };
  });

  return (
    <DataTypeEditor onChange={setValidatedValue}>
      <div>
        <p>
          Data type relative path (pid: {metadata.projectId}, connector: {metadata.dataSource.displayName},
          data source: {metadata.dataSource.displayName})
        </p>
        <RequestMethodSelect label="Method" />
        <RequestUrlInput />
        <div>
          Effective URL: <RequestUrl />
        </div>
        <Label>Query Parameters</Label>
        <RequestParameters />
        <Label>Headers</Label>
        <RequestHeaders />
        <Button
          onClick={() => {
            // fetching a resource from the configured data source's API
            // can be done with this function, for example to query a list to power the UI
            // NOTE: you cannot escape the configured base URL here (i.e. no ../)
            getDataResource({
              method: 'GET',
              path: '/pokemon/pikachu',
            }) // eslint-disable-next-line no-console
              .then((r) => console.log('pika', r))
              // eslint-disable-next-line no-console
              .catch((e) => console.error('error fetching data resource', e));
          }}
        >
          Fetch /pokemon/pikachu from the data source API
        </Button>
        <HowToUseDialogs namedDialogName="teDialog" />
      </div>
    </DataTypeEditor>
  );
};

export default DataType;
