import { GetStaticPropsContext } from "next";

// TODO: to enable enhancers:
// see docs: https://docs.uniform.app/canvas/tutorials/enhancers

// This optional function allows to run custom enhancers on top of your composition data
export default async function runEnhancers(
  composition: any,
  context: GetStaticPropsContext
) {
  //TODO: register your CMS specific enhancers here
  // see docs: https://docs.uniform.app/canvas/tutorials/enhancers
  // const { preview } = context || {};
  // await enhance({
  //   composition,
  //   enhancers: new EnhancerBuilder().parameterType(
  //     "parameter-type-name",
  //     getEnhancer(preview!)
  //   ),
  //   context,
  // });
  return composition;
}
