import { Callout, Heading, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

/** A 'hello, world' location that lets you see location details */
const HelloWorldMeshApp: NextPage = () => {
  const { type, metadata, value } = useMeshLocation();

  // This component is an example of a _location_ for a Uniform Integration. Locations are rendered
  // within the Uniform Dashboard and are provided with read-only location-specific metadata, and a value
  // that the UI can read and write to. For example, a parameter type receives the value of the parameter,
  // and can request to set that value, send validation results, etc.

  // Each type of location has unique typings for its value and metadata.
  // Check out the location examples in `/reference` for how to build specific locations.
  // Integrations need only implement the location(s) they wish to extend;
  // all locations are optional in the manifest.

  return (
    <div className="helloWrapper">
      <Heading level={4}>Welcome to Uniform Integrations!</Heading>

      <p>
        This content is being rendered from within your Uniform Integration application in the{' '}
        <code>{type}</code> location.
      </p>

      <Callout type="tip">
        This is a read-only preview. Want to make this location your own? Follow these steps:
        <ol>
          <li>
            Copy <code>/pages/reference/{type}.tsx</code> to <code>/pages/{type}.tsx</code>
          </li>
          <li>
            In <code>mesh-manifest.json</code>, change the URL for this location from <code>/</code> to{' '}
            <code>/{type}</code>
          </li>
          <li>In the Uniform dashboard, go to your Team &rarr; Settings &rarr; Custom Integrations</li>
          <li>
            Edit your integration and paste in the updated <code>mesh-manifest.json</code>
          </li>
        </ol>
      </Callout>

      <table>
        <tbody>
          <tr>
            <th>Current location:</th>
            <td>
              <pre>{type}</pre>
            </td>
          </tr>

          <tr>
            <th>
              <span>Location value:</span>
              <small>Can be updated</small>
              {/*
                To update a location, use the `setValue` function exposed by useMeshLocation.
                See the reference locations in pages/reference for examples of doing this.
               */}
            </th>
            <td>
              <pre>{JSON.stringify(value, null, 2) || 'no value yet'}</pre>
            </td>
          </tr>

          <tr>
            <th>
              <span>Metadata:</span>
              <small>Extra context data</small>
            </th>
            <td>
              <pre>{JSON.stringify(metadata, null, 2) || 'no metadata is provided to this location'}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HelloWorldMeshApp;
