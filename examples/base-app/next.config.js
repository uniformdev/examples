/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  images: {
    loader: 'akamai',
    path: '/',
  }
}

module.exports = nextConfig
