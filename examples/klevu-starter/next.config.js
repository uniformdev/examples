/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    klevuSearchUrlHost: process.env.KLEVU_SEARCH_URL_HOST,
    klevuSearchApiKey: process.env.KLEVU_SEARCH_API_KEY,
  },
  serverRuntimeConfig: {
    projectId: process.env.UNIFORM_PROJECT_ID,
    apiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_CLI_BASE_URL || 'https://uniform.app',
    edgeApiHost: process.env.UNIFORM_CLI_BASE_EDGE_URL || 'https://uniform.global'
  },
};

module.exports = nextConfig;
