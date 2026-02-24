import { uniformConfig } from "@uniformdev/cli/config";

module.exports = uniformConfig({
  preset: "all",
  overrides: { serializationConfig: { format: "json" } },
  disableEntities: ['policyDocument', 'webhook']
});
