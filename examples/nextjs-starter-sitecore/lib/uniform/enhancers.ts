import { enhance, EnhancerBuilder } from "@uniformdev/canvas";
import { createItemEnhancer } from "@uniformdev/canvas-sitecore";
import getConfig from "next/config";

export default async function runEnhancers(
  composition: any,
  isPreview: boolean
) {
  const { serverRuntimeConfig } = getConfig();
  const { sitecoreApiUrl, sitecoreSiteName, sitecoreApiKey } =
    serverRuntimeConfig;

  if (!sitecoreApiKey || !sitecoreSiteName || !sitecoreApiKey) {
    throw "Sitecore connection details are not configured";
  }

  const sitecoreEnhancer = createItemEnhancer({
    pageId: "id",
    config: {
      SITECORE_API_URL: sitecoreApiUrl,
      SITECORE_SITENAME: sitecoreSiteName,
      env: {
        SITECORE_API_KEY: sitecoreApiKey,
      },
    },
    isPreview,
    logger: null,
    modelOnly: false, // enable modelOnly after configuring model builders in Sitecore for all components and parameters
  });

  await enhance({
    composition,
    context: {
      preview: isPreview,
    },
    enhancers: new EnhancerBuilder().parameterType(
      "sitecoreItem",
      sitecoreEnhancer
    ),
  });
}
