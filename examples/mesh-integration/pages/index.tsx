/* eslint-disable no-console */
import { Button, Heading, Label, Textarea, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

/** A 'hello, world' location that lets you see its details and edit its value */
const HelloWorldMeshApp: NextPage = () => {
  const { type, metadata, value, setValue } = useMeshLocation();

  // This component is an example of a _location_ for a Uniform Integration. Locations are rendered
  // within the Uniform Dashboard and allowed to have limited access to read and update values
  // related to their location. For example, a parameter type receives the value of the parameter,
  // and can request to set that value, send validation results, etc.

  // Each type of location has unique typings for its value and metadata.
  // Check out the location examples in `/reference` for how to build more specific locations
  // than this general location. Integrations need only implement the location(s) they wish to
  // extend. All locations are optional in the manifest.

  return (
    <div>
      <Heading level={3}>Welcome to Uniform Integrations!</Heading>

      <table cellPadding={4}>
        <tr>
          <td>
            <strong>Current location:</strong>
          </td>
          <td>{type}</td>
        </tr>

        <tr>
          <td>
            <strong>Metadata</strong>
            <br />
            <small>Extra context data provided to the location</small>
          </td>
          <td>
            <Button
              type="button"
              buttonType="secondaryInvert"
              onClick={() => console.log(`${type} location metadata`, metadata)}
            >
              Log to browser console
            </Button>
          </td>
        </tr>
      </table>

      <div>
        <Label htmlFor="locationValue">Location Value (live updates when valid JSON)</Label>
        <Textarea
          id="locationValue"
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const newValue = JSON.parse(e.currentTarget.value);
              console.log('Location value updated', newValue);
              setValue((_previous) => {
                // setValue's delegate is provided with the previous value to
                // apply changes to, like React's setState. We ignore it here,
                // since we are setting the entire value every time.
                return newValue;
              });
            } catch {
              // the textarea was not valid JSON, so skip updating
              // in most cases, UI components will set parts of the value so this is not needed
            }
          }}
        />
      </div>
    </div>
  );
};

export default HelloWorldMeshApp;
