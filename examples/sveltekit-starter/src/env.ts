import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * Accepts a missing value so the starter can boot before Uniform credentials are set.
 */
function optionalString(value: string | undefined): string | undefined {
  return value;
}

export const variables = defineEnvVars({
  UNIFORM_API_KEY: { schema: optionalString },
  UNIFORM_PROJECT_ID: { schema: optionalString },
  UNIFORM_PROJECT_MAP_ID: { schema: optionalString },
  UNIFORM_PREVIEW_SECRET: { schema: optionalString },
});
