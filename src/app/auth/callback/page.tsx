'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const { searchParams } = new URL(window.location.href)
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    // If there's an error from the OAuth provider
    if (error) {
      console.error('OAuth error:', error, errorDescription)
      router.push(`/?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`)
      return
    }

    // Try to exchange the code for a session
    supabase.auth.getUser()
      .then(({ error }) => {
        if (error) {
          console.error('Auth error during code exchange:', error)
          router.push(`/?error=auth_failed&error_description=${encodeURIComponent(error.message)}`)
        } else {
          router.push('/')
        }
      })
      .catch((err) => {
        console.error('Unexpected auth error:', err)
        router.push('/?error=auth_failed')
      })
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="text-white text-xl">处理登录中...</div>
    </div>
  )
}
