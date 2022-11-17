import { createItemEnhancer } from "@uniformdev/canvas-sitecore";

export const sitecoreItemEnhancer = () => {
  const config = useRuntimeConfig();
  const { sitecoreApiUrl, sitecoreSiteName, sitecoreApiKey } = config;

  if (!sitecoreApiKey || !sitecoreSiteName || !sitecoreApiKey) {
    throw "Sitecore connection details are not configured";
  }
  return createItemEnhancer({
    pageId: "id",
    config: {
      SITECORE_API_URL: sitecoreApiUrl,
      SITECORE_SITENAME: sitecoreSiteName,
      env: {
        SITECORE_API_KEY: sitecoreApiKey,
      },
    },
    isPreview: false,
    logger: null,
    modelOnly: false, // enable modelOnly after configuring model builders in Sitecore for all components and parameters
  });
};
