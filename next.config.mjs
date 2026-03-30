/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
  distDir: '.next',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_REMOVE_BG_API_KEY: process.env.REMOVE_BG_API_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
}

export default nextConfig
