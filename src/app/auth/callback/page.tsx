'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      const { searchParams } = new URL(window.location.href)
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        console.error('OAuth error:', error)
        router.push('/?error=auth_failed')
        return
      }

      if (code) {
        // The code exchange happens automatically in the Supabase client
        // when we call getUser() after the redirect
        const { error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('Auth error:', authError)
          router.push('/?error=auth_failed')
          return
        }
      }

      router.push('/')
    }

    handleCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="text-white text-xl">处理登录中...</div>
    </div>
  )
}
