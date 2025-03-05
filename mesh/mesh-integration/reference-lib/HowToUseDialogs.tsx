import { Button, Heading, useMeshLocation, useUniformMeshSdk } from '@uniformdev/mesh-sdk-react';
import { useState } from 'react';

export function HowToUseDialogs({ namedDialogName }: { namedDialogName: string }) {
  const sdk = useUniformMeshSdk();
  const location = useMeshLocation();

  const [currentDialogResult, setCurrentDialogResult] = useState<string>('No dialog result yet.');

  return (
    <div>
      <Heading level={4}>Dialog Example</Heading>

      <div>
        {location.dialogContext ? (
          `Currently in a dialog, hiding dialog demo options (dialog id: ${location.dialogContext.dialogId}). NOTE: if used in a dialog, the current location must call dialogContext.returnDialogValue() once instead of binding reactively to setValue(). If you type in the text box above it will dismiss after one character is typed due to this limitation.`
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
              <p>Current Dialog Result</p>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{currentDialogResult}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
