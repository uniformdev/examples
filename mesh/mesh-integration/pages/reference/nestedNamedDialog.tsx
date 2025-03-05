import { Button, useMeshLocation } from '@uniformdev/mesh-sdk-react';

// Nested named dialog
// This demonstrates being able to stack multiple nested dialogs on top of each other using Mesh,
// i.e. if you have an editor dialog that can open a details dialog.

// In a nested dialog, calling returnDialogValue() will return the result _to the parent dialog_,
// not to the root location that opened the dialog.

function NestedNamedDialog() {
  const location = useMeshLocation();

  if (!location.dialogContext?.dialogLocation) {
    return null;
  }

  // custom dialog location (i.e. `locations.settings.locations.foo` in the manifest)
  return (
    <div>
      <h1>Nested Dialog</h1>
      <p>Dialog location key opened: {location.dialogContext.dialogLocation}</p>
      <div>
        Dialog params: <pre>{JSON.stringify(location.dialogContext.params, null, 2)}</pre>
      </div>

      <Button
        onClick={() => {
          // the modal is dismissed when we return a dialog return value
          // the success result is an arbitrary type; you can return whatever you wish
          // as long as it's JSON-serializable.
          location.dialogContext?.returnDialogValue({ resultFromNestedDialog: 'completed' });
        }}
      >
        Close Dialog and Return Result
      </Button>
    </div>
  );
}

export default NestedNamedDialog;
