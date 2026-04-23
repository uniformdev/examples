/**
 * POST /api/publish
 *
 * Accepts a list of composition IDs and publishes each via CanvasClient + delegation Bearer token.
 *
 * Body:     { projectId: string; compositionIds: string[] }
 * Response: { published: number; failed: Array<{ id: string; error: string }> }
 *           HTTP 200 if all succeeded, HTTP 207 if any failed.
 */
import { CanvasClient } from '@uniformdev/canvas';
import type { NextApiRequest, NextApiResponse } from 'next';

import { requireCsrfHeader } from '../../lib/csrf';
import { loadMeshDelegationSession } from '../../lib/util/delegationSession';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!requireCsrfHeader(req, res)) {
    // eslint-disable-next-line no-console
    console.error('CSRF header required');
    return;
  }

  const { projectId, compositionIds } = req.body as { projectId?: string; compositionIds?: string[] };
  if (!projectId || typeof projectId !== 'string') {
    res.status(400).json({ error: 'projectId is required' });
    return;
  }
  if (!Array.isArray(compositionIds) || compositionIds.length === 0) {
    res.status(400).json({ error: 'compositionIds must be a non-empty array' });
    return;
  }

  const session = await loadMeshDelegationSession(req, res);
  if (!session) {
    res.status(401).json({ error: 'No delegation session' });
    return;
  }

  const apiHost = process.env.UNIFORM_API_HOST!;
  const edgeApiHost = process.env.UNIFORM_EDGE_API_HOST!;
  const canvasClient = new CanvasClient({
    apiHost,
    edgeApiHost,
    projectId,
    bearerToken: session.accessToken,
  });

  const results = await Promise.allSettled(
    compositionIds.map(async (id) => {
      const compositionResponse = await canvasClient.getCompositionById({ compositionId: id });
      if (compositionResponse.state === 64) {
        return { id, modified: 'yep' };
      }
      const updatedComposition = await canvasClient.updateComposition({
        composition: compositionResponse.composition,
        state: 64,
      });
      return { id, composition: updatedComposition };
    })
  );

  const failed = results.flatMap((r, i) =>
    r.status === 'rejected' ? [{ id: compositionIds[i], error: (r.reason as Error).message }] : []
  );

  if (failed.length > 0) {
    res.status(207).json({ published: compositionIds.length - failed.length, failed });
    return;
  }

  res.json({ published: compositionIds.length, failed: [] });
}
