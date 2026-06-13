/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.pinet.com https://sandbox.pinet.com http://sandbox.pinet.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://*.pinet.com',
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
