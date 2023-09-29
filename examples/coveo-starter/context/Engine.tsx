import {
  buildContext,
  buildSearchEngine,
  getOrganizationEndpoints, SearchEngine,
} from "@coveo/headless";
import getConfig from "next/config";
import {createContext} from "react";

const {
  publicRuntimeConfig: { applicationId, coveoApiKey },
} = getConfig();

export const getHeadlessEngine = () =>
    buildSearchEngine({
      configuration: {
        organizationId: applicationId,
        accessToken: coveoApiKey,
        organizationEndpoints: getOrganizationEndpoints(applicationId),
      },
    });

export const HeadlessEngineContext = createContext<SearchEngine>(getHeadlessEngine());
