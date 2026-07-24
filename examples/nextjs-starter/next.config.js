/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*" }],
  },
  // Next 16 Turbopack + Pages API can omit next-server runtimes from the
  // preview lambda; force-include them so /api/preview stays runnable.
  bundlePagesRouterDependencies: true,
};

module.exports = nextConfig;
