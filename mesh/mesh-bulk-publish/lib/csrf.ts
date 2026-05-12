import { CSRF_HEADER_NAME, CSRF_HEADER_VALUE } from '@uniformdev/mesh-identity-delegation-session';
import type { NextApiRequest, NextApiResponse } from 'next';

export function requireCsrfHeader(req: NextApiRequest, res: NextApiResponse): boolean {
  const received = req.headers[CSRF_HEADER_NAME];
  if (received !== CSRF_HEADER_VALUE) {
    res.status(403).json({ error: 'Missing or invalid CSRF header' });
    return false;
  }
  return true;
}

export { CSRF_HEADER_NAME, CSRF_HEADER_VALUE };
