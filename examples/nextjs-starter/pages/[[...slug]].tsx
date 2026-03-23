import PageComposition from "@/components/PageComposition";
import { withUniformGetServerSideProps } from "@uniformdev/canvas-next/route";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";
import { getCompositionsForNavigation } from "@/lib/uniform/canvasClient";
import { getForcedAbTestVariantFromQuery } from "@/lib/uniform/forceAbTestVariantCookie";
import { applyForcedCanvasTestVariantDistributions } from "@/lib/uniform/forceCanvasTestVariantInComposition";

// IMPORTANT: this starter is using SSR mode by default for simplicity. SSG mode can be enabled, please check Uniform docs here: https://docs.uniform.app/docs/guides/composition/routing#project-map-with-uniform-get-server-side-props-and-with-uniform-get-static-props
export const getServerSideProps = withUniformGetServerSideProps({
  // fetching draft composition in dev mode for convenience
  requestOptions: {
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  },
  handleComposition: async ({ compositionApiResponse }, context, _defaultHandler) => {
    const { composition } = compositionApiResponse || {};
    const forcedVariantId = getForcedAbTestVariantFromQuery(context.query);
    if (!context.preview && composition && forcedVariantId) {
      applyForcedCanvasTestVariantDistributions(composition, forcedVariantId);
    }
    const navLinks = await getCompositionsForNavigation(context.preview);
    return {
      props: {
        data: composition,
        navLinks,
      },
    };
  },
});

export default PageComposition;
