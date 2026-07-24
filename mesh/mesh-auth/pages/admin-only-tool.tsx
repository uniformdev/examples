/**
 * Mesh Manifest access control: `mesh-manifest.json` declares `access.teamAdminRequired: true`.
 */
export default function AdminOnlyTool() {
  return (
    <div>
      <h1>Admin Only Tool</h1>
      <p>This project tool is restricted to team administrators via the integration manifest.</p>
    </div>
  );
}
