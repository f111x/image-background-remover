'use client'

import { useState, useEffect } from 'react'

// PayPal.Me packages
const CREDIT_PACKAGES = [
  { id: '10-credits', credits: 10, price: 1, label: '10 Credits', popular: false },
  { id: '50-credits', credits: 50, price: 4, label: '50 Credits', popular: true },
  { id: '100-credits', credits: 100, price: 7, label: '100 Credits', popular: false },
]

const SUBSCRIPTION_PLANS = [
  {
    id: 'pro-monthly',
    name: 'Pro',
    price: 10,
    period: '每月',
    features: [
      '每天 100 次处理',
      '高清无水印',
      '无限历史记录',
      '优先处理队列',
      '专属客服支持'
    ],
    popular: true
  }
]

const PAYPAL_ME_USERNAME = 'loadingpay'

export default function PricingPage() {
  const [paymentStatus, setPaymentStatus] = useState(null)
  
  useEffect(() => {
    // Check URL params for payment status
    const params = new URLSearchParams(window.location.search)
    const payment = params.get('payment')
    
    if (payment === 'success') {
      setPaymentStatus({ 
        type: 'credits', 
        message: 'Payment submitted! Your credits will be added shortly.' 
      })
      window.history.replaceState({}, '', '/pricing')
    } else if (payment === 'cancelled') {
      setPaymentStatus({ 
        type: 'credits', 
        message: 'Payment cancelled.' 
      })
      window.history.replaceState({}, '', '/pricing')
    }
  }, [])

  // Open PayPal.Me for payment
  const handlePayment = (type, pkg) => {
    if (type === 'subscription') {
      // Subscription - open PayPal.Me with note
      const url = `https://paypal.me/${PAYPAL_ME_USERNAME}/${pkg.price}?note=Pro+Monthly+Subscription`
      window.open(url, '_blank')
    } else {
      // Credits - open PayPal.Me with package info
      const url = `https://paypal.me/${PAYPAL_ME_USERNAME}/${pkg.price}?note=${pkg.credits}+Credits`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
      <header className="py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <a href="/" className="text-white hover:text-purple-200 transition-colors">← 返回首页</a>
        </div>
        <div className="text-white text-sm">🖼️ 图片背景去除工具</div>
      </header>

      <main className="container mx-auto px-4 pb-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            选择适合您的方案
          </h1>
          <p className="text-purple-200 text-lg">
            简单、透明、无隐藏费用
          </p>
        </div>

        {/* Payment Status Alert */}
        {paymentStatus && (
          <div className={`mb-8 p-4 rounded-xl text-center bg-green-500/30 border border-green-400/50`}>
            <p className="text-white font-medium">{paymentStatus.message}</p>
            <button 
              onClick={() => setPaymentStatus(null)}
              className="mt-2 text-sm text-purple-200 hover:text-white"
            >
              ✕ 关闭
            </button>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">月度订阅</h2>
          <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur rounded-2xl p-6 border-2 ${plan.popular ? 'border-yellow-400/50' : 'border-white/20'} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full">
                    ⭐ 最受欢迎
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">
                    ${plan.price}
                    <span className="text-lg text-purple-200 font-normal">/{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-white">
                      <span className="text-yellow-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => handlePayment('subscription', plan)}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  立即订阅 (PayPal)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">积分购买</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                className={`bg-white/10 backdrop-blur rounded-2xl p-6 border ${pkg.popular ? 'border-purple-400/50' : 'border-white/20'} relative`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                    推荐
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.label}</h3>
                  <div className="text-3xl font-bold text-white mb-2">
                    ${pkg.price}
                  </div>
                  <p className="text-purple-200 text-sm">
                    {pkg.credits} 次处理额度
                  </p>
                </div>
                
                <ul className="space-y-2 mb-6 text-sm text-purple-200">
                  <li>✓ 永久有效</li>
                  <li>✓ 高清无水印</li>
                  <li>✓ 即时到账</li>
                </ul>
                
                <button 
                  onClick={() => handlePayment('credits', pkg)}
                  className={`w-full py-3 font-medium rounded-lg transition-all ${
                    pkg.popular 
                      ? 'bg-white text-purple-600 hover:bg-gray-100' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  立即购买 (PayPal)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Free Tier */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">免费使用</h3>
              <p className="text-purple-200">每天 3 次免费处理，无需注册</p>
            </div>
            <a 
              href="/" 
              className="px-6 py-3 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-colors whitespace-nowrap"
            >
              立即试用 →
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">常见问题</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-2">Q: 积分和订阅有什么区别？</h3>
              <p className="text-purple-200 text-sm">A: 积分是一次性购买，永不过期；订阅是每月付费，享受每日额度，适合高频用户。</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Q: 支付安全吗？</h3>
              <p className="text-purple-200 text-sm">A: 所有支付由 PayPal 提供安全保障，我们不存储您的银行卡信息。</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Q: 如何取消订阅？</h3>
              <p className="text-purple-200 text-sm">A: 随时可在 PayPal 账户中取消，取消后本期仍可使用，下期不再扣费。</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Q: 购买后如何查看积分余额？</h3>
              <p className="text-purple-200 text-sm">A: 前往个人中心查看您的积分余额和使用记录。</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Q: 支持退款吗？</h3>
              <p className="text-purple-200 text-sm">A: 7天内如有任何问题可申请全额退款，请联系我们。</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-purple-200 text-sm">
          <p>💳 支付安全由 PayPal 提供支持</p>
          <p className="mt-2">📧 联系我们: support@imagetoolss.com</p>
        </div>
      </main>
    </div>
  )
}
