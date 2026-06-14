/** @type {import('next').NextConfig} */
const nextConfig = {
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
          },
        ],
      },
    ];
  },
};

export default nextConfig;
