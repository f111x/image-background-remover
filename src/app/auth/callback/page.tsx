'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // The supabase client will automatically handle the OAuth code exchange
    // when it detects the code in the URL via getUser() or onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        router.push('/')
      } else {
        router.push('/?error=auth_failed')
      }
    })

    // Also try to get the user immediately - this triggers the code exchange
    supabase.auth.getUser().then(({ error }) => {
      if (error) {
        console.error('Auth error:', error)
        router.push('/?error=auth_failed')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="text-white text-xl">处理登录中...</div>
    </div>
  )
}
