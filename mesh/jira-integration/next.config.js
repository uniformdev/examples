/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: "https",
        hostname:
          "avatar-management--avatars.us-west-2.prod.public.atl-paas.net",
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
