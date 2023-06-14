import { createPreviewHandler } from "@uniformdev/canvas-next";
import runEnhancers from "@/uniformlib/enhancers";

const handler = createPreviewHandler({
  secret: () => process.env.UNIFORM_PREVIEW_SECRET,
  enhance: (composition) => runEnhancers(composition, true),
});

export default handler;
