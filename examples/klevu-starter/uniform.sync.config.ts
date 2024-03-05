import type { CLIConfiguration } from '@uniformdev/cli';

export const config: CLIConfiguration = {
  serialization: {
    entitiesConfig: {
      category: {},
      component: {},
      composition: { publish: true },
      projectMapDefinition: {},
      projectMapNode: {},
      locale: { },
    },
    directory: './content',
    format: 'yaml',
    // prevent from accidentally overriding existing project content
    // you can use `mirror` mode to change this behavior
    mode: 'createOrUpdate',
  },
};

module.exports = config;