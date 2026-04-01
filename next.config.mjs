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
  webpack: (config, { isServer }) => {
    // Suppress warnings about Node.js APIs in Edge Runtime for Supabase
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    // Ignore specific warnings about process.versions and process.version
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
