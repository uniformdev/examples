import {
  buildContext,
  buildProductRecommendationEngine,
  ProductRecommendationEngine,
} from "@coveo/headless/product-recommendation";
import getConfig from "next/config";
import { getOrganizationEndpoints } from "@coveo/headless";
import { createContext } from "react";

const {
  publicRuntimeConfig: { applicationId, coveoApiKey },
} = getConfig();

const productRecommendationsEngine = buildProductRecommendationEngine({
  configuration: {
    organizationId: applicationId,
    accessToken: coveoApiKey,
    organizationEndpoints: getOrganizationEndpoints(applicationId),
    searchHub: "new search page 2",
  },
});

buildContext(productRecommendationsEngine).set({ products: "catalog" });

export const ProductRecommendationEngineContext =
  createContext<ProductRecommendationEngine>(productRecommendationsEngine);
