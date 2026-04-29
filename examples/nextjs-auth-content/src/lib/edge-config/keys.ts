/**
 * Returns the UNIFORM_PROJECT_ID used as the edge config key prefix.
 * Each site uses its full project ID to namespace its keys within a shared edge config.
 *
 * Example: "a67ec975-aa86-40d8-9b58-8bf9b42e0ec5"
 */
export function getEdgeConfigPrefix(): string {
  const projectId = process.env.UNIFORM_PROJECT_ID;
  if (!projectId) throw new Error('UNIFORM_PROJECT_ID is not set');
  return projectId;
}

/**
 * Returns a prefixed edge config key for the current site.
 * Multiple sites sharing an edge config use different prefixes.
 *
 * Example: getEdgeConfigKey('protectedRoutes') → "a67ec975-aa86-40d8-9b58-8bf9b42e0ec5_protectedRoutes"
 */
export function getEdgeConfigKey(key: string): string {
  return `${getEdgeConfigPrefix()}_${key}`;
}
