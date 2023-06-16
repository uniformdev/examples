/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    projectId: process.env.UNIFORM_PROJECT_ID,
    sitecoreApiUrl: process.env.SITECORE_API_URL,
    sitecoreSiteName: process.env.SITECORE_SITENAME,
    sitecoreApiKey: process.env.SITECORE_API_KEY,
    apiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_CLI_BASE_URL || "https://uniform.app",
    previewSecret: process.env.UNIFORM_PREVIEW_SECRET || "hello-world"
  },
};

module.exports = nextConfig;
