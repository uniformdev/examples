/**
 * GET /api/compositions?projectId=&offset= — paginated JSON (parity with mesh-bulk-publish).
 */
import { loadCompositionList } from '../services/compositionList.js';

function parseOffset(req) {
  const raw = req.query.offset;
  if (typeof raw !== 'string') {
    return 0;
  }
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function getApiCompositions(req, res) {
  const projectId = typeof req.query.projectId === 'string' ? req.query.projectId : undefined;
  if (!projectId) {
    res.status(400).json({ error: 'projectId query param is required' });
    return;
  }

  const offset = parseOffset(req);
  const result = await loadCompositionList(projectId, req.headers.cookie, offset);
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  if (result.setCookieHeader) {
    res.setHeader('Set-Cookie', result.setCookieHeader);
  }
  res.json({
    items: result.items,
    offset: result.offset,
    pageSize: result.pageSize,
    hasMore: result.hasMore,
  });
}
