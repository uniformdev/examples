import { createPreviewHandler } from "@uniformdev/canvas-next";
// TODO: re-enable if you end up using enhancers
// import { GetStaticPropsContext } from "next";
// import runEnhancers from "@/uniformlib/enhancers";
// const context: GetStaticPropsContext = {
//   preview: true,
// };

const handler = createPreviewHandler({
  secret: () => process.env.UNIFORM_PREVIEW_SECRET || '',
  // TODO: re-enable if you end up using enhancers
  // enhance: (composition) => runEnhancers(composition, context),
});

export default handler;
