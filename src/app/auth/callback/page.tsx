"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Handle Supabase OAuth callback by listening to auth state changes
    // This is more reliable than getSession() alone
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Session established, redirect to home
        router.push('/')
      }
    })

    // Also try getSession immediately in case session already exists
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (session) {
        router.push('/')
      } else if (sessionError) {
        console.error('Session error:', sessionError)
        setError(sessionError.message)
        // Still try to redirect after a short delay
        setTimeout(() => router.push('/'), 2000)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="text-white text-center">
          <p className="text-lg mb-2">登录失败</p>
          <p className="text-sm opacity-80">{error}</p>
          <p className="text-sm mt-4">正在返回首页...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
      <div className="text-white text-lg text-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>登录处理中，请稍候...</p>
      </div>
    </div>
  )
}
