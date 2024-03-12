import type { CLIConfiguration } from "@uniformdev/cli";

export const config: CLIConfiguration = {
  serialization: {
    entitiesConfig: {
      category: {
        push: {
          disabled: true,
        },
      },
      component: {
        push: {
          disabled: true,
        },
      },
      composition: {
        push: {
          disabled: true,
        },
      },
    },
    directory: "./mesh-content.json",
    format: "json",
    mode: "mirror",
  },
};

module.exports = config;
