"use client"

import { Layout } from "@/components/layout"
import { useLanguage } from "@/lib/i18n"

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <header className="py-4 px-4 flex justify-between items-center">
          <a href="/" className="text-white hover:text-purple-200 transition-colors">← {t("back_to_home")}</a>
        </header>

        <main className="container mx-auto px-4 pb-12 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{t("footer_terms")}</h1>
            <p className="text-purple-200">Last updated: 2026-04-07</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Acceptance of Terms</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>By accessing and using ImageTools, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Description of Service</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>ImageTools provides an AI-powered background removal and image editing service. We reserve the right to modify, suspend, or discontinue the service at any time without notice.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">User Responsibilities</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>You agree to use the service only for lawful purposes and in accordance with these Terms. You are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Not using the service for any illegal or unauthorized purpose</li>
                  <li>Not infringing upon any intellectual property rights</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Credit Usage</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>Credits purchased or received for free have the following characteristics:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>One-time purchased credits never expire</li>
                  <li>Monthly subscription credits refresh each month</li>
                  <li>Credits are non-transferable</li>
                  <li>Unused credits do not carry over unless specified</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Intellectual Property</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>The service and all original content, features, and functionality are owned by ImageTools and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of any images you upload.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Payment and Refunds</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>All payments are processed through secure third-party payment providers. Refund policy:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Unused credits can be refunded within 30 days of purchase</li>
                  <li>Monthly subscriptions can be cancelled at any time</li>
                  <li>No refunds for used credits</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Limitation of Liability</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>ImageTools shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>If you have any questions about these Terms, please contact us:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email: support@imagetoolss.com</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}
