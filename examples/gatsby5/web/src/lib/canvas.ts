import {
  enhance,
  EnhancerBuilder,
  RootComponentInstance,
} from "@uniformdev/canvas";

export async function enhanceComposition(composition: RootComponentInstance) {
  // const enhancers = new EnhancerBuilder().parameterType(
  // TODO: add any enhancers if needed, for example, Sanity CMS
  //   CANVAS_SANITY_PARAMETER_TYPES,
  //   sanityEnhancer
  // );
  //
  await enhance({
    composition,
    enhancers: new EnhancerBuilder(),
    context: {},
  });
  return composition;
}
