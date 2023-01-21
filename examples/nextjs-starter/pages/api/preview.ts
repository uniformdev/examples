import { createPreviewHandler } from "@uniformdev/canvas-next";
import runEnhancers from "lib/uniform/enhancers";
import getConfig from "next/config";

const handler = createPreviewHandler({
  secret: () => getConfig().serverRuntimeConfig.previewSecret,
  resolveFullPath: ({ slug }) => slug,
  enhance: async (composition) => runEnhancers(composition, { preview: true }),
});

export default handler;
