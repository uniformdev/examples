/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    projectId: process.env.UNIFORM_PROJECT_ID,
  },
  serverRuntimeConfig: {
    projectId: process.env.UNIFORM_PROJECT_ID,
    apiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_CLI_BASE_URL || "https://uniform.app",
    previewSecret: process.env.UNIFORM_PREVIEW_SECRET || "hello-world",
    outputType: process.env.UNIFORM_OUTPUT_TYPE || "standard",
    segmentApiKey: process.env.SEGMENT_API_KEY,
    segmentSpaceId: process.env.SEGMENT_SPACE_ID,
  },
};

module.exports = nextConfig;
