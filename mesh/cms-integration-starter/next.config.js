/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  experimental: {
    // react-icons related bug https://linear.app/uniform/issue/UNI-1373/need-to-set-esmexternals-to-use-the-mesh-sdk-with-nextjs
    esmExternals: false,
  },
};

module.exports = nextConfig;
