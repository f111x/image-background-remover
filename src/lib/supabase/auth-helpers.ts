import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Middleware helper to protect API routes
 * Returns the user if authenticated, otherwise returns an error response
 */
export async function requireAuth() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { user, error: null }
}

/**
 * Get the current user without requiring authentication
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}
