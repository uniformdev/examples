import { useMeshLocation } from '@uniformdev/mesh-sdk-react';

/**
 * Project tool with **no** manifest `access` requirement. Every project member who can see the
 * integration can open this URL; the mesh app then enforces `metadata.user.isAdmin` and shows
 * Access Denied for non-admins.
 *
 * Demonstrates the metadata-driven defense-in-depth layer without relying on navigating to a
 * manifest admin-only location (the dashboard may treat those as non-existent for non-admins).
 */
export default function MetadataRoleCheckTool() {
  const { metadata } = useMeshLocation<'projectTool'>();

  if (!metadata.user.isAdmin) {
    return (
      <div data-testid="metadata-role-check-blocked">
        <h1>Access Denied</h1>
        <p>You must be a team administrator to use this tool.</p>
      </div>
    );
  }

  return (
    <div data-testid="metadata-role-check-content">
      <h1>Only Admin Can Be Here</h1>
      <p>This project tool is restricted to team administrators.</p>
    </div>
  );
}
