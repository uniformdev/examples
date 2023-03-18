/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "images.ctfassets.net", "cdn.sanity.io"],
    deviceSizes: [320, 420, 768, 1024, 1280],
  },
};

module.exports = nextConfig;
