export default function PricingPage() {
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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Free/Guest */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">游客试用</h2>
              <p className="text-purple-200 text-sm mb-4">无需注册</p>
              <div className="text-4xl font-bold text-white mb-2">¥0</div>
              <p className="text-purple-200 text-sm">永久免费</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>每天 3 次免费处理</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>处理后带水印</span>
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <span className="text-red-400">✗</span>
                <span>无操作历史</span>
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <span className="text-red-400">✗</span>
                <span>普通处理速度</span>
              </li>
            </ul>
            <a
              href="/"
              className="block w-full py-3 text-center bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              立即试用
            </a>
          </div>

          {/* Registered User */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border-2 border-white/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
              推荐
            </div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">注册用户</h2>
              <p className="text-purple-200 text-sm mb-4">Google 账号登录</p>
              <div className="text-4xl font-bold text-white mb-2">¥0</div>
              <p className="text-purple-200 text-sm">永久免费</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>每天 10 次免费处理</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>无水印</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>30天操作历史</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span>
                <span>优先处理队列</span>
              </li>
            </ul>
            <a
              href="/"
              className="block w-full py-3 text-center bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              登录 / 注册
            </a>
          </div>

          {/* Paid User */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur rounded-2xl p-6 border-2 border-yellow-400/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">付费用户</h2>
              <p className="text-purple-200 text-sm mb-4">尊享会员</p>
              <div className="text-4xl font-bold text-white mb-2">¥9.9</div>
              <p className="text-purple-200 text-sm">每月</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-white">
                <span className="text-yellow-400">★</span>
                <span>无限次处理</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-yellow-400">★</span>
                <span>无水印</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-yellow-400">★</span>
                <span>无限操作历史</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-yellow-400">★</span>
                <span>最高优先级</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-yellow-400">★</span>
                <span>专属客服支持</span>
              </li>
            </ul>
            <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all">
              即将推出
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">常见问题</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-2">Q: 免费额度用完怎么办？</h3>
              <p className="text-purple-200 text-sm">A: 登录后每天可以获得更多免费处理次数。付费用户可享受无限次处理。</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Q: 如何升级到付费版？</h3>
              <p className="text-purple-200 text-sm">A: 付费功能即将推出，届时可以在个人中心一键升级。</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Q: 处理后的图片会保存吗？</h3>
              <p className="text-purple-200 text-sm">A: 不会。所有图片仅在内存中处理，不保存任何数据，保护您的隐私。</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Q: 支持哪些图片格式？</h3>
              <p className="text-purple-200 text-sm">A: 支持 JPG、PNG、WEBP 格式，图片大小不超过 5MB。</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Q: 付费后可以退款吗？</h3>
              <p className="text-purple-200 text-sm">A: 付费功能推出后，7天内如有任何问题可申请全额退款。</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-purple-200 text-sm">
          <p>💳 支付安全由 Stripe 提供支持</p>
          <p className="mt-2">📧 联系我们: support@imagetoolss.com</p>
        </div>
      </main>
    </div>
  )
}
