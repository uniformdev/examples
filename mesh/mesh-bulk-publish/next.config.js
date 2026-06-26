/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Only allow framing by the Uniform dashboard; prevents clickjacking on third-party sites
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors https://*.uniform.app https://localhost:8889',
          },
          // Never leak the referrer URL to external origins
          { key: 'Referrer-Policy', value: 'no-referrer' },
          // Prevent browsers from MIME-sniffing responses away from the declared content-type
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Disable powerful browser features this app does not need
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
