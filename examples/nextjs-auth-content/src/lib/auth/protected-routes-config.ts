import { getEdgeConfigKey } from '../edge-config/keys';
import { cachePureFn } from '../../utils/cache';
import { get as getEdgeConfig, getAll as getAllEdgeConfig } from '@vercel/edge-config';
import { normalizePath } from './normalize-route-path';
import type { RouteAccessRule } from './protected-routes';
import { DEFAULT_ACCESS_CONFIG, ERROR_ACCESS_CONFIG } from "@/src/lib/auth/auth-settings"

const ACCESS_CONFIG_KEY = 'accessConfig';

const MARKER_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** True if the two rule sets are equivalent (order-independent); rule paths are normalized before comparison. */
export function routeAccessRulesEqual(a: RouteAccessRule[], b: RouteAccessRule[]): boolean {
  if (a.length !== b.length) return false;

  const sortedA = a
    .map(rule => `${normalizePath(rule.path)}::${rule.self ?? 'null'}::${rule.children ?? 'null'}`)
    .sort();

  const sortedB = b
    .map(rule => `${normalizePath(rule.path)}::${rule.self ?? 'null'}::${rule.children ?? 'null'}`)
    .sort();

  return sortedA.every((val, i) => val === sortedB[i]);
}

/**
 * Parses an ISO marker string and returns its epoch time and age in milliseconds.
 * Non-strings and invalid dates yield `markerTime: null` and `age: Infinity`.
 */
export function markerAge(marker: string | null | undefined) {
  if (typeof marker !== 'string') return { markerTime: null, age: Infinity };
  const markerTime = new Date(marker).getTime();
  if (isNaN(markerTime)) return { markerTime: null, age: Infinity };
  const age = Date.now() - markerTime;
  return {
    markerTime,
    age,
  };
}

/**
 * Whether the debounce marker is younger than five minutes (strictly less than TTL).
 * Logs at info level when the marker is missing, invalid, or expired.
 */
export function isMarkerActive(marker: string | null | undefined): boolean {
  const { markerTime, age } = markerAge(marker);
  if (!markerTime) return false;
  const active = age < MARKER_TTL_MS;
  if (!active) {
    console.info(`Webhook debounce: marker not active, ${markerTime} age of ${age} milliseconds`);
  }
  return active;
}

/**
 * Single batched read of `accessConfig` and the `accessConfigUpdatePending` marker from Edge Config.
 * If `EDGE_CONFIG` is unset, on error, or `accessConfig` is missing/invalid, returns
 * `{ marker: null, accessConfig: DEFAULT_ACCESS_CONFIG }`.
 */
export async function readEdgeConfigMarkerAndAccessConfig(): Promise<{
  marker: string | null;
  accessConfig: RouteAccessRule[];
}> {
  try {
    if (process.env.EDGE_CONFIG) {
      const keys = [getEdgeConfigKey(ACCESS_CONFIG_KEY), getEdgeConfigKey(`${ACCESS_CONFIG_KEY}UpdatePending`)];
      const result = await getAllEdgeConfig(keys);
      const accessConfig = result?.[getEdgeConfigKey(ACCESS_CONFIG_KEY)];
      const marker = result?.[getEdgeConfigKey(`${ACCESS_CONFIG_KEY}UpdatePending`)];
      return {
        marker: typeof marker === 'string' ? marker : null,
        accessConfig: Array.isArray(accessConfig) ? accessConfig : DEFAULT_ACCESS_CONFIG,
      };
    } else {
      console.warn('No EDGE_CONFIG environment variable found, using defaults for marker and accessConfig');
    }
  } catch (error) {
    console.error('Error reading Edge Config marker and accessConfig:', error);
  }
  return { marker: null, accessConfig: DEFAULT_ACCESS_CONFIG };
}

/**
 * Upserts the pending-update marker (ISO timestamp) into Edge Config via the Vercel API.
 * @returns The written marker string, or `undefined` if `EDGE_CONFIG_ID` / `VERCEL_API_TOKEN` are missing.
 * @throws If the Vercel API responds with an error.
 */
export async function writeEdgeConfigMarker(): Promise<string | undefined> {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const vercelToken = process.env.VERCEL_API_TOKEN;

  const marker = new Date().toISOString();

  if (!edgeConfigId || !vercelToken) {
    console.warn('Missing EDGE_CONFIG_ID or VERCEL_API_TOKEN, skipping marker write');
    return marker;
  }

  const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          operation: 'upsert',
          key: getEdgeConfigKey(`${ACCESS_CONFIG_KEY}UpdatePending`),
          value: marker,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to write Edge Config marker: ${error}`);
  }
  return marker;
}

/**
 * Deletes the pending-update marker key from Edge Config via the Vercel API.
 * No-op when `EDGE_CONFIG_ID` or `VERCEL_API_TOKEN` is missing.
 * @throws If the Vercel API responds with an error.
 */
export async function clearEdgeConfigMarker(): Promise<void> {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const vercelToken = process.env.VERCEL_API_TOKEN;

  if (!edgeConfigId || !vercelToken) {
    console.warn('Missing EDGE_CONFIG_ID or VERCEL_API_TOKEN, skipping marker clear');
    return;
  }

  const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          operation: 'delete',
          key: getEdgeConfigKey(`${ACCESS_CONFIG_KEY}UpdatePending`),
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to clear Edge Config marker: ${error}`);
  }
}

/**
 * We will update this variable when successfully read the access config.
 *
 * If the initial attempt fails in prod, then the error config will be returned.
 */
let _accessConfig: RouteAccessRule[] =
  process.env.NODE_ENV === 'development' ? DEFAULT_ACCESS_CONFIG : ERROR_ACCESS_CONFIG;

/**
 * Reads the `accessConfig` array from Edge Config (when `EDGE_CONFIG` is set).
 * Populated/updated by the debounced Uniform webhook when composition types in
 * `ALLOWED_PAGE_TYPES` (`src/app/api/webhooks/uniform/route.ts`) publish or delete; rules are rebuilt via `fetchAccessConfig`.
 *
 * @returns The non-empty rule list from Edge Config, or `undefined` if unavailable, empty, or not an array.
 */
export const getAccessConfigFromConfig = cachePureFn(500, async function getAccessConfigFromConfig(): Promise<
  RouteAccessRule[]
> {
  try {
    if (process.env.EDGE_CONFIG) {
      const rules = await getEdgeConfig<RouteAccessRule[]>(getEdgeConfigKey(ACCESS_CONFIG_KEY));
      if (Array.isArray(rules) && rules.length > 0) {
        _accessConfig = rules;
        return rules;
      }
    } else {
      console.warn('No EDGE_CONFIG environment variable found, using local accessConfig');
      return _accessConfig;
    }
  } catch (error) {
    console.error('Error fetching accessConfig from Edge Config:', error);
  }
  return _accessConfig;
});

/**
 * Persists `accessConfig` to Edge Config via the Vercel API.
 * When `options.clearMarker` is true, also deletes the pending-update marker.
 * Without `EDGE_CONFIG_ID` and `VERCEL_API_TOKEN`, updates only the in-memory access config used in that environment.
 */
export async function updateEdgeConfig(rules: RouteAccessRule[], options?: { clearMarker?: boolean }): Promise<void> {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const vercelToken = process.env.VERCEL_API_TOKEN;

  if (edgeConfigId && vercelToken) {
    const items: Array<{ operation: string; key: string; value?: unknown }> = [
      { operation: 'upsert', key: getEdgeConfigKey(ACCESS_CONFIG_KEY), value: rules },
    ];

    if (options?.clearMarker) {
      items.push({ operation: 'delete', key: getEdgeConfigKey(`${ACCESS_CONFIG_KEY}UpdatePending`) });
    }

    const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update Edge Config: ${error}`);
    }
  } else {
    console.warn('Missing EDGE_CONFIG_ID and VERCEL_API_TOKEN environment variables, only updating in-memory config');
    console.warn(JSON.stringify(rules, null, 2));
    _accessConfig = rules;
  }
}
