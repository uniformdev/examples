import { uniformConfig } from '@uniformdev/cli/config';

module.exports = uniformConfig({
  preset: 'none',
  config: {
    serialization: {
      entitiesConfig: {
        signal: {},
        aggregate: {},
        enrichment: {},
        quirk: {},
      },
    },
  },
});