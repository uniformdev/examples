import { useMeshLocation } from '@uniformdev/mesh-sdk-react';

/**
 * Project tool restricted to team admins.
 *
 * Two layers of protection are demonstrated:
 *
 * 1. **Manifest-driven (primary)** — `mesh-manifest.json` declares this tool with
 *    `access: { teamAdminRequired: true }`. The dashboard backend
 *    (`GET /api/v1/integration-definitions`) strips the entry from the response for
 *    non-admins, so the navigation link never appears and the iframe is never mounted.
 *
 * 2. **Metadata-driven (defense in depth)** — when the iframe IS mounted (for example via
 *    `pages/metadata-role-check.tsx`, which has no manifest `access` but checks
 *    `metadata.user.isAdmin`, or if a regression lets a manifest-admin-only tool through),
 *    the mesh app can refuse primary content.
 *    Metadata is sent to the iframe by the dashboard via postMessage; a determined attacker
 *    with control of the parent frame can spoof it — this layer is purely defensive and is never
 *    a substitute for the backend filter.
 */
export default function AdminOnlyTool() {
  const { metadata } = useMeshLocation<'projectTool'>();

  if (!metadata.user.isAdmin) {
    return (
      <div data-testid="admin-only-tool-blocked">
        <h1>Access Denied</h1>
        <p>You must be a team administrator to use this tool.</p>
      </div>
    );
  }

  return (
    <div data-testid="admin-only-tool-content">
      <h1>Only Admin Can Be Here</h1>
      <p>This project tool is restricted to team administrators.</p>
    </div>
  );
}
