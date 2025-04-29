import { HorizontalRhythm } from '@uniformdev/design-system';
import { CSSHeight, useMeshLocation, useUniformMeshSdk } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import { useMemo, useState } from 'react';

/** A 'hello, world' location that lets you see location details */
const Tool: NextPage = () => {
  const sdk = useUniformMeshSdk();
  const { type, metadata, value, router } = useMeshLocation<'tool'>();

  const [anotherProjectId, setAnotherProjectId] = useState('');

  const navigate = (path: string) => {
    // Navigate to another page in scope of the current project
    // NOTE: you don't need to specify /projects/${projectId} as it is prepended automatically
    router.navigatePlatform(path);
  };

  const navigateNewTab = (path: string) => {
    // Open a new tab in scope of the current project
    // NOTE: you don't need to specify /projects/${projectId} as it is prepended automatically
    router.navigatePlatform(path, { target: '_blank' });
  };

  const navigateAnotherProject = (projectId: string, path: string) => {
    // Open a new tab in scope of the another project
    // `projectId` option defines the target project ID
    // NOTE: you don't need to specify /projects/${projectId} as it is prepended automatically
    router.navigatePlatform(path, { projectId, target: '_blank' });
  };

  const enableAutoResizing = () => {
    // Allows SDK to calculate the height automatically
    // This approach adjust iframe height to the content height to render the content without unnecessary scrollbar if possible.
    // NOTE: In specific scenarios height could not be calculated properly, so you may need to use `disableAutoResizing()` and `updateHeight()`.
    sdk.currentWindow?.enableAutoResizing();
  };

  const disableAutoResizing = () => {
    // Disables auto resizing(you may set specific height via `updateHeight()`)
    sdk.currentWindow?.disableAutoResizing();
  };

  const updateHeight = (height: CSSHeight) => {
    // Set specific height for the iframe
    // NOTE:It would be good to ensure auto resizing is disabled first
    sdk.currentWindow?.disableAutoResizing();
    sdk.currentWindow?.updateHeight(height);
  };

  // If you need to access the user name or email,
  // `"scopes": ["user:read"]` should be added to the integration manifest.
  const currentUser = useMemo(
    () => ({
      name: metadata?.user?.name,
      email: metadata?.user?.email,
    }),
    [metadata?.user]
  );

  return (
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
          </th>
          <td>
            <pre>{JSON.stringify(value, null, 2) || 'no value yet'}</pre>
          </td>
        </tr>
        <tr>
          <th>
            <span>Current user:</span>
          </th>
          <td>
            <pre>{JSON.stringify(currentUser, null, 2)}</pre>
          </td>
        </tr>
        <tr>
          <th>
            <span>Navigate:</span>
          </th>
          <td>
            <button onClick={() => navigate('/dashboards/canvas/redirects')}>Open Redirects</button>
          </td>
        </tr>
        <tr>
          <th>
            <span>Navigate with target blank:</span>
          </th>
          <td>
            <button onClick={() => navigateNewTab('/dashboards/canvas/entries')}>
              Open Entries in a new tab
            </button>
          </td>
        </tr>
        <tr>
          <th>
            <span>Navigate to another project entries:</span>
          </th>
          <td>
            <HorizontalRhythm>
              <input
                type="text"
                value={anotherProjectId}
                onChange={(e) => setAnotherProjectId(e.target.value)}
                placeholder="Enter project ID"
              />
              <button onClick={() => navigateAnotherProject(anotherProjectId, '/dashboards/canvas/entries')}>
                Open Entries in a new tab
              </button>
            </HorizontalRhythm>
          </td>
        </tr>
        <tr>
          <th>
            <span>Resize:</span>
          </th>
          <td>
            <HorizontalRhythm>
              <button onClick={enableAutoResizing}>Enable auto resizing</button>
              <button onClick={disableAutoResizing}>Disable auto resizing</button>
              <button onClick={() => updateHeight('500px')}>Set height to 500px</button>
            </HorizontalRhythm>
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
  );
};

export default Tool;
