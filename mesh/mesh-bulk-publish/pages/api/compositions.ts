/**
 * GET /api/compositions?projectId=<uuid>&offset=<number>&keyword=<string>
 *
 * BFF: paginates the **draft** composition list (state 0) with `limit` 20 and `offset`.
 * Optional **keyword** is forwarded to Canvas (`keyword` list param): matches name, slug, or definition name.
 * Excludes **patterns** (`pattern: false`) so only real composition instances are listed.
 * Loads **published** snapshots for the same IDs in a second request (state 64 + `compositionIDs`)
 * so each row shows the correct published vs draft status (Uniform list API accepts one state per call).
 * Rows on each page are sorted with **not yet published** compositions first, then published.
 *
 * Response: CompositionsPageResponse
 */
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  CanvasClient,
  type ComponentDefinitionGetResponse,
} from '@uniformdev/canvas';
import { ApiClientError } from '@uniformdev/context/api';
import type { NextApiRequest, NextApiResponse } from 'next';

import { loadMeshDelegationSession } from '../../lib/util/delegationSession';

/**
 * Fields the Canvas composition list returns for each composition row (underscore-prefixed ids).
 * The generated OpenAPI typings for list responses are not narrowed to this shape here.
 */
type CanvasListComposition = {
  _id: string;
  _name: string;
  /**
   * Component definition id for this composition. List responses typically use `type`;
   * some payloads also expose `_type`.
   */
  type?: string;
  _type?: string;
  state?: number;
  projectMapNodes?: Array<{ path?: string }>;
};

/** Resolves the component definition id used to join `getComponentDefinitions()`. */
function compositionComponentTypeId(composition: CanvasListComposition): string {
  if (typeof composition.type === 'string' && composition.type.length > 0) {
    return composition.type;
  }
  if (typeof composition._type === 'string' && composition._type.length > 0) {
    return composition._type;
  }
  return '';
}

type CanvasCompositionListEnvelope = {
  compositions: Array<{ composition: CanvasListComposition }>;
};

/** Shaped composition data returned to the frontend. */
export interface CompositionListItem {
  id: string;
  name: string;
  /** Publishing state: 0 = draft, 64 = published. */
  state: number;
  /** Public ID of the component type (e.g. 'hero', 'articlePage'). */
  componentTypeId: string;
  /** Human-readable display name from the component definition. */
  componentTypeName: string;
  /** Icon name from the component definition, or null if not set. */
  componentTypeIcon: string | null;
  /** First project map node path bound to this composition, or null. */
  projectMapPath: string | null;
}

const COMPOSITIONS_PAGE_SIZE = 20;

/** Paginated list payload for the bulk-publish UI. */
export interface CompositionsPageResponse {
  items: CompositionListItem[];
  offset: number;
  pageSize: number;
  /** True when another page of draft compositions may exist (full page returned). */
  hasMore: boolean;
}

function parseOffset(raw: string | string[] | undefined): number {
  if (typeof raw !== 'string') {
    return 0;
  }
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

const KEYWORD_MAX_LENGTH = 256;

/**
 * Normalizes optional list `keyword` from the query string (trimmed, length-capped); returns `undefined` when empty.
 */
function parseKeyword(raw: string | string[] | undefined): string | undefined {
  if (typeof raw !== 'string') {
    return undefined;
  }
  const t = raw.trim().slice(0, KEYWORD_MAX_LENGTH);
  return t.length > 0 ? t : undefined;
}

/**
 * Puts compositions that have no published snapshot first; keeps relative order within each group (stable sort).
 */
function sortUnpublishedFirst(a: CompositionListItem, b: CompositionListItem): number {
  const rank = (item: CompositionListItem): number => (item.state === CANVAS_PUBLISHED_STATE ? 1 : 0);
  return rank(a) - rank(b);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { projectId, offset: offsetParam, keyword: keywordParam } = req.query;
  if (!projectId || typeof projectId !== 'string') {
    res.status(400).json({ error: 'projectId query param is required' });
    return;
  }
  const offset = parseOffset(offsetParam);
  const keyword = parseKeyword(keywordParam);

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
    bypassCache: true,
  });

  const listParamsBase = {
    skipPatternResolution: true as const,
    skipOverridesResolution: true as const,
    withProjectMapNodes: true as const,
    /** Real composition instances only (excludes composition/component patterns). */
    pattern: false as const,
    orderBy: ['updated_at_DESC'],
    limit: COMPOSITIONS_PAGE_SIZE,
    state: CANVAS_DRAFT_STATE,
  };

  const draftListParams = {
    ...listParamsBase,
    offset,
    ...(keyword !== undefined ? { keyword } : {}),
  };

  try {
    const [draftList, definitionsBody] = await Promise.all([
      canvasClient
        .getCompositionList(draftListParams)
        .then((body) => body as unknown as CanvasCompositionListEnvelope),
      canvasClient.getComponentDefinitions() as Promise<ComponentDefinitionGetResponse>,
    ]);

    const typeMap = new Map(definitionsBody.componentDefinitions.map((d) => [d.id, d]));

    const draftRows = draftList.compositions.map(({ composition }) => composition);
    const ids = draftRows.map((c) => c._id);

    let publishedEnvelope: CanvasCompositionListEnvelope = { compositions: [] };
    if (ids.length > 0) {
      publishedEnvelope = (await canvasClient.getCompositionList({
        ...listParamsBase,
        offset: 0,
        limit: COMPOSITIONS_PAGE_SIZE,
        state: CANVAS_PUBLISHED_STATE,
        compositionIDs: ids,
      })) as unknown as CanvasCompositionListEnvelope;
    }

    const publishedIds = new Set(publishedEnvelope.compositions.map(({ composition: c }) => c._id));

    const items: CompositionListItem[] = draftRows
      .map((composition) => {
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
      })
      .sort(sortUnpublishedFirst);

    const payload: CompositionsPageResponse = {
      items,
      offset,
      pageSize: COMPOSITIONS_PAGE_SIZE,
      hasMore: draftRows.length === COMPOSITIONS_PAGE_SIZE,
    };

    res.json(payload);
  } catch (err) {
    if (err instanceof ApiClientError) {
      res.status(err.statusCode ?? 502).json({ error: err.errorMessage || 'Upstream Uniform API error' });
      return;
    }
    throw err;
  }
}
