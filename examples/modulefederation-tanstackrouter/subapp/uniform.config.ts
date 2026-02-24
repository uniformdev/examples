import { uniformConfig } from "@uniformdev/cli/config";

module.exports = uniformConfig({
  preset: "all",
  // We use json format here to it is easy to load the subpath configuration from the project map definition
  overrides: { serializationConfig: { format: "json" } },
  disableEntities: ['policyDocument', 'webhook']
});
