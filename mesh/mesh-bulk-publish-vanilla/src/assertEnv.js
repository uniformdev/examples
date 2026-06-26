/**
 * Validates process env at startup so routes never see undefined Uniform/Mesh configuration.
 * Expects variables to be set via the shell or `node --env-file=.env` (Node 20.6+).
 */
const REQUIRED = [
  'UNIFORM_API_HOST',
  'UNIFORM_EDGE_API_HOST',
  'UNIFORM_INTEGRATION_ID',
  'UNIFORM_INTEGRATION_SECRET',
  'MESH_SESSION_SECRET',
  'MESH_ALLOWED_ORIGINS',
];

export function assertRequiredEnv() {
  const missing = REQUIRED.filter((key) => !String(process.env[key] ?? '').trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Set them in the environment or use a .env file with `node --env-file=.env` (see .env.example).'
    );
  }
}
