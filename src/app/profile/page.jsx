'use client'

import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [credits, setCredits] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Get user ID from localStorage
    const storedUserId = localStorage.getItem('userId') || `guest_${Date.now()}`
    localStorage.setItem('userId', storedUserId)
    setUserId(storedUserId)
    
    // Check if logged in via Google
    const auth = localStorage.getItem('google_auth')
    setIsLoggedIn(!!auth)
    
    // Fetch profile
    fetch(`/api/user?userId=${storedUserId}`)
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

  // Load credits from localStorage
  useEffect(() => {
    const storedCredits = localStorage.getItem(`credits_${userId}`)
    if (storedCredits) {
      setCredits(parseInt(storedCredits))
    }
  }, [userId])

  const copyUserId = () => {
    navigator.clipboard.writeText(userId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getQuotaDisplay = () => {
    if (!profile) return '...'
    if (profile.plan === 'paid') return '∞'
    return `${profile.todayUsage || 0}/${profile.quota || 3}`
  }

  const getPlanBadge = () => {
    if (!profile) return null
    if (profile.isPaid) return <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">⭐ Pro</span>
    if (profile.plan === 'registered') return <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">注册用户</span>
    return <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">游客</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
      <header className="py-4 px-4 flex justify-between items-center">
        <a href="/" className="text-white hover:text-purple-200 transition-colors">← 返回首页</a>
        <div className="flex items-center gap-3">
          <a href="/pricing" className="text-white hover:text-purple-200 transition-colors text-sm">💎 充值积分</a>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {profile?.name || profile?.email || '我的账户'}
          </h1>
          <div className="flex items-center justify-center gap-2">
            {getPlanBadge()}
          </div>
        </div>

        {/* User ID Card - Important for Support */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">🆔 账户 ID</h2>
          <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
            <code className="text-purple-200 text-sm break-all">{userId}</code>
            <button
              onClick={copyUserId}
              className="ml-3 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded transition-colors flex-shrink-0"
            >
              {copied ? '✓ 已复制' : '复制'}
            </button>
          </div>
          <p className="text-purple-200 text-sm mt-3">
            💡 付款后联系客服时，请提供此 ID 以便我们为您充值
          </p>
        </div>

        {/* Credits Card */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur rounded-2xl p-6 mb-6 border border-yellow-400/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">💰 我的积分</h2>
            <span className="text-3xl font-bold text-yellow-400">{credits}</span>
          </div>
          <p className="text-purple-200 text-sm mb-4">
            积分用于购买积分包，永久有效
          </p>
          <a
            href="/pricing"
            className="block w-full py-3 text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            🛒 购买更多积分
          </a>
        </div>

        {/* Usage Card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">📊 今日免费额度</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">今日已用 / 剩余</p>
              <p className="text-3xl font-bold text-white">{getQuotaDisplay()}</p>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-sm mb-1">方案</p>
              <p className="text-white font-medium">
                {profile?.isPaid ? '⭐ Pro' : profile?.plan === 'registered' ? '注册用户' : '游客'}
              </p>
            </div>
          </div>
          
          {/* Usage Progress Bar */}
          {profile?.quota !== Infinity && (
            <div className="mt-4">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((profile?.todayUsage || 0) / (profile?.quota || 3)) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {credits > 0 && (
            <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
              <p className="text-green-300 text-sm">
                ✅ 您有 {credits} 积分可用，积分会优先扣除，不受每日免费额度限制
              </p>
            </div>
          )}
        </div>

        {/* How to Recharge */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">💳 如何充值</h2>
          <div className="space-y-3 text-purple-200 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold">1</span>
              <p>点击上方「购买更多积分」按钮</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold">2</span>
              <p>选择积分包并完成 PayPal 付款</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold">3</span>
              <p>付款后联系客服，提供您的账户 ID</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold">4</span>
              <p>客服确认后立即为您充值</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🔗 快速链接</h2>
          <div className="space-y-3">
            <a
              href="/pricing"
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-white">💎 定价方案</span>
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
        {isLoggedIn && (
          <button
            onClick={() => {
              localStorage.removeItem('google_auth')
              localStorage.removeItem('user_id')
              window.location.href = '/'
            }}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            退出登录
          </button>
        )}

        {/* Footer Note */}
        <div className="text-center mt-8 text-purple-200 text-sm">
          <p>📧 联系客服: support@imagetoolss.com</p>
        </div>
      </main>
    </div>
  )
}
