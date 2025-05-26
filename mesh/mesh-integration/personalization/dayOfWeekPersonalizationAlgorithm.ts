import { ContextPlugin, PersonalizationSelectionAlgorithm } from '@uniformdev/context';

import type { MyAlgorithmVariantMatchCriteria } from '../pages/reference/personalizationSelectionAlgorithm';

/**
 * Example personalization algorithm that selects a variation based on the day of the week
 * Must be registered as a plugin with the Context SDK instance that runs on your server/edge/client.
 * In order to have UI to assign the day of the week, you must also install an integration which provides the criteria editor UI.
 * See mesh-manifest.reference.json for an example of how to register the integration, and pages/reference/personalizationSelectionAlgorithm.tsx for an example of the criteria editor UI.
 */
const dayOfWeekPersonalizationAlgorithm: PersonalizationSelectionAlgorithm<
  MyAlgorithmVariantMatchCriteria
> = (options) => {
  const { variations, take } = options;

  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0-6, Sunday-Saturday

  const matchingVariations = Array.from(variations)
    .filter((variant) => variant.pz?.dayOfWeek === currentDay)
    .map((variant) => ({
      ...variant,
      control: false,
    }))
    .slice(0, take);

  return {
    personalized: matchingVariations.length > 0,
    variations: matchingVariations,
  };
};

/**
 * This plugin is used to register the day of week personalization algorithm with the Context SDK.
 * 
 * @see https://docs.uniform.app/docs/guides/classification/plugins#custom-plugins
 * on how to register a custom plugin.
 */
export const dayOfWeekPersonalizationPlugin: ContextPlugin = {
  personalizationSelectionAlgorithms: {
    // IMPORTANT: this must match the key used in your mesh manifest for the personalization algorithm
    // registration/UI definition (see mesh-manifest.reference.json for an example)
    'reference-pz': dayOfWeekPersonalizationAlgorithm,
  },
};
