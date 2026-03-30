/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_REMOVE_BG_API_KEY: process.env.REMOVE_BG_API_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        maxInitialSize: 5000000, // 5MB max for initial chunks
        maxAsyncSize: 5000000, // 5MB max for async chunks
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Force smaller chunks for vendor libraries
          vendor: {
            name: 'vendor',
            chunks: 'all',
            minSize: 100000,
            maxSize: 5000000,
            priority: 10,
          },
          // Smaller chunks for edge runtime
          edgeRuntime: {
            name: 'edge-runtime',
            test: /[\\/]node_modules[\\/](@supabase|buffer)/,
            chunks: 'all',
            minSize: 10000,
            maxSize: 4000000,
            priority: 20,
          },
        },
      }
    }
    return config
  },
};

export default nextConfig;
