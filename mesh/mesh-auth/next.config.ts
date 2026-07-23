import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Silence the multi-lockfile workspace-root warning: this example is self-contained.
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Bundle ESM externals with webpack so extensionless deep imports inside Uniform
    // packages (e.g. `@uniformdev/design-system` -> `@react-icons/all-files/...`) resolve.
    // Run dev/build with `--webpack` (see package.json) for this to take effect.
    esmExternals: false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Allow framing only by the Uniform dashboard (add your dashboard origin if needed)
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors https://uniform.app https://*.uniform.app',
          },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
