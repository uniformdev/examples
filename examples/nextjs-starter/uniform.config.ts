import type { CLIConfiguration } from "@uniformdev/cli";

const config: CLIConfiguration = {
  serialization: {
    entitiesConfig: {
      signal: {},
      composition: { publish: true },
      entry: { publish: true },
      pattern: { publish: true },
      asset: {},
      component: {},
      projectMapDefinition: {},
      projectMapNode: {},
    },
  },
};

module.exports = config;
