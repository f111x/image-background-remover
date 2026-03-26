'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  picture: string
}

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      if (supabaseUser) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
          picture: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || '',
        })
      }
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
          picture: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Sign in error:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return <div className="w-32 h-10 bg-white/20 rounded-lg animate-pulse" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={user.picture}
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <div className="hidden md:block">
          <p className="text-white text-sm font-medium">{user.name}</p>
          <p className="text-purple-200 text-xs">{user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors"
        >
          退出
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
    >
      使用 Google 登录
    </button>
  )
}
