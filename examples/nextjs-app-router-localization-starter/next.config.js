const createNextIntlPlugin = require("next-intl/plugin");

const { withUniformConfig } = require("@uniformdev/canvas-next-rsc/config");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = withNextIntl(withUniformConfig(nextConfig));
