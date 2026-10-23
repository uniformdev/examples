import {
  createPreviewGETRouteHandler,
  createPreviewPOSTRouteHandler,
  createPreviewOPTIONSRouteHandler,
} from "@uniformdev/next-app-router/handler";
import { expireVercelRuntimeCacheTags } from "@uniformdev/next-app-router/vercel";

export const GET = createPreviewGETRouteHandler();
// Publishing expires what the edge middleware keeps in the Vercel runtime cache (manifest, page records).
export const POST = createPreviewPOSTRouteHandler({ onRevalidateTags: expireVercelRuntimeCacheTags });
export const OPTIONS = createPreviewOPTIONSRouteHandler();
