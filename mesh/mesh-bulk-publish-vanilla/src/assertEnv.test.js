import test from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

async function importFresh(relativePath) {
  const url = pathToFileURL(new URL(relativePath, import.meta.url).pathname);
  url.searchParams.set('t', String(Date.now()) + Math.random());
  return import(url.href);
}

test('assertRequiredEnv requires MESH_ALLOWED_ORIGINS', async () => {
  const previous = {
    UNIFORM_API_HOST: process.env.UNIFORM_API_HOST,
    UNIFORM_EDGE_API_HOST: process.env.UNIFORM_EDGE_API_HOST,
    UNIFORM_INTEGRATION_ID: process.env.UNIFORM_INTEGRATION_ID,
    UNIFORM_INTEGRATION_SECRET: process.env.UNIFORM_INTEGRATION_SECRET,
    MESH_SESSION_SECRET: process.env.MESH_SESSION_SECRET,
    MESH_ALLOWED_ORIGINS: process.env.MESH_ALLOWED_ORIGINS,
  };

  process.env.UNIFORM_API_HOST = 'https://uniform.app';
  process.env.UNIFORM_EDGE_API_HOST = 'https://uniform.global';
  process.env.UNIFORM_INTEGRATION_ID = 'integration-id';
  process.env.UNIFORM_INTEGRATION_SECRET = 'integration-secret';
  process.env.MESH_SESSION_SECRET = 'session-secret';
  delete process.env.MESH_ALLOWED_ORIGINS;

  try {
    const { assertRequiredEnv } = await importFresh('./assertEnv.js');
    assert.throws(() => assertRequiredEnv(), /MESH_ALLOWED_ORIGINS/);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
});
