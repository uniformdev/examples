import {
  Button,
  createLocationValidator,
  DataResourceVariablesList,
  DataSourceEditor,
  DataTypeEditor,
  Input,
  Label,
  RequestHeaders,
  RequestMethodSelect,
  RequestParameters,
  RequestUrl,
  RequestUrlInput,
  useMeshLocation,
  useUniformMeshSdk,
} from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import { useState } from 'react';

const SinglePageMeshApp: NextPage = () => {
  const yaMesh = useMeshLocation();

  // we are rendering inside a dialog, either as a popout of the editor UI,
  // or else a named dialog declared for a location. If it's a popout, we want to do nothing
  // (so we render the editor normally in the popout). For a named location, we intercept to show
  // a custom dialog component.
  if (yaMesh.dialogContext?.dialogLocation) {
    return <CustomDialogLocation />;
  }

  // routing through single route (set all relative URLs to `/`)
  // (easier setup if not using metaframework, but less efficient code splitting)
  // multiple routes is also still possible - the route component,
  // in that case, is the component returned from this if-else chain
  if (yaMesh.type === 'dataSource') {
    return <DataSource />;
  } else if (yaMesh.type === 'dataType') {
    return <DataType />;
  } else if (yaMesh.type === 'dataResource') {
    return <DataResource />;
  } else if (yaMesh.type === 'paramType') {
    return <ParamType />;
  } else if (yaMesh.type === 'paramTypeConfig') {
    return <ParamTypeConfig />;
  } else if (yaMesh.type === 'settings') {
    return <IntegrationSettings />;
  }

  return (
    <div>
      <h1>Unknown mesh location {JSON.stringify(yaMesh, null, 2)}</h1>
    </div>
  );
};

export default SinglePageMeshApp;

function CustomDialogLocation() {
  const location = useMeshLocation();

  if (!location.dialogContext?.dialogLocation) {
    return null;
  }

  // custom dialog location (i.e. `locations.settings.locations.foo`)
  return (
    <div>
      <h1>Custom Dialog Location</h1>
      <p>Parent location that spawned the dialog: {location.type}</p>
      <p>Dialog location key opened: {location.dialogContext.dialogLocation}</p>
      <div>
        Dialog params: <pre>{JSON.stringify(location.dialogContext.params, null, 2)}</pre>
      </div>

      <Button
        onClick={() => {
          // the modal is dismissed when we return a dialog return value
          location.dialogContext?.returnDialogValue({ success: true });
        }}
      >
        Close Dialog
      </Button>
    </div>
  );
}

function DataSource() {
  const { setValue, metadata } = useMeshLocation('dataSource');

  return (
    <DataSourceEditor onChange={setValue}>
      <div>
        <p>Data Source Base URL (pid: {metadata.projectId})</p>
        <RequestUrlInput />

        <DialogDemo namedDialogName="dceDialog" />
      </div>
    </DataSourceEditor>
  );
}

function DataType() {
  const { setValue, metadata, getDataResource } = useMeshLocation('dataType');

  // to perform validation, one can intercept setValue calls
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
        <DialogDemo namedDialogName="teDialog" />
      </div>
    </DataTypeEditor>
  );
}

function DataResource() {
  const { setValue } = useMeshLocation('dataTypeInstance');

  return (
    <div>
      <DataResourceVariablesList setVariables={setValue} />
      <DialogDemo namedDialogName="deDialog" />
    </div>
  );
}

function ParamType() {
  const { value, setValue, metadata } = useMeshLocation<'paramType', string>('paramType');

  return (
    <div>
      <p>
        Param type (pid: {metadata.projectId}, param: {metadata.parameterDefinition.name}, type:{' '}
        {metadata.parameterDefinition.name})
      </p>
      <Input
        type="text"
        value={value ?? ''}
        onChange={(e) => setValue(() => ({ newValue: e.target.value }))}
      />
      <DialogDemo namedDialogName="ptEdit" />
    </div>
  );
}

function ParamTypeConfig() {
  const { value, setValue, metadata } = useMeshLocation<'paramTypeConfig', { config?: string }>(
    'paramTypeConfig'
  );

  return (
    <div>
      <p>Param type config (pid: {metadata.projectId})</p>
      <Input
        type="text"
        value={value?.config ?? ''}
        onChange={(e) => setValue((previous) => ({ newValue: { ...previous, config: e.target.value } }))}
      />
      <DialogDemo namedDialogName="ptConfigure" />
    </div>
  );
}

function IntegrationSettings() {
  // note: integration settings write immediately to the database when setValue is called, so it
  // should be called on a submit action unlike other locations where the value is saved from an external action
  // and should be updated whenever the mesh app state changes.

  // note: setting a validation result when setting the value does not have a meaning when in settings location,
  // because this component can own its entire form, and thus perform its own validation internally

  const { value, setValue } = useMeshLocation<'settings', { setting: string }>('settings');

  const [settingValue, setSettingValue] = useState(value.setting);

  return (
    <div>
      <p>Integration settings</p>
      <Input type="text" value={settingValue} onChange={(e) => setSettingValue(e.currentTarget.value)} />
      <Button
        type="submit"
        onClick={() => {
          setValue((previous) => ({ newValue: { ...previous, setting: settingValue } }));
        }}
      >
        Save Settings
      </Button>

      <DialogDemo namedDialogName="settingsDialog" />
    </div>
  );
}

function DialogDemo({ namedDialogName }: { namedDialogName: string }) {
  const sdk = useUniformMeshSdk();
  const location = useMeshLocation();

  const [currentDialogResult, setCurrentDialogResult] = useState<string>('No dialog result yet.');

  return (
    <div>
      <p>
        <strong>Dialog Demo</strong>
      </p>
      <div>
        {location.dialogContext ? (
          `Currently in a dialog, hiding dialog demo options (dialog id: ${location.dialogContext.dialogId}). NOTE: if used in a dialog, the current location must call dialogContext.returnDialogValue() once instead of binding reactively to setValue(). If you type in the text box above it will dismiss after one character is typed due to this limitation.`
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button
              onClick={async () => {
                const result = await sdk.openConfirmationDialog({
                  titleText: 'Demo Confirmation',
                  bodyText: 'Are you sure you want to demo things?',
                });

                if (result?.value === 'confirm') {
                  setCurrentDialogResult('You confirmed the confirm dialog');
                }

                if (result?.value === 'cancel') {
                  setCurrentDialogResult('You canceled the confirm dialog');
                }
              }}
            >
              Open Confirm Dialog
            </Button>
            <Button
              onClick={async () => {
                // when handling a popout for a specific location you can get better typings here through generics,
                // i.e. sdk.openCurrentLocationDialog<'paramType', { paramTypeValueExample: boolean }, { popoutParamsExample: string }>({ options: { params: { popoutParamsExample: 'hello' } } });
                // gets you typed dialog result and params. For locations with specific types, like `dataType`, only the one generic is required i.e.
                // sdk.openCurrentLocationDialog<'dataType'>().result.value is DataTypeValue
                const result = await sdk.openCurrentLocationDialog();

                sdk.getCurrentLocation().setValue(result?.value as any);

                setCurrentDialogResult(
                  `Updated parent value from current location dialog. \n\n${JSON.stringify(
                    result?.value,
                    null,
                    2
                  )}`
                );
              }}
            >
              Popout this location in a dialog
            </Button>
            <Button
              onClick={async () => {
                const result = await sdk.openLocationDialog({
                  locationKey: namedDialogName,
                  options: { params: { paramFromOpener: 'hello world' } },
                });

                setCurrentDialogResult(
                  `Received result from named dialog. \n\n${JSON.stringify(result?.value, null, 2)}`
                );
              }}
            >
              Open named {namedDialogName} dialog URL
            </Button>
            <div>
              <p>Current Dialog Result</p>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{currentDialogResult}</pre>
            </div>
          </div>
        )}
      </div>
      <p>
        <strong>Validation Demo</strong>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button
          onClick={async () => {
            // any here is just because we do not know the location type that we are in;
            // this demo component is used on all locations. Echoing the current value back causes no changes.
            await location.setValue((previous) => ({
              newValue: previous,
              options: {
                isValid: false,
                validationMessage: 'Sample failed validation message when setting value',
              },
            }));
          }}
        >
          Report Validation Error
        </Button>
        <Button
          onClick={async () => {
            // any here is just because we do not know the location type that we are in;
            // this demo component is used on all locations. Echoing the current value back causes no changes.
            await location.setValue((previous) => ({
              newValue: previous,
              options: {
                isValid: true,
              },
            }));
          }}
        >
          Clear Validation Error
        </Button>
      </div>
    </div>
  );
}
