'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
}

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('https://mjngzhchyebqocmcwdbf.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbmd6aGNoeWVicW9jbWN3ZGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTUyMTAsImV4cCI6MjA2MTY3MTIxMH0.vEM7yEyK8W4V8e6iZN5cJ7hX9M6_7hK9P9hF8a_12345'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || '登录失败')
      }

      const data = await response.json()
      const userData = { id: data.user?.id || '1', email }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setShowForm(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('https://mjngzhchyebqocmcwdbf.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbmd6aGNoeWVicW9jbWN3ZGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTUyMTAsImV4cCI6MjA2MTY3MTIxMH0.vEM7yEyK8W4V8e6iZN5cJ7hX9M6_7hK9P9hF8a_12345'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || '注册失败')
      }

      alert('注册成功！请查收验证邮件。')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (loading) {
    return <div className="w-20 h-10 bg-white/20 rounded-lg animate-pulse" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-white text-sm">{user.email}</span>
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
      <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
        <form onSubmit={handleLogin} className="flex items-center gap-2">
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-2 py-1 rounded text-sm w-32 bg-white/20 text-white placeholder-purple-200 border border-white/30"
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-2 py-1 rounded text-sm w-24 bg-white/20 text-white placeholder-purple-200 border border-white/30"
          />
          <button type="submit" className="px-2 py-1 bg-white text-purple-600 text-sm rounded">
            登录
          </button>
          <button type="button" onClick={handleSignUp} className="px-2 py-1 bg-purple-500 text-white text-sm rounded">
            注册
          </button>
        </form>
        <button onClick={() => setShowForm(false)} className="text-white/70 text-sm px-1">
          ✕
        </button>
        {error && <span className="text-red-300 text-xs">{error}</span>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
    >
      登录
    </button>
  )
}
