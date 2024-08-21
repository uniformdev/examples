const withNextIntl = require("next-intl/plugin")();
const { withUniformConfig } = require("@uniformdev/canvas-next-rsc/config");

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntl(withUniformConfig(nextConfig));
