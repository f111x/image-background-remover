'use client'

import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const auth = localStorage.getItem('google_auth')
    const userId = localStorage.getItem('user_id') || 'guest'
    
    if (!auth) {
      setLoading(false)
      return
    }
    
    setIsLoggedIn(true)
    
    // Fetch profile from API
    fetch(`/api/user?userId=${userId}&action=profile`)
      .then(res => res.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch profile:', err)
        setLoading(false)
      })
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('google_auth')
    localStorage.removeItem('user_id')
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <header className="py-4 px-4 flex justify-between items-center">
          <a href="/" className="text-white hover:text-purple-200 transition-colors">← 返回首页</a>
        </header>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">请先登录</h2>
            <p className="text-gray-600 mb-6">登录后即可查看您的个人中心和操作历史</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              登录 / 注册
            </a>
          </div>
        </div>
      </div>
    )
  }

  const getQuotaDisplay = () => {
    if (!profile) return ''
    if (profile.plan === 'paid') return '无限'
    if (profile.plan === 'registered') return `${profile.todayUsage}/${profile.quota}`
    return `${profile.todayUsage}/${profile.quota}`
  }

  const getPlanBadge = () => {
    if (!profile) return null
    if (profile.plan === 'paid') return <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">付费用户</span>
    if (profile.plan === 'registered') return <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">注册用户</span>
    return <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">游客</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
      <header className="py-4 px-4 flex justify-between items-center">
        <a href="/" className="text-white hover:text-purple-200 transition-colors">← 返回首页</a>
        <div className="flex items-center gap-3">
          <a href="/pricing" className="text-white hover:text-purple-200 transition-colors text-sm">定价方案</a>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {profile?.name || profile?.email || '用户'}
          </h1>
          <div className="flex items-center justify-center gap-2">
            {getPlanBadge()}
          </div>
        </div>

        {/* Usage Card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">今日使用情况</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">今日已用 / 额度</p>
              <p className="text-3xl font-bold text-white">{getQuotaDisplay()}</p>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-sm mb-1">当前方案</p>
              <p className="text-white font-medium">
                {profile?.plan === 'paid' ? '付费用户' : profile?.plan === 'registered' ? '注册用户' : '游客'}
              </p>
            </div>
          </div>
          
          {/* Usage Progress Bar */}
          {profile?.quota !== Infinity && (
            <div className="mt-4">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (profile?.todayUsage / profile?.quota) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {profile?.plan !== 'paid' && (
            <a
              href="/pricing"
              className="mt-4 block w-full py-3 text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
            >
              升级到付费版 - 无限使用
            </a>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-purple-200 text-sm mb-1">注册时间</p>
            <p className="text-white font-medium">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('zh-CN') : '未知'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-purple-200 text-sm mb-1">登录方式</p>
            <p className="text-white font-medium">Google 账号</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">快速链接</h2>
          <div className="space-y-3">
            <a
              href="/pricing"
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-white">💎 查看定价方案</span>
              <span className="text-purple-200">→</span>
            </a>
            <a
              href="/faq"
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-white">❓ 常见问题</span>
              <span className="text-purple-200">→</span>
            </a>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          退出登录
        </button>
      </main>
    </div>
  )
}
