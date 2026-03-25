import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_REMOVE_BG_API_KEY: process.env.REMOVE_BG_API_KEY,
  },
};

export default nextConfig;
