import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";
import { ProjectMapClient } from "@uniformdev/project-map";

const getState = (preview: boolean | undefined) =>
  process.env.NODE_ENV === "development" || preview
    ? CANVAS_DRAFT_STATE
    : CANVAS_PUBLISHED_STATE;

export async function getCompositionsForNavigation(preview: boolean) {
  if (!process.env.UNIFORM_API_KEY) {
    throw "Uniform API key is not provided. Check your environment variables.";
  }
  if (!process.env.UNIFORM_PROJECT_ID) {
    throw "Uniform Project ID is not provided. Check your environment variables.";
  }
  const projectMapClient = new ProjectMapClient({
    apiKey: process.env.UNIFORM_API_KEY,
    projectId: process.env.UNIFORM_PROJECT_ID,
    apiHost: process.env.UNIFORM_API_HOST ?? process.env.UNIFORM_CLI_BASE_URL,
  });

  const response = await projectMapClient.getNodes({
    state: getState(preview),
    // getting the first level nodes of composition type from project map
    depth: 1,
  });
  return response.nodes
    .filter(
      // excluding nodes that are placeholders
      (node) => node.path && node.type === "composition" && node.compositionId
    )
    .map((node) => {
      return {
        title: node.name,
        url: node.path,
      };
    });
}
