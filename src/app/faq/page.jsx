export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
      <header className="py-4 px-4 flex justify-between items-center">
        <a href="/" className="text-white hover:text-purple-200 transition-colors">← 返回首页</a>
        <div className="flex items-center gap-3">
          <a href="/pricing" className="text-white hover:text-purple-200 transition-colors text-sm">定价方案</a>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">常见问题</h1>
          <p className="text-purple-200">关于图片背景去除工具的常见问题解答</p>
        </div>

        <div className="space-y-6">
          {/* Usage */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">📊 使用问题</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Q: 免费额度用完怎么办？</h3>
                <p className="text-purple-200 text-sm">A: 登录后每天可以获得更多免费处理次数。注册用户每天有10次免费处理，付费用户可享受无限次处理。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 免费额度多久重置？</h3>
                <p className="text-purple-200 text-sm">A: 免费额度每天凌晨0点重置。每位用户每天有固定的免费处理次数。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 处理速度为什么有时慢有时快？</h3>
                <p className="text-purple-200 text-sm">A: 处理速度取决于服务器负载。付费用户享有优先处理队列，可以更快获得结果。</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">💳 支付问题</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Q: 如何升级到付费版？</h3>
                <p className="text-purple-200 text-sm">A: 付费功能即将推出，届时可以在个人中心一键升级，支持微信支付和支付宝。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 支付安全吗？</h3>
                <p className="text-purple-200 text-sm">A: 支付由 Stripe 提供支持，所有支付信息都经过加密处理，我们不会存储您的支付信息。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 可以退款吗？</h3>
                <p className="text-purple-200 text-sm">A: 付费功能推出后，7天内如有任何问题可申请全额退款。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 付费后可以开发票吗？</h3>
                <p className="text-purple-200 text-sm">A: 可以，发票将在付款后自动发送到您的邮箱。</p>
              </div>
            </div>
          </div>

          {/* Technical */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🔧 技术问题</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Q: 支持哪些图片格式？</h3>
                <p className="text-purple-200 text-sm">A: 支持 JPG、JPEG、PNG、WEBP 格式。图片大小不超过 5MB。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 处理后的图片会保存吗？</h3>
                <p className="text-purple-200 text-sm">A: 不会。所有图片仅在内存中处理，处理完成后立即删除，不保存任何数据，保护您的隐私。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 为什么处理后的图片有水印？</h3>
                <p className="text-purple-200 text-sm">A: 免费用户和游客的处理结果会带有水印。登录后水印会自动移除，付费用户享有完全无水印体验。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 图片处理失败怎么办？</h3>
                <p className="text-purple-200 text-sm">A: 如果处理失败，可能是图片格式不支持或服务器繁忙。请稍后重试，或联系客服获取帮助。</p>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">👤 账户问题</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Q: 如何登录？</h3>
                <p className="text-purple-200 text-sm">A: 点击首页的"使用 Google 登录"按钮即可快速登录，无需注册。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 为什么要用 Google 登录？</h3>
                <p className="text-purple-200 text-sm">A: Google 登录简单安全，无需记住密码，也不用担心账号安全问题。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 如何退出登录？</h3>
                <p className="text-purple-200 text-sm">A: 进入个人中心页面，点击"退出登录"按钮即可。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 如何查看我的使用记录？</h3>
                <p className="text-purple-200 text-sm">A: 登录后进入个人中心，可以查看今日使用情况和操作历史。</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">📧 联系支持</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Q: 遇到问题怎么联系客服？</h3>
                <p className="text-purple-200 text-sm">A: 发送邮件至 support@imagetoolss.com，我们会在24小时内回复。</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Q: 有功能建议或反馈？</h3>
                <p className="text-purple-200 text-sm">A: 欢迎通过邮件反馈您的建议，帮助我们做得更好！</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-purple-200 mb-4">还有其他问题？</p>
          <a
            href="mailto:support@imagetoolss.com"
            className="inline-block px-6 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            联系我们
          </a>
        </div>
      </main>
    </div>
  )
}
