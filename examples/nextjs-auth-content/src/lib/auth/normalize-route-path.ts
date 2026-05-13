/**
 * Canonical URL path for routing comparisons.
 *
 * Trims whitespace, ensures a single leading `/`, collapses repeated slashes,
 * strips trailing slashes (except root), and maps empty input to `/`.
 * Kept in a separate module to avoid an import cycle between protected-routes and protected-routes-config.
 */
export function normalizePath(path: string): string {
  if (!path) return '/';

  const trimmed = path.trim();

  if (!trimmed || trimmed === '/') return '/';

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  return withLeadingSlash.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
}
