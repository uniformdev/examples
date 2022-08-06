import { defineNuxtConfig } from "nuxt";
import { ManifestV2 } from "@uniformdev/context";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["~/styles/globals.css", "~/styles/page.css"],
  modules: ["@uniformdev/uniform-nuxt"],
  uniform: {
    projectId: process.env.UNIFORM_PROJECT_ID,
    readOnlyApiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
    manifest: {} as ManifestV2,
    defaultConsent: true,
  },
});
