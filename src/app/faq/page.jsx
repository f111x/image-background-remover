"use client"

import { useLanguage } from "@/lib/i18n"
import { Layout } from "@/components/layout"
import { Shield, ArrowRight } from "lucide-react"

export default function FAQPage() {
  const { t } = useLanguage()

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <header className="py-4 px-4 flex justify-between items-center">
          <a href="/" className="text-white hover:text-purple-200 transition-colors">← {t("back_to_home")}</a>
          <div className="flex items-center gap-3">
            <a href="/pricing" className="text-white hover:text-purple-200 transition-colors text-sm">{t("pricing_plan")}</a>
          </div>
        </header>

        <main className="container mx-auto px-4 pb-12 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{t("faq_page_title")}</h1>
            <p className="text-purple-200">{t("faq_page_subtitle")}</p>
          </div>

          <div className="space-y-6">
            {/* Usage */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">📊 {t("faq_usage_section")}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_free_credits_run_out")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_free_credits_run_out_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_free_credits_reset")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_free_credits_reset_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_processing_speed")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_processing_speed_a")}</p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">💳 {t("faq_payment_section")}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_upgrade_paid")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_upgrade_paid_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_payment_secure")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_payment_secure_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_can_refund")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_can_refund_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_invoice")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_invoice_a")}</p>
                </div>
              </div>
            </div>

            {/* Technical */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🔧 {t("faq_technical_section")}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_formats")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_formats_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_images_saved")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_images_saved_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_watermark")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_watermark_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_processing_failed")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_processing_failed_a")}</p>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">👤 {t("faq_account_section")}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_how_to_login")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_how_to_login_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_why_google")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_why_google_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_how_to_logout")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_how_to_logout_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_view_usage")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_view_usage_a")}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">📧 {t("faq_contact_section")}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_contact_support")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_contact_support_a")}</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Q: {t("faq_suggestions")}</h3>
                  <p className="text-purple-200 text-sm">A: {t("faq_suggestions_a")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-purple-200 mb-4">{t("faq_other_questions")}</p>
            <a
              href="mailto:support@imagetoolss.com"
              className="inline-block px-6 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t("contact_us")}
            </a>
          </div>
        </main>
      </div>
    </Layout>
  )
}
