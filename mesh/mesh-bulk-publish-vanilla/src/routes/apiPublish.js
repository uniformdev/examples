/**
 * POST /api/publish — publish selected compositions (same semantics as mesh-bulk-publish).
 */
import { createDelegationCanvasClient } from '../services/delegationCanvasClient.js';
import { resolveDelegationSession } from '../services/delegationSession.js';

export async function postApiPublish(req, res) {
  const { projectId, compositionIds } = req.body ?? {};
  if (!projectId || typeof projectId !== 'string') {
    res.status(400).json({ error: 'projectId is required' });
    return;
  }
  if (!Array.isArray(compositionIds) || compositionIds.length === 0) {
    res.status(400).json({ error: 'compositionIds must be a non-empty array' });
    return;
  }

  const resolved = await resolveDelegationSession(req.headers.cookie);
  if (!resolved.ok) {
    res.status(resolved.status).json({ error: resolved.error });
    return;
  }

  const { session, setCookieHeader } = resolved;
  if (setCookieHeader) {
    res.setHeader('Set-Cookie', setCookieHeader);
  }

  const canvasClient = createDelegationCanvasClient(projectId, session.accessToken);

  const results = await Promise.allSettled(
    compositionIds.map(async (id) => {
      const compositionResponse = await canvasClient.getCompositionById({ compositionId: id });
      if (compositionResponse.state === 64) {
        return { id, skipped: true };
      }
      await canvasClient.updateComposition({
        composition: compositionResponse.composition,
        state: 64,
      });
      return { id };
    })
  );

  const failed = results.flatMap((r, i) =>
    r.status === 'rejected'
      ? [
          {
            id: compositionIds[i],
            error: r.reason instanceof Error ? r.reason.message : String(r.reason),
          },
        ]
      : []
  );

  if (failed.length > 0) {
    res.status(207).json({ published: compositionIds.length - failed.length, failed });
    return;
  }

  res.json({ published: compositionIds.length, failed: [] });
}
