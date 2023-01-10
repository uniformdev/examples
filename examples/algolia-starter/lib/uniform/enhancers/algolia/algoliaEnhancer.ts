import {
  createEnhancer,
  ALGOLIA_PARAMETER_TYPES,
  AlgoliaClient,
} from "@uniformdev/canvas-algolia";
import { EnhancerDefinition } from "../types";
import { validateAndGetEnvVars } from "../utils";

export const enhancerDefinition: EnhancerDefinition = {
  name: "Algolia",
  getConfiguration,
  getEnhancer,
  parameterTypes: ALGOLIA_PARAMETER_TYPES,
};

function getConfiguration() {
  const config = validateAndGetEnvVars([
    "ALGOLIA_APPLICATION_ID",
    "ALGOLIA_API_KEY",
  ]);

  return config;
}

function getEnhancer() {
  const { envVars } = getConfiguration();

  const client = new AlgoliaClient({
    applicationId: envVars.ALGOLIA_APPLICATION_ID,
    searchKey: envVars.ALGOLIA_API_KEY,
  });
  return createEnhancer({
    clients: client,
  });
}
