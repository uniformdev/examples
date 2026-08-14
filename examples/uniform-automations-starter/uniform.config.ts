import { uniformConfig } from "@uniformdev/cli/config";

module.exports = uniformConfig({
  preset: "none",
  config: {
    serialization: {
      directory: "./uniform-data",
      entitiesConfig: {
        component: {},
        composition: {},
        locale: {},
        previewUrl: {},
        projectMapDefinition: {},
        projectMapNode: {},
        workflow: {},
      },
    },
  },
});
