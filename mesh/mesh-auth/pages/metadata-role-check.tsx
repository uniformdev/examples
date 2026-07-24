import { hasPermissions, hasRole } from '@uniformdev/mesh-sdk';
import { useMeshLocation } from '@uniformdev/mesh-sdk-react';

/** Example team role name — role names are defined per team in Uniform settings. */
const DEVELOPER_ROLE_NAME = 'Developer';

const sectionStyle = { marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #ddd' };

/**
 * Metadata access control examples. This location has no manifest `access` requirement, so any
 * project member can open it. Individual UI is gated using `metadata.user` from the Mesh SDK.
 */
export default function MetadataRoleCheckTool() {
  const { metadata } = useMeshLocation<'projectTool'>();
  const { user } = metadata;

  const hasDeveloperAccess =
    user.isAdmin ||
    hasRole(DEVELOPER_ROLE_NAME, user) ||
    // Be aware that Policies can override roles and permissions, so it may not be reliable in your case.
    hasPermissions('COMPOSITIONS_WRITE', user);

  return (
    <div>
      <h1>Metadata Role Check</h1>
      <p>
        The dashboard sends read-only user context to mesh locations via <code>metadata.user</code>. Use it
        for conditional UI — never as your only security layer.
      </p>

      <section style={sectionStyle}>
        <h2>1. Open to everyone</h2>
        <p>
          Any project member who can open this integration sees this section. No role or permission check is
          applied.
        </p>
        <p>
          Signed in as <strong>{user.name ?? user.email ?? user.id}</strong>
          {user.isAdmin ? ' (team admin)' : ''}.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>2. Role or permission gated</h2>
        <p>
          Example gate using <code>hasRole(&apos;{DEVELOPER_ROLE_NAME}&apos;, user)</code> or{' '}
          <code>hasPermissions(&apos;COMPOSITIONS_WRITE&apos;, user)</code>. Team admins pass either check
          automatically.
        </p>
        <button type="button" disabled={!hasDeveloperAccess}>
          Run developer action
        </button>
        {!hasDeveloperAccess && (
          <p style={{ marginTop: '0.75rem', color: '#666' }}>
            Disabled — assign the <strong>{DEVELOPER_ROLE_NAME}</strong> role or{' '}
            <strong>Compositions: Write</strong> permission in team settings.
          </p>
        )}
      </section>

      <section>
        <h2>3. Admin only</h2>
        <p>
          Example gate using <code>metadata.user.isAdmin</code>. The button is disabled for non-admins instead
          of hiding the section, so the pattern is visible to every user.
        </p>
        <button type="button" disabled={!user.isAdmin}>
          Team administration action
        </button>
        {!user.isAdmin && (
          <p style={{ marginTop: '0.75rem', color: '#666' }}>
            Disabled for non-admins. Defense in depth is still strongly recommended: combine in-iframe checks
            with manifest <code>access</code> rules and/or server-side authorization for anything sensitive.
            Metadata is delivered via postMessage and must not be your only gate.
          </p>
        )}
      </section>
    </div>
  );
}
