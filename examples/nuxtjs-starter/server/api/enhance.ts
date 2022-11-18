import { H3Event } from "h3";
import { compose, enhance, EnhancerBuilder } from "@uniformdev/canvas";
import { createItemEnhancer } from "@uniformdev/canvas-sitecore";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const composition = body.composition;

  const config = useRuntimeConfig();
  const { sitecoreApiUrl, sitecoreSiteName, sitecoreApiKey } = config;

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
    isPreview: false,
    logger: null,
    modelOnly: false, // enable modelOnly after configuring model builders in Sitecore for all components and parameters
  });

  await enhance({
    composition,
    enhancers: new EnhancerBuilder().parameterType(
      "sitecoreItem",
      sitecoreEnhancer
    ),
    context: {},
  });

  return { composition };
});
