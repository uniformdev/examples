/**
 * Next.js API endpoint for rebuilding Coveo index from Uniform Project Map compositions.
 *
 * Usage:
 * GET /api/index-rebuild?secret=<UNIFORM_PREVIEW_SECRET>&locale=en
 *
 * Query parameters:
 * - secret: Required. Must match UNIFORM_PREVIEW_SECRET (returns 403 if missing or invalid)
 * - locale: Optional locale (default 'en'); for future localization use
 *
 * Env: UNIFORM_PREVIEW_SECRET, UNIFORM_API_KEY, UNIFORM_PROJECT_ID, UNIFORM_PROJECT_MAP_ID (required),
 *      UNIFORM_CLI_BASE_URL | UNIFORM_API_HOST, COVEO_BASE_URL | SITE_HOSTNAME,
 *      COVEO_ORG_ID, COVEO_SOURCE_ID, COVEO_BEARER_TOKEN
 *
 * Flow: Validates secret, returns 200 immediately, runs rebuild in background: fetches project map
 * nodes (compositions only), resolves each composition via RouteClient, builds Coveo docs
 * (search title, search description, URL) and optionally pushes to Coveo and/or writes debug JSON.
 */

import { connection, NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ProjectMapClient } from '@uniformdev/project-map';
import { RouteClient, flattenValues, CANVAS_PUBLISHED_STATE } from '@uniformdev/canvas';

/** When false, no PUT/DELETE to Coveo; only build docs and optional debug store. */
const ENABLE_COVEO_PUSH = process.env.COVEO_INDEX_REBUILD_ENABLE_PUSH === 'true';

/** When true, write each built Coveo document to coveo-result/ on the local filesystem. */
const ENABLE_DEBUG_STORE = process.env.COVEO_INDEX_REBUILD_ENABLE_DEBUG_STORE === 'true';

type CoveoDocument = {
  title?: string;
  description?: string;
  url?: string;
  [key: string]: unknown;
};

type PushRunState = {
  orderingId: number;
  anyPushFailed: boolean;
};

type PushResult = { ok: true; skipped?: true } | { ok: false; error: string };

export async function GET(request: NextRequest) {
  await connection();

  const searchParams = new URL(request.url).searchParams;
  const secret = searchParams.get('secret');
  const expectedSecret = process.env.UNIFORM_PREVIEW_SECRET;

  if (!secret || !expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const apiKey = process.env.UNIFORM_API_KEY;
  const projectId = process.env.UNIFORM_PROJECT_ID;
  const missing = [
    !apiKey && 'UNIFORM_API_KEY',
    !projectId && 'UNIFORM_PROJECT_ID'
  ].filter(Boolean) as string[];

  if (missing.length > 0) {
    const message = `Configuration is invalid: ${missing.join(', ')} are required.`;
    console.error(message);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  try {
    const locale = searchParams.get('locale') || 'en';
    rebuildIndexInBackground(locale).catch(err => {
      console.error('Error in background index rebuild:', err);
    });
    return NextResponse.json({ success: true, message: 'rebuild requested accepted' });
  } catch (error) {
    console.error('Error in index rebuild endpoint:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function rebuildIndexInBackground(_locale: string) {
  const pushRunState: PushRunState = {
    orderingId: Date.now(),
    anyPushFailed: false,
  };
  console.log(`Coveo orderingId: ${pushRunState.orderingId}`);

  const apiKey = process.env.UNIFORM_API_KEY!;
  const projectId = process.env.UNIFORM_PROJECT_ID!;

  const projectMapClient = new ProjectMapClient({
    apiKey,
    projectId,
    bypassCache: true,
  });

  // getNodes: single fetch. depth: -1 = full tree (all levels); use 1 for root-only. TODO: If the SDK adds limit/offset or cursor, paginate for very large project maps.
  let nodes: { path?: string; type?: string; compositionId?: string }[] = [];
  try {
    const response = await projectMapClient.getNodes({
      state: CANVAS_PUBLISHED_STATE
    });
    nodes = response.nodes ?? [];
  } catch (err) {
    console.error('Failed to fetch project map nodes:', err);
    return;
  }

  const compositionNodes = nodes.filter(
    n => n.path && n.type === 'composition' && n.compositionId
  );

  const routeClient = new RouteClient({
    apiKey,
    projectId,
    bypassCache: true,
  });

  const baseUrl = process.env.COVEO_INDEX_REBUILD_SITE_HOSTNAME;
  if (!baseUrl && ENABLE_COVEO_PUSH) {
    console.warn('COVEO_BASE_URL or SITE_HOSTNAME not set; document URLs may be invalid.');
  }

  let found = 0;
  let pushed = 0;
  let firstError: string | undefined;

  if (ENABLE_DEBUG_STORE) {
    console.log('Writing debug store data into the folder: ', path.join(process.cwd(), 'coveo-result'));
  }

  for (const node of compositionNodes) {
    const nodePath = node.path!;
    try {
      const res = await routeClient.getRoute({
        path: nodePath,
        state: CANVAS_PUBLISHED_STATE,
      });

      if (res.type !== 'composition') continue;

      const composition = res.compositionApiResponse?.composition;
      if (!composition?.parameters) {
        console.log(`Missing parameters on composition with id: ${composition?._id ?? 'unknown'}`);
        continue;
      }

      const params = flattenValues(composition);
      const searchTitle = params?.searchTitle as string ?? '';
      const searchDescription = params?.searchDescription as string ?? '';

      if (!searchTitle?.trim() || !searchDescription?.trim()) continue;

      const fullUrl = baseUrl ? `${baseUrl}${nodePath.startsWith('/') ? '' : '/'}${nodePath}` : nodePath;

      const coveoDoc: CoveoDocument = {
        title: searchTitle,
        description: searchDescription,
        url: fullUrl,
      };

      found++;

      if (ENABLE_DEBUG_STORE) { 
        const relPath = nodePath === '/' ? 'index.json' : `${nodePath.replace(/^\//, '')}.json`;
        const outPath = path.join(process.cwd(), 'coveo-result', relPath);
        await fs.mkdir(path.dirname(outPath), { recursive: true });
        await fs.writeFile(outPath, JSON.stringify(coveoDoc, null, 2), 'utf-8');
      }

      const pushResult = await pushToCoveo(coveoDoc, fullUrl, pushRunState);
      if (pushResult.ok && !pushResult.skipped) pushed++;
      if (!pushResult.ok) {
        pushRunState.anyPushFailed = true;
        if (!firstError) firstError = pushResult.error;
        console.error(`Push failed for ${nodePath}:`, pushResult.error);
      }

      await new Promise(r => setTimeout(r, 250));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!firstError) firstError = msg;
      console.error(`Error processing node ${nodePath}:`, msg);
    }
  }

  console.log(
    `Compositions: found=${found}, pushed=${pushed}${firstError ? ', errors occurred' : ''}`
  );

  if (ENABLE_COVEO_PUSH && !pushRunState.anyPushFailed) {
    const deleted = await deleteOldItemsFromCoveo(pushRunState);
    if (!deleted) console.error('Delete old items from Coveo failed.');
  } else if (ENABLE_COVEO_PUSH && pushRunState.anyPushFailed) {
    console.warn(`Skipping delete-old-items due to push failures (orderingId=${pushRunState.orderingId}).`);
  }

  console.log('Index rebuild completed');
}

async function pushToCoveo(
  doc: CoveoDocument,
  documentId: string,
  state: PushRunState
): Promise<PushResult> {
  if (!ENABLE_COVEO_PUSH) return { ok: true, skipped: true };

  const coveoOrgId = process.env.COVEO_ORG_ID;
  const coveoSourceId = process.env.COVEO_SOURCE_ID;
  const coveoBearerToken = process.env.COVEO_BEARER_TOKEN;

  if (!coveoOrgId || !coveoSourceId || !coveoBearerToken) {
    return {
      ok: false,
      error: 'Missing Coveo config (COVEO_ORG_ID / COVEO_SOURCE_ID / COVEO_BEARER_TOKEN)',
    };
  }

  const encodedId = encodeURIComponent(documentId);
  const url = `https://api.cloud.coveo.com/push/v1/organizations/${coveoOrgId}/sources/${coveoSourceId}/documents?documentId=${encodedId}&orderingId=${state.orderingId}`;

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${coveoBearerToken}`,
      },
      body: JSON.stringify(doc),
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        error: `Coveo PUT ${res.status}: ${text}`,
      };
    }
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

async function deleteOldItemsFromCoveo(state: PushRunState): Promise<boolean> {
  if (!ENABLE_COVEO_PUSH) return true;

  const coveoOrgId = process.env.COVEO_ORG_ID;
  const coveoSourceId = process.env.COVEO_SOURCE_ID;
  const coveoBearerToken = process.env.COVEO_BEARER_TOKEN;

  if (!coveoOrgId || !coveoSourceId || !coveoBearerToken) return false;

  const url = `https://api.cloud.coveo.com/push/v1/organizations/${coveoOrgId}/sources/${coveoSourceId}/documents/olderthan?orderingId=${state.orderingId}`;

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${coveoBearerToken}`,
      },
      body: '{}',
    });
    if (!res.ok) {
      console.error('Delete old items failed:', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('Delete old items error:', err);
    return false;
  }
}
