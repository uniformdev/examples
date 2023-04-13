import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  CanvasClient,
  enhance,
  EnhancerBuilder,
  RootComponentInstance,
} from "@uniformdev/canvas";
import { CANVAS_SANITY_PARAMETER_TYPES } from "@uniformdev/canvas-sanity";
import { sanityEnhancer } from "./sanity";

export const getComposition = async (path: string) => {
  const client = new CanvasClient({
    apiKey: process.env.GATSBY_UNIFORM_API_KEY,
    projectId: process.env.GATSBY_UNIFORM_PROJECT_ID,
  });

  const { composition } = await client.getCompositionBySlug({
    slug: !path ? "/" : path,
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  });
  return composition;
};

export async function enhanceComposition(composition: RootComponentInstance) {
  await enhance({
    composition,
    enhancers: new EnhancerBuilder().parameterType(
      CANVAS_SANITY_PARAMETER_TYPES,
      sanityEnhancer
    ),
    context: {},
  });
  return composition;
}
