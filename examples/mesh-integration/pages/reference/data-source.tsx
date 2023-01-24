import {
  createLocationValidator,
  DataSourceEditor,
  RequestUrl,
  RequestUrlInput,
  useMeshLocation,
  useRequest,
} from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

import { HowToUseDialogs } from '../../reference-lib/HowToUseDialogs';

/*
 * Data Source UI demonstration
 * This location is rendered when editing a Data Source connected to the Data Connector
 * registered in the integration's manifest JSON.
 */

// HTTP Fallback: note that if the data source location is removed from the mesh integration manifest,
// the UI from the standard 'HTTP Request' data connector will be used in its place automatically.
// This enables integration developers to produce fewer UIs if only looking to customize part of a data connector.

// Secrets: query string and header values, as well as any variable values on a data source are encrypted secrets.
// Only users with manage data source or admin permissions may decrypt secrets. All others can use them via delegation
// when fetching data types, without seeing the secret values.

const DataSource: NextPage = () => {
  const { setValue, metadata } = useMeshLocation('dataSource');

  // to perform custom validation, one can intercept setValue calls
  const setValidatedValue = createLocationValidator(setValue, (newValue, currentResult) => {
    if (newValue.baseUrl.startsWith('ftp://')) {
      return { isValid: false, validationMessage: 'Its not 1996.' };
    }

    return currentResult ?? { isValid: true };
  });

  return (
    <DataSourceEditor onChange={setValidatedValue}>
      <div>
        <p>Data Source Base URL (pid: {metadata.projectId})</p>
        <RequestUrlInput />

        <QueryStringParamEditor paramName="q" />

        <p>Current full URL of data source</p>
        <RequestUrl />

        <HowToUseDialogs namedDialogName="dceDialog" />
      </div>
    </DataSourceEditor>
  );
};

export default DataSource;

// planning to make this simpler
function QueryStringParamEditor({ paramName }: { paramName: string }) {
  const { request, dispatch } = useRequest();

  // we could use some helpers so we don't have to also find array indices...
  // useQueryString? useHeader? (for the common single key use-case, not for multi-valued)
  const paramIndex = request.parameters.findIndex((f) => f.key === paramName);

  return (
    <div>
      <label htmlFor="qs">Text box sets query string parameter (q)</label>
      <br />
      <input
        type="text"
        id="qs"
        value={request.parameters[paramIndex]?.value ?? ''}
        onChange={(e) =>
          dispatch({
            type: 'updateParameter',
            parameter: { key: paramName, value: e.currentTarget.value },
            index: paramIndex >= 0 ? paramIndex : undefined,
          })
        }
      />
    </div>
  );
}
