import { enhance } from "@uniformdev/canvas";
import { EnhancerBuilder, RootComponentInstance } from "@uniformdev/canvas";
import { GetStaticPropsContext } from "next";
import { enhancerDefinition as algoliaEnhancerDef } from "./algolia/algoliaEnhancer";

import { EnhancerDefinition } from "./types";

const enhancerDefs = [algoliaEnhancerDef];

export default async function runEnhancers(
  composition: RootComponentInstance,
  context: GetStaticPropsContext
) {
  const enhancers = await getEnhancers({ composition });
  await enhance({
    composition,
    enhancers,
    context,
  });
}

async function getEnhancers(composition: {
  composition: RootComponentInstance;
}) {
  const enhancerBuilder = new EnhancerBuilder();

  const promises: ReturnType<EnhancerDefinition["getEnhancer"]>[] = [];

  const enhancers = enhancerDefs.filter((def) => {
    const { errors } = def.getConfiguration();
    if (errors.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `⚠️  ${
          def.name
        } enhancer is not configured and is therefore disabled. Check the following env vars: ${errors.join(
          ", "
        )}`
      );
      return false;
    }

    // eslint-disable-next-line no-console
    console.log(`✅  ${def.name} enhancer is configured and enabled.`);
    promises.push(def.getEnhancer(composition));
    return true;
  });

  const resolved = await Promise.allSettled(promises);
  resolved.forEach((promise, index) => {
    const def = enhancers[index];
    if (promise.status === "fulfilled") {
      enhancerBuilder.parameterType(def.parameterTypes, promise.value);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `⚠️  There was a problem loading the enhancer for ${def.name}: ${promise.reason}`
      );
    }
  });

  return enhancerBuilder;
}
