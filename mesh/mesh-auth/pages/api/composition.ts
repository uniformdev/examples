/**
 * GET /api/composition?projectId=<uuid>&compositionId=<uuid>&state=0|64
 *
 * Minimal BFF route: loads a single composition by ID using the delegation Bearer token.
 * Demonstrates session loading, upstream error mapping, and CSRF guarding.
 *
 * Response: { id: string; name: string; state: number }
 */
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE, CanvasClient } from '@uniformdev/canvas';
import { ApiClientError, BearerTokenNotValidOrExpiredError } from '@uniformdev/context/api';
import { DELEGATION_EXPIRED_CODE, DELEGATION_SESSION_EXPIRED_MESSAGE } from '@uniformdev/mesh-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

import { requireMeshCsrf } from '../../lib/util/csrf';
import {
  clearMeshDelegationSessionCookie,
  loadMeshDelegationSession,
} from '../../lib/util/delegationSession';

export interface CompositionSummary {
  id: string;
  name: string;
  state: number;
}

function parseState(raw: string | string[] | undefined): number {
  if (raw === '64' || raw === String(CANVAS_PUBLISHED_STATE)) {
    return CANVAS_PUBLISHED_STATE;
  }
  return CANVAS_DRAFT_STATE;
}

if (!process.env.UNIFORM_API_HOST) {
  throw new Error('UNIFORM_API_HOST is not set');
}

if (!process.env.UNIFORM_EDGE_API_HOST) {
  throw new Error('UNIFORM_EDGE_API_HOST is not set');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!requireMeshCsrf(req, res)) {
    return;
  }

  const { projectId, compositionId, state: stateParam } = req.query;
  if (!projectId || typeof projectId !== 'string') {
    res.status(400).json({ error: 'projectId query param is required' });
    return;
  }
  if (!compositionId || typeof compositionId !== 'string') {
    res.status(400).json({ error: 'compositionId query param is required' });
    return;
  }

  const state = parseState(stateParam);

  const session = await loadMeshDelegationSession(req, res);
  if (!session) {
    res.status(401).json({ error: DELEGATION_SESSION_EXPIRED_MESSAGE, code: DELEGATION_EXPIRED_CODE });
    return;
  }

  const canvasClient = new CanvasClient({
    apiHost: process.env.UNIFORM_API_HOST!,
    edgeApiHost: process.env.UNIFORM_EDGE_API_HOST!,
    projectId,
    bearerToken: session.accessToken,
    bypassCache: true,
  });

  try {
    const response = await canvasClient.getCompositionById({ compositionId, state });
    const payload: CompositionSummary = {
      id: response.composition._id,
      name: response.composition._name,
      state,
    };
    res.json(payload);
  } catch (err) {
    if (err instanceof BearerTokenNotValidOrExpiredError) {
      clearMeshDelegationSessionCookie(res);
      res.status(401).json({ error: DELEGATION_SESSION_EXPIRED_MESSAGE, code: DELEGATION_EXPIRED_CODE });
      return;
    }
    if (err instanceof ApiClientError) {
      res.status(err.statusCode ?? 502).json({ error: err.errorMessage || 'Upstream Uniform API error' });
      return;
    }
    throw err;
  }
}
