const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
};

module.exports = withBundleAnalyzer(nextConfig)