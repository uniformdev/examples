import manifest from "./contextManifest.json";
import { ManifestV2 } from "@uniformdev/context";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/styles/global.css"],
  modules: ["@uniformdev/uniform-nuxt"],
  runtimeConfig: {
    sitecoreApiUrl: process.env.SITECORE_API_URL,
    sitecoreSiteName: process.env.SITECORE_SITENAME,
    sitecoreApiKey: process.env.SITECORE_API_KEY,
  },
  uniform: {
    projectId: process.env.UNIFORM_PROJECT_ID,
    readOnlyApiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
    outputType: "standard",
    manifest: manifest as ManifestV2,
    defaultConsent: true,
  },
});
