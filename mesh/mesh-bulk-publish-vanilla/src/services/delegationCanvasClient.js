/**
 * CanvasClient configured for mesh identity delegation (Bearer token only, no API key).
 */
import { CanvasClient } from '@uniformdev/canvas';

/**
 * @param {string} projectId
 * @param {string} bearerToken
 */
export function createDelegationCanvasClient(projectId, bearerToken) {
  const apiHost = process.env.UNIFORM_API_HOST;
  const edgeApiHost = process.env.UNIFORM_EDGE_API_HOST;

  return new CanvasClient({
    apiHost,
    edgeApiHost,
    projectId,
    bearerToken,
    bypassCache: true,
  });
}
