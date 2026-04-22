/**
 * GET /api/status
 *
 * WHY THIS ENDPOINT EXISTS
 * -------------------------
 * The delegation cookie is HttpOnly — JavaScript in the browser cannot read it.
 * This means the DelegationProvider cannot check "do I already have a valid
 * session?" by inspecting document.cookie. Instead, it calls this endpoint.
 *
 * Response: { status: 'active' | 'expired' | 'none', expiresAt?: number }
 */
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  readMeshDelegationCookieFromRequest,
  unsealMeshDelegationSession,
} from '../../lib/util/delegationSession';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
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
    res.json({ status: 'expired', expiresAt: session.expiresAt });
    return;
  }

  res.json({ status: 'active', expiresAt: session.expiresAt });
}
