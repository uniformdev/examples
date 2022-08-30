import {
  createEnhancer,
  YextClient,
  YEXT_PARAMETER_TYPES,
} from "@uniformdev/canvas-yext";
import { enhance, EnhancerBuilder } from "@uniformdev/canvas";
import { GetStaticPropsContext } from "next";

function getYextEnhancer() {
  const client = new YextClient({
    apiKey: process.env.YEXT_API_KEY,
  });
  return createEnhancer({
    clients: client,
  });
}

export default async function runEnhancers(
  composition,
  context: GetStaticPropsContext
) {
  const enhancers = new EnhancerBuilder().parameterType(
    YEXT_PARAMETER_TYPES,
    getYextEnhancer()
  );
  await enhance({ composition, enhancers, context });
}
