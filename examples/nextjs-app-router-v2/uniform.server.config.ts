import { UniformServerConfig } from "@uniformdev/next-app-router/config";

const config: UniformServerConfig = {
  defaultConsent: true,
  experimental: {
    quirkSerialization: true,
    middlewareRuntimeCache: true,
  },
  playgroundPath: "/playground",
};

export default config;
