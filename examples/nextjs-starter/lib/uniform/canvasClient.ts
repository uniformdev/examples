import {
  CanvasClient,
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
} from "@uniformdev/canvas";
import getConfig from "next/config";

const {
  serverRuntimeConfig: { apiKey, apiHost, projectId },
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

export async function getCompositionsForNavigation(preview: boolean) {
  const response = await canvasClient.getCompositionList({
    skipEnhance: true,
    state: getState(preview),
  });
  return response.compositions
    .filter((c) => c.composition._slug)
    .map((c) => {
      return {
        title: c.composition._name,
        url: c.composition._slug,
      };
    });
}
