import type { RootComponentInstance } from "@uniformdev/canvas"

export interface CompositionApiOptions {
  /** Base URL for the API. Defaults to '' (same origin / relative URLs). */
  apiBase?: string;
  /** Optional transform applied to the path before fetching by path */
  transformPath?: (path: string) => string;
}

export interface CompositionApi {
  fetchComposition: (path: string) => Promise<RootComponentInstance>;
  fetchCompositionById: (compositionId: string, state: string) => Promise<RootComponentInstance>;
}

export function createCompositionApi(options: CompositionApiOptions = {}): CompositionApi {
  const { apiBase = '', transformPath } = options;

  return {
    async fetchComposition(path: string): Promise<RootComponentInstance> {
      const resolvedPath = transformPath ? transformPath(path) : path;
      const response = await fetch(`${apiBase}/api/composition?path=${encodeURIComponent(resolvedPath)}`);
      const json = response.json();
      if (response.ok) {
        return json;
      } else {
        console.error('Failed to fetch composition', response.status, response.statusText, json);
        throw new Error(`Failed to fetch composition: ${response.status} ${response.statusText}`);
      }
    },

    async fetchCompositionById(compositionId: string, state: string): Promise<RootComponentInstance> {
      const response = await fetch(`${apiBase}/api/composition-by-id?compositionId=${encodeURIComponent(compositionId)}&state=${encodeURIComponent(state)}`);
      const json = response.json();
      if (response.ok) {
        return json;
      } else {
        console.error('Failed to fetch composition', response.status, response.statusText, json);
        throw new Error(`Failed to fetch composition: ${response.status} ${response.statusText}`);
      }
    },
  };
}
