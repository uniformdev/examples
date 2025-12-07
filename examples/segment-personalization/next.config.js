const { withUniformConfig } = require("@uniformdev/canvas-next-rsc/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*" }],
  },
};

module.exports = withUniformConfig(nextConfig);
