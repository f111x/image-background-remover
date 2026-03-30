import { createClient } from '@supabase/ssr'

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        name: 'sb-auth-token',
        key: 'sb-auth-token',
        whitelistPatterns: ['/api/', '/profile', '/pricing'],
      },
    }
  )
}
