import { error } from "@sveltejs/kit";
import { RouteClient } from "@uniformdev/canvas";

import { env } from "$env/dynamic/private";

import type { PageServerLoad } from "./$types";

// ISR on Vercel - pages revalidate every 60 seconds
import { createVercelIsrConfig } from "@uniformdev/canvas-sveltekit";
export const config = createVercelIsrConfig({
  expiration: 60,
});

/**
 * Check if Uniform credentials are configured.
 * Project map ID is optional - the API will use the default project map if not specified.
 */
function hasUniformCredentials(): boolean {
  return Boolean(env.UNIFORM_API_KEY && env.UNIFORM_PROJECT_ID);
}

/**
 * Load function that fetches compositions from Uniform Canvas.
 *
 * Prerequisites:
 * 1. Set environment variables:
 *    - UNIFORM_API_KEY
 *    - UNIFORM_PROJECT_ID
 *    - UNIFORM_PROJECT_MAP_ID
 *
 * 2. Create compositions in Uniform Canvas and assign them to project map nodes.
 *
 * Falls back to demo data when credentials are not configured.
 */
export const load: PageServerLoad = async (event) => {
  // Return demo composition if no credentials are configured
  if (!hasUniformCredentials()) {
    error(
      500,
      "Uniform credentials not configured. Set UNIFORM_API_KEY and UNIFORM_PROJECT_ID in your .env file."
    );
  }

  // Lazy import to avoid initialization errors when credentials are missing
  const { createUniformLoad } = await import(
    "@uniformdev/canvas-sveltekit/route"
  );

  // Create RouteClient with SvelteKit env vars
  const client = new RouteClient({
    apiKey: env.UNIFORM_API_KEY,
    projectId: env.UNIFORM_PROJECT_ID,
  });

  const uniformLoad = createUniformLoad({
    // Pass the client configured with SvelteKit env vars
    client,

    // Project map ID (optional - uses default if not set)
    projectMapId: env.UNIFORM_PROJECT_MAP_ID,

    // The route parameter name (matches [...path])
    param: "path",

    // Uncomment to disable console logging
    // silent: true,

    // Uncomment to customize API requests
    // requestOptions: {
    //   skipEnhance: false,
    //   skipPatternResolution: false,
    // },
  });

  return uniformLoad(event);
};
