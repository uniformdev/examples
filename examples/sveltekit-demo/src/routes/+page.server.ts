import { error } from '@sveltejs/kit';
import { RouteClient } from '@uniformdev/canvas';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

function hasUniformCredentials(): boolean {
  return Boolean(env.UNIFORM_API_KEY && env.UNIFORM_PROJECT_ID);
}

export const load: PageServerLoad = async (event) => {
  if (!hasUniformCredentials()) {
    error(500, 'Uniform credentials not configured. Set UNIFORM_API_KEY and UNIFORM_PROJECT_ID in your .env file.');
  }

  // Lazy import to avoid initialization errors when credentials are missing
  const { createUniformLoad } = await import('@uniformdev/canvas-sveltekit/route');

  const client = new RouteClient({
    apiKey: env.UNIFORM_API_KEY,
    projectId: env.UNIFORM_PROJECT_ID,
  });

  const uniformLoad = createUniformLoad({
    client,
    projectMapId: env.UNIFORM_PROJECT_MAP_ID,
    // Force home path for the root route
    resolvePath: () => '/',
  });

  return uniformLoad(event);
};
