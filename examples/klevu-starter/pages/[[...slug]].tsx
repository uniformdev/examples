import '@/canvas';

import PageComposition from "@/components/PageComposition";
import { withUniformGetServerSideProps } from "@uniformdev/canvas-next/route";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";

export const getServerSideProps = withUniformGetServerSideProps({
  // fetching draft composition in dev mode for convenience
  requestOptions: {
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  },
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
