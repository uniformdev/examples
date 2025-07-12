import { Fieldset, VerticalRhythm } from '@uniformdev/design-system';
import { Button, useMeshLocation, useUniformMeshSdk } from '@uniformdev/mesh-sdk-react';
import { useState } from 'react';

// Named Dialogs
// Locations in the manifest have a parallel `locations` property which lets them define dialogs that open
// outside their UI. These are useful for example to gain additional screen real estate when building
// complex editors. These dialogs are invoked by their key (see HowToUseDialogs.tsx) and may return results to the main UI.
// For example:
/*
"typeEditorUrl": "/reference/data-type",
// the type editor decleares a named dialog called 'teDialog'
// hosted at /reference/data-type/named-dialog (relative to parent location)
"typeEditorLocations": {
  "teDialog": {
    "url": "/named-dialog"
  }
},
*/

// Note that normally one would have a unique named dialog route/component for each dialog.
// The playground uses a single route for all locations' named dialogs to reuse the same code.

function NamedDialog() {
  const location = useMeshLocation();
  const sdk = useUniformMeshSdk();
  const [nestedDialogResult, setNestedDialogResult] = useState<string>('No nested dialog result yet.');

  if (!location.dialogContext?.dialogLocation) {
    return null;
  }

  // custom dialog location (i.e. `locations.settings.locations.foo` in the manifest)
  return (
    <VerticalRhythm>
      <h1>Custom Dialog Location</h1>
      <div>Parent location that spawned the dialog: {location.type}</div>
      <div>Dialog location key opened: {location.dialogContext.dialogLocation}</div>
      <div>
        Dialog params: <pre>{JSON.stringify(location.dialogContext.params, null, 2)}</pre>
      </div>

      <Fieldset legend={<>Nested Dialogs</>}>
        <Button
          onClick={async () => {
            const result = await sdk.openLocationDialog({
              locationKey: 'ptNested',
              options: { params: { paramFromDialogOpener: 'hello from the parent dialog' } },
            });
            setNestedDialogResult(
              `Received result from nested dialog. \n\n${JSON.stringify(result?.value, null, 2)}`
            );
          }}
        >
          Open Nested Dialog
        </Button>

        <pre>{nestedDialogResult}</pre>
      </Fieldset>

      <Button
        onClick={() => {
          // the modal is dismissed when we return a dialog return value
          // the success result is an arbitrary type; you can return whatever you wish
          // as long as it's JSON-serializable.
          location.dialogContext?.returnDialogValue({
            success: true,
            nestedDialogResult: nestedDialogResult,
          });
        }}
      >
        Close Dialog and Return Result
      </Button>
    </VerticalRhythm>
  );
}

export default NamedDialog;
