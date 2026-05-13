import {
  createPreviewGETRouteHandler,
  createPreviewPOSTRouteHandler,
  createPreviewOPTIONSRouteHandler,
} from "@uniformdev/next-app-router/handler";

export const GET = createPreviewGETRouteHandler({
  resolveFullPath: ({ path }) => (path ? path : "/playground"),
});
export const POST = createPreviewPOSTRouteHandler();
export const OPTIONS = createPreviewOPTIONSRouteHandler();
