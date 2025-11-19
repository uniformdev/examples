import { ProjectMapClient } from "@uniformdev/project-map";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  
  if (!config.uniform) {
    throw new Error("Runtime config for uniform is not available. Check nuxt.config.ts runtimeConfig section.");
  }
  
  const query = getQuery(event);
  const isPreview = query.preview === "true";
  const state = process.env.NODE_ENV === "development" || isPreview
    ? CANVAS_DRAFT_STATE
    : CANVAS_PUBLISHED_STATE;

  // API key is now only accessed server-side
  const projectMapClient = new ProjectMapClient({
    apiKey: config.uniform.apiKey,
    projectId: config.uniform.projectId,
  });
  
  const response = await projectMapClient.getNodes({
    state,
    depth: 1,
  });

  return (response.nodes ?? [])
    .filter(
      (node) => node.path && node.type === "composition" && node.compositionId
    )
    .map((node) => ({
      title: node.name,
      url: node.path,
    }));
});
