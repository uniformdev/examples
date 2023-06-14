import getConfig from "next/config";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";
import { ProjectMapClient } from "@uniformdev/project-map";

const {
  serverRuntimeConfig: { apiKey, apiHost, projectId },
} = getConfig();

export const projectMapClient = new ProjectMapClient({
  apiKey,
  apiHost,
  projectId,
  bypassCache: true,
});

export const getState = (preview: boolean | undefined) =>
  process.env.NODE_ENV === "development" || preview
    ? CANVAS_DRAFT_STATE
    : CANVAS_PUBLISHED_STATE;

export async function getCompositionsForNavigation(preview: boolean) {
  const response = await projectMapClient.getNodes({
    state: getState(preview || process.env.NODE_ENV === "development"),
    depth: 1,
  });
  return response.nodes
    .filter(
      (node) => node.path && node.type === "composition" && node.compositionId
    )
    .map((node) => {
      return {
        title: node.name,
        url: node.path,
      };
    });
}
