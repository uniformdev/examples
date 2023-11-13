import {
  Callout,
  createLocationValidator,
  DataSourceEditor,
  useMeshLocation,
} from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import { useEffect } from 'react';

import { HowToEditRequests } from '../../reference-lib/HowToEditRequests';
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

/*
 * Data Source name proposal: if you would like to propose a default name for new data sources,
 * setting the special `custom.proposedName` property will signal to the UI that you are providing a custom
 * default name. Note that this only applies when creating new data sources; as soon as it has been saved once, the proposed name
 * is ignored, and the existing name is always used.

  useEffect(() => {
    setValue((prev) => ({
      newValue: { ...prev, custom: { ...prev.custom, proposedName: 'My Custom Proposed Name' } },
    }));
  }, [setValue]);
 */

const DataSource: NextPage = () => {
  const { setValue } = useMeshLocation('dataSource');

  // In most cases some of the attributes of the location are not user-editable
  // we can use an effect to ensure that those attributes are always set up correctly
  useEffect(() => {
    setValue((currentValue) => ({
      newValue: {
        ...currentValue,
        baseUrl: 'https://pokeapi.co/api/v2',
        custom: {
          proposedName: 'PokéAPI',
        },
      },
    }));
  }, [setValue]);
  // to perform custom validation, one can intercept setValue calls
  const setValidatedValue = createLocationValidator(setValue, (newValue, currentResult) => {
    if (newValue.baseUrl.startsWith('ftp://')) {
      return {
        isValid: false,
        validationMessage:
          'createLocationValidator example: ftp protocol is not allowed. It is not 1996 any more.',
      };
    }
    setValue((currentValue) => ({
      newValue: { ...currentValue, baseUrl: newValue.baseUrl },
    }));
    return currentResult ?? { isValid: true };
  });

  return (
    <DataSourceEditor onChange={setValidatedValue}>
      <div>
        <Callout type="tip">
          Dev tip: The URL is being set each time the editor loads with an effect, to simulate a UI where the
          URL is fixed to a specific API and cannot be edited. Remove the effect code before changing the URL
          below, or it will revert on each load.
        </Callout>

        <HowToEditRequests />

        <HowToUseDialogs namedDialogName="dceDialog" />
      </div>
    </DataSourceEditor>
  );
};

export default DataSource;
