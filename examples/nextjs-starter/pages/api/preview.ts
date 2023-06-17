import { createPreviewHandler } from "@uniformdev/canvas-next";

const handler = createPreviewHandler({
  secret: () => process.env.UNIFORM_PREVIEW_SECRET,
});

export default handler;
