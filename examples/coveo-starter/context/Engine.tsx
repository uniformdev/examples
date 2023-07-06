import { buildSearchEngine, getOrganizationEndpoints } from "@coveo/headless";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { applicationId, coveoApiKey },
} = getConfig();

const headlessEngine = buildSearchEngine({
  configuration: {
    organizationId: applicationId,
    accessToken: coveoApiKey,
    organizationEndpoints: getOrganizationEndpoints(applicationId),
  },
});

export default headlessEngine;
