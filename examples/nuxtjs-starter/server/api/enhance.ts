import { H3Event } from "h3";
// TODO: when adding CMS integrations, import your enhancers here
// import { enhance, compose, EnhancerBuilder } from "@uniformdev/canvas";
// import {
//   createContentfulEnhancer,
//   ContentfulClientList,
//   CANVAS_CONTENTFUL_PARAMETER_TYPES,
// } from '@uniformdev/canvas-contentful';
// import { createClient } from 'contentful';

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const composition = body.composition;
  // TODO: when adding CMS integrations, add your enhancers here:
  // await enhance({
  //   composition,
  //   enhancers: new EnhancerBuilder().parameterType(
  //     CANVAS_CONTENTFUL_PARAMETER_TYPES,
  //     contentfulEnhancer
  //   ),
  //   context: {},
  // });

  return { composition };
});