import type { ManifestV2 } from '@uniformdev/context';
import { ManifestClient } from '@uniformdev/context/api';
import { createHash } from 'node:crypto';

import bundledManifest from './manifest.json';

/**
 * Server-side source of the Uniform Context manifest.
 *
 * The manifest describes the signals, enrichments, aggregates and tests a visitor can
 * be scored against. `Context.update()` silently drops any score for a dimension that
 * is not in the manifest, so a stale manifest shows up as personalization that never
 * fires rather than as an error — which is why this is fetched live instead of being
 * imported from a JSON snapshot committed to the repo.
 *
 * The lifecycle mirrors `@uniformdev/next-app-router`, which fetches the manifest with
 * `ManifestClient` behind a cache tagged `manifest` and drops that tag when the
 * `manifest.published` webhook arrives. Here the cache is a process-local snapshot with
 * a TTL, and {@link refreshUniformManifest} is the equivalent of `revalidateTag`.
 *
 * Node-only: never import this from code that reaches the browser bundle (it pulls in
 * `@uniformdev/context/api` and the API key).
 */
export interface UniformManifestSnapshot {
  manifest: ManifestV2;
  /**
   * Content hash of the manifest. Changes exactly when the manifest changes, so the
   * browser can tell "the server has a newer manifest than the one I booted with"
   * without diffing the whole document.
   */
  revision: string;
  /** Epoch ms at which this snapshot was produced. */
  fetchedAt: number;
  /** `uniform` for a live fetch, `bundled` for the committed offline fallback. */
  source: 'uniform' | 'bundled';
}

/**
 * How long a fetched manifest is served before the next render refetches it.
 * Override with `UNIFORM_MANIFEST_TTL_SECONDS`; `0` refetches on every render.
 * The `manifest.published` webhook makes updates land without waiting for the TTL.
 */
const DEFAULT_TTL_SECONDS = 300;

const BUNDLED_SNAPSHOT: UniformManifestSnapshot = {
  manifest: bundledManifest as ManifestV2,
  revision: `bundled-${hash(bundledManifest)}`,
  fetchedAt: 0,
  source: 'bundled',
};

let cached: UniformManifestSnapshot | undefined;
/** De-duplicates concurrent refreshes so a burst of requests triggers one API call. */
let inFlight: Promise<UniformManifestSnapshot> | undefined;

function hash(value: unknown): string {
  return createHash('sha1').update(JSON.stringify(value)).digest('hex').slice(0, 12);
}

function ttlMs(): number {
  const configured = Number(process.env['UNIFORM_MANIFEST_TTL_SECONDS']);

  return (Number.isFinite(configured) && configured >= 0 ? configured : DEFAULT_TTL_SECONDS) * 1000;
}

function isFresh(snapshot: UniformManifestSnapshot): boolean {
  return Date.now() - snapshot.fetchedAt < ttlMs();
}

/**
 * Fetches the published manifest from Uniform.
 * Returns undefined when the project is not configured (local demo mode).
 *
 * `bypassCache` skips Uniform's edge cache — used for webhook/forced refreshes, where
 * the whole point is to see the manifest that was just published.
 */
async function fetchFromUniform(bypassCache: boolean): Promise<UniformManifestSnapshot | undefined> {
  const projectId = process.env['UNIFORM_PROJECT_ID'];
  const apiKey = process.env['UNIFORM_API_KEY'];

  if (!projectId || !apiKey) {
    return undefined;
  }

  const client = new ManifestClient({ projectId, apiKey, bypassCache });
  const manifest = (await client.get()) as ManifestV2;

  return {
    manifest,
    revision: hash(manifest),
    fetchedAt: Date.now(),
    source: 'uniform',
  };
}

/**
 * Returns the manifest to render with, refetching when the cached copy has expired
 * (or when `forceRefresh` is set).
 *
 * Never throws: a failed fetch keeps serving the last known good manifest, falling back
 * to the bundled snapshot on a cold start. A transient Uniform outage degrades to
 * slightly stale personalization instead of a failed page render.
 */
export async function getUniformManifest(options?: {
  forceRefresh?: boolean;
}): Promise<UniformManifestSnapshot> {
  const forceRefresh = options?.forceRefresh ?? false;

  if (!forceRefresh && cached && isFresh(cached)) {
    return cached;
  }

  // A forced refresh always starts its own fetch: joining an in-flight cached read
  // could hand back the very copy the caller is trying to invalidate.
  if (forceRefresh) {
    return refetch(true);
  }

  inFlight ??= refetch(false).finally(() => {
    inFlight = undefined;
  });

  return inFlight;
}

async function refetch(bypassCache: boolean): Promise<UniformManifestSnapshot> {
  try {
    const fetched = await fetchFromUniform(bypassCache);

    if (fetched) {
      cached = fetched;
    } else {
      // No credentials: local demo mode runs on the committed manifest. Stamped with
      // `fetchedAt` so it is not re-derived on every render.
      cached = { ...BUNDLED_SNAPSHOT, fetchedAt: Date.now() };
    }
  } catch (error) {
    console.error('[demo] Failed to fetch the Uniform Context manifest', error);

    // Keep serving whatever we last had; only fall back to the bundle on a cold start.
    cached ??= { ...BUNDLED_SNAPSHOT, fetchedAt: Date.now() };
  }

  return cached;
}

/**
 * Discards the cached manifest and refetches it immediately, bypassing Uniform's edge
 * cache — the equivalent of `revalidateTag('manifest')` in the Next.js SDK, called by
 * the `manifest.published` webhook (see `/api/uniform-webhook` in `server.ts`).
 *
 * Refetching eagerly rather than just clearing the cache keeps the fetch latency off the
 * next visitor's render, and means a failed refresh leaves the previous manifest in place
 * instead of dropping the app to the bundled fallback.
 *
 * Reports whether the manifest actually changed so callers can log something meaningful.
 */
export async function refreshUniformManifest(): Promise<{
  snapshot: UniformManifestSnapshot;
  changed: boolean;
}> {
  const previousRevision = cached?.revision;

  const snapshot = await getUniformManifest({ forceRefresh: true });

  return { snapshot, changed: snapshot.revision !== previousRevision };
}
