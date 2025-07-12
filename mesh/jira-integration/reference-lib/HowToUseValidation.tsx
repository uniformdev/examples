import { Button, Heading, useMeshLocation } from '@uniformdev/mesh-sdk-react';

export function HowToUseValidation() {
  const location = useMeshLocation();

  // note that `createLocationValidator` can be used to setup a more declarative validation pattern,
  // such as using zod to validate the newly-set value according to rules known only to the integration.
  // see the data source and data type location examples to see how to use that.

  return (
    <div>
      <Heading level={4}>Validation Example</Heading>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button
          onClick={async () => {
            // note that passing validation results is always done via setting the value
            // so to set an error without changing it we echo the previous value
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
