import {EnhancerDefinition} from "../types";
import {validateAndGetEnvVars} from "../utils";
import {ComponentParameterEnhancer} from "@uniformdev/canvas";

export const enhancerDefinition: EnhancerDefinition = {
  name: "Algolia",
  getConfiguration,
  getEnhancer,
  parameterTypes: Object.freeze(["headless-components"]),
};

function getConfiguration() {
  return validateAndGetEnvVars([
    "COVEO_ORGANIZATION_ID",
    "COVEO_API_KEY",
  ]);
}

function getEnhancer(): ComponentParameterEnhancer<any> {
  const { envVars } = getConfiguration();

  return {
    enhanceOne: async function Enhancer({ parameter }) {
      return parameter.value;
    },
  };
}
