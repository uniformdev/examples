import PageComposition from "@/components/PageComposition";
import {
  prependLocale,
  withUniformGetServerSideProps,
} from "@uniformdev/canvas-next/route";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";

// IMPORTANT: this starter is using SSR mode by default for simplicity. SSG mode can be enabled, please check Uniform docs here: https://docs.uniform.app/docs/guides/composition/routing#project-map-with-uniform-get-server-side-props-and-with-uniform-get-static-props
export const getServerSideProps = withUniformGetServerSideProps({
  // fetching draft composition in dev mode for convenience
  requestOptions: {
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  },
  modifyPath: prependLocale,
  handleComposition: async (routeResponse, _context, _defaultHandler) => {
    const { composition } = routeResponse.compositionApiResponse || {};
    return {
      props: {
        data: composition,
      },
    };
  },
});

export default PageComposition;
