import {
  CanvasClient,
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
} from "@uniformdev/canvas";
import { ProjectMapClient } from '@uniformdev/project-map';
import getConfig from "next/config";

const {
  serverRuntimeConfig: { apiKey, apiHost, projectId, projectMapId },
} = getConfig();

export const getState = (preview: boolean | undefined) =>
  process.env.NODE_ENV === "development" || preview
    ? CANVAS_DRAFT_STATE
    : CANVAS_PUBLISHED_STATE;

export const canvasClient = new CanvasClient({
  apiKey,
  apiHost,
  projectId,
});

export const projectMapClient = new ProjectMapClient({
  apiKey,
  apiHost,
  projectId,
});

export async function getCompositionsForNavigation(preview: boolean) {
  const response = await projectMapClient.getNodes({
    projectMapId,
    state: getState(preview),
  });

  return response.nodes
    .filter((node) => node.path)
    .map((node) => {
      return {
        title: node.name,
        url: node.path,
      };
    });
}
