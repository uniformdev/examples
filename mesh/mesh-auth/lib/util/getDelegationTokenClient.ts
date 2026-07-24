import { DelegationTokenClient } from '@uniformdev/mesh-sdk/server';

if (!process.env.UNIFORM_INTEGRATION_SECRET) {
  throw new Error('UNIFORM_INTEGRATION_SECRET is not set');
}

if (!process.env.UNIFORM_INTEGRATION_ID) {
  throw new Error('UNIFORM_INTEGRATION_ID is not set');
}

if (!process.env.UNIFORM_API_HOST) {
  throw new Error('UNIFORM_API_HOST is not set');
}

let client: DelegationTokenClient | undefined;

/**
 * DelegationTokenClient is a thin server-side client from @uniformdev/mesh-sdk/server.
 * It calls POST /api/v1/token on the Uniform API with:
 *   - grantType: 'delegation_token'
 *   - sessionToken: the one-time token from the browser
 *   - integrationId + integrationSecret: your integration credentials
 *
 * It returns { accessToken, expiresIn, tokenType: 'Bearer', ... }.
 * This demo stores only the access token in the sealed cookie and re-exchanges
 * via a new Mesh session token when it expires (no refresh-token flow).
 * The integration secret is ONLY used here — it never goes to the browser.
 */
export function getDelegationTokenClient() {
  if (!client) {
    client = new DelegationTokenClient({
      apiHost: process.env.UNIFORM_API_HOST!,
      integrationId: process.env.UNIFORM_INTEGRATION_ID!,
      integrationSecret: process.env.UNIFORM_INTEGRATION_SECRET!,
    });
  }
  return client;
}
