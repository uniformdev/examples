/**
 * GET /api/status — read-only delegation session presence for the browser.
 */
import { readDelegationSessionWithoutRefresh } from '../services/delegationSession.js';

export async function getApiStatus(req, res) {
  const session = await readDelegationSessionWithoutRefresh(req.headers.cookie);
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
