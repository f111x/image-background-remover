import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['having-distinguished-phone-summer.trycloudflare.com'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://having-distinguished-phone-summer.trycloudflare.com data: blob:; connect-src 'self' https://having-distinguished-phone-summer.trycloudflare.com ws://localhost:* ws://127.0.0.1:* http://localhost:* https://api.remove.bg; img-src 'self' data: https://having-distinguished-phone-summer.trycloudflare.com blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://having-distinguished-phone-summer.trycloudflare.com; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
