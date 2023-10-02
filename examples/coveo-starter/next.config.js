/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    projectId: process.env.UNIFORM_PROJECT_ID,
    applicationId: process.env.COVEO_ORGANIZATION_ID,
    coveoApiKey: process.env.COVEO_API_KEY,
    coveoAnalyticsApiKey: process.env.COVEO_ANALYTICS_API_KEY,
  },
  serverRuntimeConfig: {
    projectId: process.env.UNIFORM_PROJECT_ID,
    apiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_CLI_BASE_URL || 'https://uniform.app',
  },
};

module.exports = nextConfig;
