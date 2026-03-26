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
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        setError(error.message)
      } else {
        setShowForm(false)
        alert('注册成功！请查收验证邮件。')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setError(error.message)
      }
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
        <div className="hidden md:block">
          <p className="text-white text-sm font-medium">{user.email}</p>
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

  if (showForm) {
    return (
      <div className="flex items-center gap-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:outline-none focus:border-white"
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:outline-none focus:border-white"
            required
            minLength={6}
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-white text-purple-600 text-sm rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isSignUp ? '注册' : '登录'}
          </button>
        </form>
        <button
          onClick={() => setShowForm(false)}
          className="px-2 py-1.5 text-white/70 hover:text-white text-sm"
        >
          取消
        </button>
        {error && <p className="text-red-300 text-xs">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
      >
        登录
      </button>
    </div>
  )
}
