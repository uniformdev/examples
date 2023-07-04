import { buildSearchEngine, buildContext, getOrganizationEndpoints } from "@coveo/headless";
import * as process from "process";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { applicationId, coveoApiKey },
} = getConfig();

const headlessEngine = buildSearchEngine({
  configuration: {
    organizationId: applicationId,
    accessToken: coveoApiKey,
    organizationEndpoints: getOrganizationEndpoints(applicationId)
  },
});

buildContext(headlessEngine).add("website", "engineering");

export default headlessEngine;
