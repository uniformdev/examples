import type { CLIConfiguration } from '@uniformdev/cli';

const config: CLIConfiguration = {
  serialization: {
    entitiesConfig: {
      signal: {},
      composition: { publish: true },
      component: {},
      projectMapDefinition: {},
      projectMapNode: {},
    }
  }
};

module.exports = config;