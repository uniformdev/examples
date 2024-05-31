import type { CLIConfiguration } from "@uniformdev/cli";

const config: CLIConfiguration = {
  serialization: {
    entitiesConfig: {
      locale: {},
      asset: {},
      component: {},
      composition: { publish: true },
      componentPattern: { publish: true },
      projectMapDefinition: {},
      projectMapNode: {},
      contentType: {},
      entry: { publish: true },
      entryPattern: { publish: true },
      signal: {},
      aggregate: {},
      quirk: {},
      enrichment: {},
    },
  },
};

module.exports = config;
