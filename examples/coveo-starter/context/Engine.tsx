import {
  buildSearchEngine,
  getOrganizationEndpoints,
  SearchEngine,
  buildContext,
} from "@coveo/headless";
import getConfig from "next/config";
import { createContext } from "react";

const {
  publicRuntimeConfig: { applicationId, coveoApiKey },
} = getConfig();

export const headlessEngine = buildSearchEngine({
  configuration: {
    organizationId: applicationId,
    accessToken: coveoApiKey,
    organizationEndpoints: getOrganizationEndpoints(applicationId),
  },
});

buildContext(headlessEngine).add("products", "catalog");

export const HeadlessEngineContext =
  createContext<SearchEngine>(headlessEngine);
