import { CompositionGetListResponse, RootComponentInstance } from '@uniformdev/canvas';
import { DisplayUser } from './auth-helpers';
import { ALLOWED_PAGE_TYPES, DEFAULT_ACCESS_CONFIG } from './auth-settings';
import { getAccessConfigFromConfig } from './protected-routes-config';
import { canvasClient, projectMapClient } from '../uniform-client';
import { removeLocaleFromPath } from '../../utils/formatPath';
import { normalizePath } from './normalize-route-path';

// Parameters
type AccessValue = 'public' | 'private' | null;
type ResolvedAccess = ['public' | 'private', RouteAccessRule | null];
export type RouteAccessRule = { path: string; self: AccessValue; children: AccessValue };

export enum ACCESS_TYPES {
  NotSet = 'notSet',
  Public = 'public',
  AuthenticatedChildRoutes = 'authenticatedChildRoutes',
  AuthenticatedRoute = 'authenticatedRoute',
  AuthenticatedRouteAndChildren = 'authenticatedRouteAndChildren',
}

const ACCESS_TYPE_PARAMETER = 'accessType';
const ACCESS_TYPES_VALUES = Object.values(ACCESS_TYPES);

function getAccessTypeAndRoles(composition: RootComponentInstance): { accessType: ACCESS_TYPES } {
  const accessType = composition?.parameters?.[ACCESS_TYPE_PARAMETER]?.value;
  if (ACCESS_TYPES_VALUES.includes(accessType as ACCESS_TYPES)) {
    return { accessType: accessType as ACCESS_TYPES };
  }
  return { accessType: ACCESS_TYPES.NotSet };
}

function getAccessRuleByAccessType(path: string, accessType?: string): RouteAccessRule | null {
  switch (accessType) {
    case ACCESS_TYPES.Public:
      return { path, self: 'public', children: 'public' };
    case ACCESS_TYPES.AuthenticatedChildRoutes:
      return { path, self: 'public', children: 'private' };
    case ACCESS_TYPES.AuthenticatedRoute:
      return { path, self: 'private', children: 'public' };
    case ACCESS_TYPES.AuthenticatedRouteAndChildren:
      return { path, self: 'private', children: 'private' };
    default:
      return null;
  }
}

function mergeRouteRules(current: RouteAccessRule | undefined, next: RouteAccessRule): RouteAccessRule {
  if (!current) return next;

  return {
    path: next.path,
    self: next.self !== null ? next.self : current.self,
    children: next.children !== null ? next.children : current.children,
  };
}

const getFullCompositionList = async ({
  limit = 50,
  ...restProps
}): Promise<CompositionGetListResponse['compositions']> => {
  try {
    // First, get the total count with a minimal request
    const { totalCount = 0 } = await canvasClient.getCompositionList({
      limit: 1,
      offset: 0,
      withTotalCount: true,
      resolveData: false,
      skipPatternResolution: true,
      skipOverridesResolution: true,
      ...restProps,
    });

    // If no compositions, return early
    if (totalCount === 0) return [];

    // Calculate how many requests we need
    const totalPages = Math.ceil(totalCount / limit);

    // Create array of promises for parallel fetching
    const promises = Array.from({ length: totalPages }, (_, i) =>
      canvasClient
        .getCompositionList({
          limit,
          offset: i * limit,
          withTotalCount: false,
          resolveData: true,
          diagnostics: false,
          ...restProps,
        })
        .then(response => response.compositions)
    );

    // Fetch all pages in parallel
    const results = await Promise.all(promises);

    // Flatten the results
    return results.flat();
  } catch (error) {
    console.error('Error fetching composition list:', error);
    return [];
  }
};

/**
 * Builds the full route access rule list from Uniform: `GeneralPurposePage` compositions whose `accessType`
 * is public or authenticated, merged with {@link DEFAULT_ACCESS_CONFIG} and project-map paths for each composition.
 *
 * @returns Merged rules, or an empty array if the Uniform request fails.
 */
export async function fetchAccessConfig(): Promise<RouteAccessRule[]> {
  try {
    const result = (
      await Promise.all(
        ALLOWED_PAGE_TYPES.map(type =>
          getFullCompositionList({
            filters: {
              [`type[eq]`]: type,
              [`parameters.${ACCESS_TYPE_PARAMETER}[def]`]: true,
            },
          })
        )
      )
    ).flat();

    const rulesMap = new Map<string, RouteAccessRule>();

    for (const member of result) {
      const { composition } = member;

      const route = await projectMapClient.getNodes({
        compositionId: composition._id,
      });

      const { accessType } = getAccessTypeAndRoles(composition);

      for (const node of route.nodes ?? []) {
        const pathname = node.path;

        if (typeof pathname !== 'string') {
          continue;
        }

        const normalizedPath = normalizePath(pathname);
        const rule = getAccessRuleByAccessType(normalizedPath, accessType);

        if (!rule) {
          continue;
        }

        const existingRule = rulesMap.get(normalizedPath);
        rulesMap.set(normalizedPath, mergeRouteRules(existingRule, rule));
      }
    }

    // Include any default rules as long as they don't already exist
    for (const rule of DEFAULT_ACCESS_CONFIG) {
      const normalizedPath = normalizePath(rule.path);
      if (!rulesMap.has(normalizedPath)) {
        rulesMap.set(normalizedPath, rule);
      }
    }

    return Array.from(rulesMap.values());
  } catch (error) {
    console.error('Error fetching route access rules:', error);
    return DEFAULT_ACCESS_CONFIG;
  }
}

/**
 * Match a pathname against a route pattern.
 *
 * - Exact pattern (`/dashboard`) matches only that exact path.
 * - Wildcard pattern (`/dashboard/**`) matches all descendants
 *   (e.g. `/dashboard/settings`, `/dashboard/a/b`) but NOT `/dashboard` itself.
 *
 * Use both entries together to protect a path and all its children.
 */
export function matchesRoute(pathname: string, pattern: string): boolean {
  if (pattern.endsWith('/**')) {
    const base = pattern.slice(0, -3); // strip /**
    return pathname.startsWith(base + '/');
  }
  return pathname === pattern;
}

/**
 * Splits a path into increasingly specific segments
 *
 * @example
 *
 * pathname = '/a/b/c'
 * result = ['/', '/a', '/a/b', '/a/b/c']
 */
function getPathChain(pathname: string): string[] {
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath === '/') {
    return ['/'];
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  const chain: string[] = ['/'];

  let current = '';
  for (const segment of segments) {
    current += `/${segment}`;
    chain.push(current);
  }

  return chain;
}

/**
 * Resolves effective access for a pathname by walking `/`, `/seg1`, … up to the target path.
 * Ancestors contribute via `children`; the target uses `self` when set, otherwise inherited access (default public).
 */
export function resolveRouteAccess(pathname: string, rules: RouteAccessRule[]): ResolvedAccess {
  const normalizedPath = normalizePath(pathname);
  const chain = getPathChain(normalizedPath);

  const rulesMap = new Map<string, RouteAccessRule>();

  for (const rule of rules) {
    const normalizedRulePath = normalizePath(rule.path);

    rulesMap.set(normalizedRulePath, {
      path: normalizedRulePath,
      self: rule.self ?? null,
      children: rule.children ?? null,
    });
  }

  let inheritedAccess: ResolvedAccess = ['public', null];

  for (const currentPath of chain) {
    const rule = rulesMap.get(currentPath);
    const isTarget = currentPath === normalizedPath;

    if (!isTarget) {
      if (rule?.children) {
        inheritedAccess = [rule.children, rule];
      }
      continue;
    }

    // On the target path, `self` overrides inherited access.
    if (rule?.self) {
      return [rule.self, rule];
    }

    return inheritedAccess;
  }

  return inheritedAccess;
}

/**
 * Validate access to a rule based on a user with roles
 */
export function validateResolvedUserAccess(resolved: ResolvedAccess, user: DisplayUser | undefined) {
  const [access] = resolved;
  if (access === 'public') {
    return true;
  }
  return !!user;
}

/**
 * Resolve required access and rule for an unknown request path
 *
 * Locale prefix is stripped before matching.
 */
export async function getAccessRuleForPath(path: string) {
  const pathnameWithoutLocale = removeLocaleFromPath(path);
  const accessConfig = await getAccessConfigFromConfig();
  return resolveRouteAccess(pathnameWithoutLocale, accessConfig);
}

/**
 * Whether a user has access to a path
 */
export async function isProtectedPathAllowedForUser(path: string, user: DisplayUser | undefined): Promise<boolean> {
  const resolved = await getAccessRuleForPath(path);
  return validateResolvedUserAccess(resolved, user);
}
