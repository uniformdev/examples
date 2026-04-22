/**
 * Shared BFF logic for listing compositions (used by JSON API and HTMX HTML partial).
 * Draft list is paginated (Uniform accepts one `state` per list call); published status
 * for the current page is resolved with a second call (`state` published + `compositionIDs`).
 */
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from '@uniformdev/canvas';

import { createDelegationCanvasClient } from './delegationCanvasClient.js';
import { resolveDelegationSession } from './delegationSession.js';

const COMPOSITIONS_PAGE_SIZE = 20;

/**
 * Component definition id for list rows (`type` in Canvas list API; `_type` in some payloads).
 * @param {Record<string, unknown>} composition
 */
function compositionComponentTypeId(composition) {
  if (typeof composition.type === 'string' && composition.type.length > 0) {
    return composition.type;
  }
  if (typeof composition._type === 'string' && composition._type.length > 0) {
    return composition._type;
  }
  return '';
}

const listParamsBase = {
  skipPatternResolution: true,
  skipOverridesResolution: true,
  withProjectMapNodes: true,
  orderBy: ['updated_at_DESC'],
  limit: COMPOSITIONS_PAGE_SIZE,
};

/**
 * @param {string} projectId
 * @param {string | undefined} cookieHeader
 * @param {number} [offset]
 */
export async function loadCompositionList(projectId, cookieHeader, offset = 0) {
  const resolved = await resolveDelegationSession(cookieHeader);
  if (!resolved.ok) {
    return resolved;
  }

  const { session, setCookieHeader } = resolved;
  const canvas = createDelegationCanvasClient(projectId, session.accessToken);

  let draftBody;
  let definitionsBody;
  try {
    [draftBody, definitionsBody] = await Promise.all([
      canvas.getCompositionList({
        ...listParamsBase,
        offset,
        state: CANVAS_DRAFT_STATE,
      }),
      canvas.getComponentDefinitions(),
    ]);
  } catch (err) {
    const status = err && typeof err.statusCode === 'number' && err.statusCode >= 400 ? err.statusCode : 502;
    return { ok: false, status, error: 'Upstream Uniform API error' };
  }

  const typeMap = new Map(definitionsBody.componentDefinitions.map((d) => [d.id, d]));

  const draftRows = draftBody.compositions.map(({ composition }) => composition);
  const ids = draftRows.map((c) => c._id);

  let publishedBody = { compositions: [] };
  if (ids.length > 0) {
    try {
      publishedBody = await canvas.getCompositionList({
        ...listParamsBase,
        offset: 0,
        limit: COMPOSITIONS_PAGE_SIZE,
        state: CANVAS_PUBLISHED_STATE,
        compositionIDs: ids,
      });
    } catch (err) {
      const status =
        err && typeof err.statusCode === 'number' && err.statusCode >= 400 ? err.statusCode : 502;
      return { ok: false, status, error: 'Upstream Uniform API error' };
    }
  }

  const publishedIds = new Set(publishedBody.compositions.map(({ composition: c }) => c._id));

  const items = draftRows.map((composition) => {
    const componentTypeId = compositionComponentTypeId(composition);
    const def = typeMap.get(componentTypeId);
    return {
      id: composition._id,
      name: composition._name,
      state: publishedIds.has(composition._id) ? CANVAS_PUBLISHED_STATE : CANVAS_DRAFT_STATE,
      componentTypeId,
      componentTypeName: def?.name ?? (componentTypeId || '—'),
      componentTypeIcon: def?.icon ?? null,
      projectMapPath: composition.projectMapNodes?.[0]?.path ?? null,
    };
  });

  return {
    ok: true,
    items,
    offset,
    pageSize: COMPOSITIONS_PAGE_SIZE,
    hasMore: draftRows.length === COMPOSITIONS_PAGE_SIZE,
    setCookieHeader,
  };
}
