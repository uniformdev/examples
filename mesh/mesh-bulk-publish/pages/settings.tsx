import type { NextPage } from 'next';

/**
 * Settings location for the bulk-publish reference integration.
 *
 * This page is intentionally a no-op for identity delegation. It exists to demonstrate
 * that the *settings* mesh location is rendered without a session token request, without
 * triggering the consent drawer, and without ever calling `/api/v1/token` from the mesh
 * SDK on the user's behalf. Compare it with `pages/bulk-publish.tsx`, which does perform
 * the full delegation flow.
 */
const Settings: NextPage = () => {
  return (
    <div>
      <h1>Bulk publish settings</h1>
      <p>
        This integration&apos;s settings location does <strong>not</strong> use identity delegation. The
        dashboard renders this page in an iframe without minting a session token, without showing the consent
        drawer, and without sending the integration secret to your backend. Use it to verify that delegation
        is correctly scoped to only the locations that actually need a delegation token.
      </p>
      <ul>
        <li>No bearer token is forwarded to this page.</li>
        <li>No consent prompt is shown when the page is opened.</li>
        <li>No &quot;/api/v1/token&quot; request is made from this page on the user&apos;s behalf.</li>
        <li>If you need configuration UI, render it here without delegation.</li>
      </ul>
    </div>
  );
};

export default Settings;
