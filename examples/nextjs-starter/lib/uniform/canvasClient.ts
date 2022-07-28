import {
  CanvasClient,
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  CompositionListAPIResponse,
} from "@uniformdev/canvas";
import runEnhancers from "./enhancers";
import getConfig from "next/config";

const {
  serverRuntimeConfig: { apiKey, apiHost, projectId },
} = getConfig();

export const canvasClient = new CanvasClient({
  apiKey,
  apiHost,
  projectId,
});

export async function getCompositionBySlug(slug: string, preview: boolean) {
  const { composition } = await canvasClient.getCompositionBySlug({
    slug,
    state:
      process.env.NODE_ENV === "development" || preview
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  });
  await runEnhancers(composition);
  return composition;
}

export async function getCompositionsForNavigation(preview: boolean) {
  const response: CompositionListAPIResponse =
    await canvasClient.getCompositionList({
      skipEnhance: true,
      state:
        process.env.NODE_ENV === "development" || preview
          ? CANVAS_DRAFT_STATE
          : CANVAS_PUBLISHED_STATE,
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
