import test from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

async function importFresh(relativePath) {
  const url = pathToFileURL(new URL(relativePath, import.meta.url).pathname);
  url.searchParams.set('t', String(Date.now()) + Math.random());
  return import(url.href);
}

function createResponse() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
}

test('requireMeshCsrf rejects requests from disallowed origins', async () => {
  process.env.MESH_ALLOWED_ORIGINS = 'https://localhost:9003';

  const { requireMeshCsrf } = await importFresh('./csrf.js');
  const res = createResponse();
  const ok = requireMeshCsrf(
    {
      headers: {
        origin: 'https://evil.example',
        'x-mesh-csrf': '1',
      },
    },
    res
  );

  assert.equal(ok, false);
  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.payload, { error: 'Forbidden' });
});
