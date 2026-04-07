"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Handle Supabase OAuth callback
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
      }
      
      // Redirect to home after processing
      router.push('/')
    }

    handleCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
      <div className="text-white text-lg text-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>登录处理中，请稍候...</p>
      </div>
    </div>
  )
}
