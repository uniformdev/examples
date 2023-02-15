import { GetStaticPropsContext } from "next";
import getConfig from "next/config";
import { createPreviewHandler } from "@uniformdev/canvas-next";
import runEnhancers from "@/uniformlib/enhancers";

const context: GetStaticPropsContext = {
  preview: true,
};

const handler = createPreviewHandler({
  secret: () => getConfig().serverRuntimeConfig.previewSecret,
  enhance: (composition) => runEnhancers(composition, context),
});

export default handler;
