import type { NextPage } from 'next';

/**
 * Settings location — intentionally does not use identity delegation.
 * Compare with `pages/delegation-demo.tsx`, which performs the full delegation flow.
 */
const Settings: NextPage = () => {
  return (
    <div>
      <h1>Mesh auth settings</h1>
      <p>
        This settings location does <strong>not</strong> use identity delegation. The dashboard renders it
        without minting a session token, without the consent drawer, and without calling your BFF token
        exchange.
      </p>
    </div>
  );
};

export default Settings;
