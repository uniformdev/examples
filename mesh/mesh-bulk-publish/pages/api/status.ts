/**
 * GET /api/status
 *
 * WHY THIS ENDPOINT EXISTS
 * -------------------------
 * The delegation cookie is HttpOnly — JavaScript in the browser cannot read it.
 * This means the DelegationProvider cannot check "do I already have a valid
 * session?" by inspecting document.cookie. Instead, it calls this endpoint.
 *
 * Response: { status: 'active' | 'expired' | 'none' }
 */
import type { NextApiRequest, NextApiResponse } from 'next';

import { requireMeshCsrf } from '../../lib/util/csrf';
import {
  readMeshDelegationCookieFromRequest,
  unsealMeshDelegationSession,
} from '../../lib/util/delegationSession';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  res.setHeader('Cache-Control', 'no-store, private');

  if (!requireMeshCsrf(req, res)) {
    return;
  }

  const jwe = readMeshDelegationCookieFromRequest(req);
  if (!jwe) {
    res.json({ status: 'none' });
    return;
  }

  const session = await unsealMeshDelegationSession(jwe);
  if (!session) {
    res.json({ status: 'none' });
    return;
  }

  if (session.expiresAt < Date.now()) {
    res.json({ status: 'expired' });
    return;
  }

  res.json({ status: 'active' });
}
