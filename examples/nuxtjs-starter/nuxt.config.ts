import manifest from "./lib/uniform/contextManifest.json";
import type { ManifestV2 } from "@uniformdev/context";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-14",
  css: ["~/styles/global.css"],
  modules: ["@uniformdev/uniform-nuxt"],
  uniform: {
    projectId: process.env.UNIFORM_PROJECT_ID,
    readOnlyApiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
    edgeApiHost: process.env.UNIFORM_CLI_BASE_EDGE_URL,
    manifest: manifest as ManifestV2,
    defaultConsent: true,
    outputType: "standard",
    playgroundPath: "/playground",
  },
  vite: {
    optimizeDeps: {
     include: ['p-limit']
    }
  }
});
