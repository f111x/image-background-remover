/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,

  // P0-6: Short path redirects
  async redirects() {
    return [
      { source: "/remove-background", destination: "/tools/background-remover", permanent: true },
      { source: "/watermark-remover", destination: "/tools/watermark-remover", permanent: true },
      { source: "/ai-image-editor", destination: "/tools/ai-editor", permanent: true },
      { source: "/image-to-pdf-converter", destination: "/tools/image-to-pdf", permanent: true },
      { source: "/merge-images", destination: "/tools/merge-images", permanent: true },
      { source: "/compress-image", destination: "/tools/compress-image", permanent: true },
      { source: "/compress-images", destination: "/tools/compress-image", permanent: true },
      { source: "/crop-image", destination: "/tools/crop-image", permanent: true },
      { source: "/remove-bg", destination: "/tools/background-remover", permanent: true },
      { source: "/bg-remover", destination: "/tools/background-remover", permanent: true },
      { source: "/background-remover", destination: "/tools/background-remover", permanent: true },
      { source: "/watermark", destination: "/tools/watermark-remover", permanent: true },
      { source: "/ai-editor", destination: "/tools/ai-editor", permanent: true },
      { source: "/image-to-pdf", destination: "/tools/image-to-pdf", permanent: true },
    ]
  },

  // P0-4: Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.vercel.app",
              "frame-src 'self' https://accounts.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; ")
          },
        ],
      },
    ]
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /.*process\.versions.*/,
      },
      {
        module: /node_modules\/@supabase\/supabase-js/,
        message: /.*process\.version.*/,
      },
    ]
    return config
  },
}

export default nextConfig
