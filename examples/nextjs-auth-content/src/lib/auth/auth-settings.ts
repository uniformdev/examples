import type { RouteAccessRule } from "@/src/lib/auth/protected-routes"

export const ALLOWED_PAGE_TYPES: string[] = ['page'];

/**
 * This config will be used when there is an error loading access details from the edge config
 */
export const ERROR_ACCESS_CONFIG: RouteAccessRule[] = [{ path: '/', self: 'private', children: 'private' }];

/**
 * These rules will always be included unless
 * a rule matching the same path exists from the content
 */
export const DEFAULT_ACCESS_CONFIG: RouteAccessRule[] = [
  { path: '/protected', self: 'private', children: 'private' },
];
