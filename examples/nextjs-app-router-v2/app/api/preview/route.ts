import {
  createPreviewGETRouteHandler,
  createPreviewPOSTRouteHandler,
  createPreviewOPTIONSRouteHandler,
} from "@uniformdev/canvas-next-rsc-v2/handler";

export const GET = createPreviewGETRouteHandler({
  resolveFullPath: ({ path }) => (path ? path : "/playground"),
});
export const POST = createPreviewPOSTRouteHandler();
export const OPTIONS = createPreviewOPTIONSRouteHandler();
