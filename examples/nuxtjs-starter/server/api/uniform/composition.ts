import { CanvasClient, CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  
  if (!config.uniform) {
    throw new Error("Runtime config for uniform is not available. Check nuxt.config.ts runtimeConfig section.");
  }
  
  const query = getQuery(event);
  const projectMapNodePath = query.path as string;
  const isPreview = query.preview === "true";
  
  const state = process.env.NODE_ENV === "development" || isPreview
    ? CANVAS_DRAFT_STATE
    : CANVAS_PUBLISHED_STATE;

  // API key is only accessed server-side
  const canvasClient = new CanvasClient({
    apiKey: config.uniform.apiKey,
    projectId: config.uniform.projectId
  });
  
  const { composition } = await canvasClient.getCompositionByNodePath({
    projectMapNodePath,
    state,
  });

  return { composition };
});
