"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Check, CreditCard, Zap, RefreshCw, Shield, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { PayPalCheckout } from "@/components/paypal/PayPalButtons"
import { SubscriptionPayPal } from "@/components/paypal/SubscriptionPayPal"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { analytics } from "@/lib/analytics"


export function PricingContent() {
  const { t } = useLanguage()
  const { user } = useSupabaseUser()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const loginHref = (type: "credits" | "subscription", planId: string) =>
    `/login?next=${encodeURIComponent(`/pricing?checkout=${type}:${planId}`)}`

  const creditPackages = [
    { name: t("plan_trial"), id: "Trial", price: "1", credits: 10, features: [t("feature_trial_credits"), t("feature_standard_quality"), t("feature_high_quality"), t("feature_no_watermark"), t("feature_email_support")], popular: false },
    { name: t("plan_starter"), id: "Starter", price: "5", credits: 50, features: [t("feature_50_credits"), t("feature_high_quality"), t("feature_no_watermark"), t("feature_priority_email_support"), t("feature_credits_never_expire")], popular: true },
    { name: t("plan_value"), id: "Value", price: "15", credits: 200, features: [t("feature_200_credits"), t("feature_highest_quality"), t("feature_no_watermark"), t("feature_priority_support"), t("feature_credits_never_expire"), t("feature_bulk_discount")], popular: false },
  ]

  const monthlyPlans = [
    { name: t("plan_basic"), id: "Basic", price: "5", credits: 50, features: [t("feature_50_month"), t("feature_refresh_monthly"), t("feature_rollover"), t("feature_rollover_100"), t("feature_high_quality"), t("feature_email_support")], popular: false },
    { name: t("plan_pro"), id: "Pro", price: "15", credits: 200, features: [t("feature_200_month"), t("feature_refresh_monthly"), t("feature_rollover"), t("feature_rollover_400"), t("feature_highest_quality"), t("feature_priority_support"), t("feature_no_watermark")], popular: true },
  ]

  useEffect(() => {
    analytics.pricing.view()
  }, [])

  const handlePurchaseSuccess = (credits: number, packageName: string) => {
    setPurchasing(null)
    analytics.pricing.purchaseSuccess({ plan: packageName, credits })
    window.location.href = "/profile?purchase=success&credits=" + credits
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="text-center mb-16 pt-16 px-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            {t("pricing_subtitle")}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("pricing_title")}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            {t("pricing_subtitle")}
          </p>
          <p className="text-sm text-gray-500 max-w-3xl mx-auto mt-4 bg-white border border-purple-100 rounded-xl px-4 py-3">
            {t("pricing_credit_rule")}
          </p>
        </div>

        {/* One-time Credit Packages */}
        <div className="mb-20 px-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-bold">{t("credit_packages")}</h2>
          </div>
          <p className="text-sm text-gray-500 text-center mb-8">{t("one_time_credit_note")}</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {creditPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative bg-white rounded-2xl p-8 shadow-md border transition-all hover:shadow-lg ${
                  pkg.popular
                    ? "border-purple-500 shadow-purple-500/10"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                    {t("most_popular")}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                </div>

                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">${pkg.price}</span>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-600 text-sm rounded-full">
                      <Zap className="w-3 h-3" />
                      {pkg.credits} {t("credits_label")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    ${(parseFloat(pkg.price) / pkg.credits).toFixed(3)} {t("per_credit")}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {!user ? (
                  <a
                    href={loginHref("credits", pkg.id)}
                    className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  >
                    {t("buy_now")}
                  </a>
                ) : purchasing === pkg.id ? (
                  <div className="space-y-3">
                    <PayPalCheckout
                      packageName={pkg.id}
                      price={pkg.price}
                      credits={pkg.credits}
                      onSuccess={(credits) => handlePurchaseSuccess(credits, pkg.id)}
                    />
                    <button
                      onClick={() => setPurchasing(null)}
                      className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      analytics.pricing.checkoutClick({ plan: pkg.id })
                      setPurchasing(pkg.id)
                    }}
                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {t("buy_now")}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Subscription */}
        <div className="mb-20 px-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <RefreshCw className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-bold">{t("monthly_subscription")}</h2>
          </div>
          <p className="text-sm text-gray-500 text-center mb-8">{t("subscription_credit_note")}</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {monthlyPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl p-8 shadow-md border transition-all hover:shadow-lg ${
                  plan.popular
                    ? "border-purple-500 shadow-purple-500/10"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                    {t("most_popular")}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                </div>

                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/{t("month_unit")}</span>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                      <RefreshCw className="w-3 h-3" />
                      {plan.credits} {t("credits_per_month")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {t("auto_renews_monthly")}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {!user ? (
                  <a
                    href={loginHref("subscription", plan.id)}
                    className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  >
                    {t("subscribe_now")}
                  </a>
                ) : (
                  <SubscriptionPayPal
                    planName={plan.id}
                    credits={plan.credits}
                    price={plan.price}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16 px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-bold">{t("common_questions")}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { q: t("faq_credits_expire"), a: t("faq_credits_expire_a") },
              { q: t("faq_payment"), a: t("faq_payment_a") },
              { q: t("faq_refund"), a: t("faq_refund_a") },
              { q: t("faq_credit_usage"), a: t("faq_credit_usage_a") },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 transition-colors">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-12 max-w-3xl mx-6 mb-8 border border-purple-100">
          <h2 className="text-2xl font-bold mb-4">{t("get_started_free")}</h2>
          <p className="text-gray-500 mb-6">
            {t("free_credits_on_signup")}
          </p>
          <a
            href="/signup?next=/tools/background-remover"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            {t("get_started_free")}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </Layout>
  )
}
