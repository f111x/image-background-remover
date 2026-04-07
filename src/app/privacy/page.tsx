"use client"

import { Layout } from "@/components/layout"
import { useLanguage } from "@/lib/i18n"

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <header className="py-4 px-4 flex justify-between items-center">
          <a href="/" className="text-white hover:text-purple-200 transition-colors">← {t("back_to_home")}</a>
        </header>

        <main className="container mx-auto px-4 pb-12 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{t("footer_privacy")}</h1>
            <p className="text-purple-200">Last updated: 2026-04-07</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Information Collection</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. This includes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (name, email address, profile picture)</li>
                  <li>Images you upload for processing</li>
                  <li>Usage data and analytics</li>
                  <li>Payment information (processed by third-party payment providers)</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your image editing requests</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze trends and usage</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Data Security</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>Your privacy is our priority. All images are processed in memory and immediately deleted after processing. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Image Processing</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>Images uploaded to our service are:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Processed temporarily in memory</li>
                  <li>Automatically deleted after processing is complete</li>
                  <li>Never stored on our servers longer than necessary</li>
                  <li>Never shared with third parties for marketing purposes</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Cookies and Tracking</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Third-Party Services</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Rights</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct or delete your personal information</li>
                  <li>Object to our use of your personal information</li>
                  <li>Request data portability</li>
                </ul>
                <p>To exercise these rights, please contact us at support@imagetoolss.com.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
              <div className="space-y-4 text-purple-200 text-sm">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
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
