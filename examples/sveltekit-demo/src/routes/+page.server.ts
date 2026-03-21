import { error } from "@sveltejs/kit";
import { RouteClient } from "@uniformdev/canvas";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

function hasUniformCredentials(): boolean {
  return Boolean(env.UNIFORM_API_KEY && env.UNIFORM_PROJECT_ID);
}

// ISR on Vercel - pages revalidate every 60 seconds
import { createVercelIsrConfig } from "@uniformdev/canvas-sveltekit";
export const config = createVercelIsrConfig({
  expiration: 60,
});

export const load: PageServerLoad = async (event) => {
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

  const client = new RouteClient({
    apiKey: env.UNIFORM_API_KEY,
    projectId: env.UNIFORM_PROJECT_ID,
  });

  const uniformLoad = createUniformLoad({
    client,
    handleNotFound: () => ({
      data: null,
      matchedRoute: null,
      dynamicInputs: null,
    }),
  });

  return uniformLoad(event);
};
