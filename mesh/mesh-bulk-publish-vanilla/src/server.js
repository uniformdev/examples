/**
 * Express server for the mesh-build-publish-vanilla experiment (Express + HTMX 4 + Mesh SDK bootstrap).
 */
import { readFileSync } from 'node:fs';
import https from 'node:https';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';

import { assertRequiredEnv } from './assertEnv.js';
import { getApiCompositions } from './routes/apiCompositions.js';
import { postApiPublish } from './routes/apiPublish.js';
import { postApiSession } from './routes/apiSession.js';
import { getApiStatus } from './routes/apiStatus.js';
import { getPartialsCompositions } from './routes/partialsCompositions.js';

assertRequiredEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const selfsigned = require('selfsigned');

const DEFAULT_PORT = 9003;

function shouldUseHttps() {
  return process.env.HTTPS === '1' || process.env.USE_HTTPS === '1';
}

/**
 * Loads `HTTPS_KEY` + `HTTPS_CERT` PEM paths, or generates a one-off self-signed
 * cert for local Mesh dev (no monorepo or extra tooling required). Set both env
 * vars to use your own certs (e.g. from mkcert).
 */
function loadOrGenerateDevTls() {
  const hasKey = process.env.HTTPS_KEY?.trim();
  const hasCert = process.env.HTTPS_CERT?.trim();
  if (hasKey && hasCert) {
    return {
      key: readFileSync(resolve(process.cwd(), hasKey), 'utf8'),
      cert: readFileSync(resolve(process.cwd(), hasCert), 'utf8'),
    };
  }
  if (hasKey || hasCert) {
    throw new Error(
      'Set both HTTPS_KEY and HTTPS_CERT to PEM file paths, or clear both to use a generated dev certificate.',
    );
  }
  // eslint-disable-next-line no-console
  console.log(
    '[https] No HTTPS_KEY/HTTPS_CERT: using a generated self-signed certificate for this process (use env vars for your own PEMs).',
  );
  const pems = selfsigned.generate(
    [{ name: 'commonName', value: 'localhost' }],
    {
      keySize: 2048,
      days: 365,
      algorithm: 'sha256',
      extensions: [
        { name: 'basicConstraints', cA: true },
        {
          name: 'keyUsage',
          keyCertSign: true,
          digitalSignature: true,
          nonRepudiation: true,
          keyEncipherment: true,
          dataEncipherment: true,
        },
        { name: 'subjectAltName', altNames: [{ type: 2, value: 'localhost' }] },
      ],
    },
  );
  return { key: pems.private, cert: pems.cert };
}

/** Resolves the installed `htmx.org` 4.x beta IIFE bundle for `/htmx.min.js`. */
function resolveHtmxBundlePath() {
  const pkgRoot = dirname(require.resolve('htmx.org/package.json'));
  return join(pkgRoot, 'dist', 'htmx.min.js');
}

/** Minimal HTML document wrapper shared by `/bulk-publish` and `/settings`. */
function pageShell(body, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <link rel="stylesheet" href="/styles.css" />
  <script defer src="/htmx.min.js"></script>
</head>
<body>
${body}
</body>
</html>`;
}

const bulkPublishInner = `
  <div id="delegation-loading">
    <p>Connecting to Uniform…</p>
  </div>
  <div id="delegation-disabled" hidden>
    <p><strong>Feature unavailable</strong></p>
    <p>This app requires permissions that are not currently enabled. Please contact your Uniform administrator to enable identity delegation for this integration.</p>
  </div>
  <div id="delegation-error" hidden>
    <p><strong>Connection error</strong></p>
    <p>Failed to establish a secure connection with Uniform.</p>
    <pre></pre>
  </div>
  <div id="bulk-app" hidden>
    <h1>Bulk Publish</h1>
    <input type="hidden" name="projectId" id="mesh-project-id" value="" />
    <input type="hidden" name="offset" id="compositions-offset" value="0" />
    <div
      id="compositions-root"
      hx-get="/partials/compositions"
      hx-trigger="mesh:ready from:body, refreshCompositions from:body"
      hx-include="#mesh-project-id, #compositions-offset"
      hx-target="this"
      hx-swap="innerHTML"
    ></div>
  </div>
  <script defer src="/delegation-bootstrap.js"></script>
`;

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

app.use(express.static(join(__dirname, '../public')));

app.get('/htmx.min.js', (_req, res) => {
  res.type('application/javascript');
  res.sendFile(resolveHtmxBundlePath());
});

app.get('/bulk-publish', (_req, res) => {
  res.type('html').send(pageShell(bulkPublishInner, 'Bulk Publish'));
});

app.get('/settings', (_req, res) => {
  const body = `
  <div>
    <h1>Integration settings</h1>
    <p>Do we need settings actually? May be to validate that identity delegation is working fine?</p>
  </div>`;
  res.type('html').send(pageShell(body, 'Settings'));
});

app.get('/api/status', (req, res) => {
  void getApiStatus(req, res);
});
app.post('/api/session', (req, res) => {
  void postApiSession(req, res);
});
app.get('/api/compositions', (req, res) => {
  void getApiCompositions(req, res);
});
app.post('/api/publish', (req, res) => {
  void postApiPublish(req, res);
});
app.get('/partials/compositions', (req, res) => {
  void getPartialsCompositions(req, res);
});

app.get('/', (_req, res) => {
  res.redirect(302, '/bulk-publish');
});

const port = Number(process.env.PORT) || DEFAULT_PORT;

if (shouldUseHttps()) {
  const options = loadOrGenerateDevTls();
  https.createServer(options, app).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`mesh-build-publish-vanilla listening on https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`mesh-build-publish-vanilla listening on http://localhost:${port}`);
  });
}
