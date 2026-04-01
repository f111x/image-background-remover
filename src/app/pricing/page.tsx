"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Check, CreditCard, Zap, RefreshCw, Shield, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

const creditPackages = [
  {
    name: "Trial",
    price: "1",
    credits: 10,
    features: [
      "10 one-time credits",
      "Standard quality",
      "High quality output",
      "No watermark on request",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Starter",
    price: "5",
    credits: 50,
    features: [
      "50 one-time credits",
      "High quality output",
      "No watermark",
      "Priority email support",
      "Credits never expire",
    ],
    popular: true,
  },
  {
    name: "Value",
    price: "15",
    credits: 200,
    features: [
      "200 one-time credits",
      "Highest quality output",
      "No watermark",
      "Priority support",
      "Credits never expire",
      "Bulk discount",
    ],
    popular: false,
  },
]

const monthlyPlans = [
  {
    name: "Basic",
    monthlyPrice: "5",
    monthlyCredits: 50,
    rolloverCap: 100,
    features: [
      "50 credits/month",
      "Credits refresh monthly",
      "Unused credits roll over",
      "Up to 100 rollover cap",
      "High quality output",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: "15",
    monthlyCredits: 200,
    rolloverCap: 400,
    features: [
      "200 credits/month",
      "Credits refresh monthly",
      "Unused credits roll over",
      "Up to 400 rollover cap",
      "Highest quality output",
      "Priority support",
      "No watermark",
    ],
    popular: true,
  },
]

export default function PricingPage() {
  const { t } = useLanguage()
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null)

  const handlePurchase = async (packageName: string) => {
    alert(`PayPal integration coming soon! Please contact us to purchase the ${packageName} package.`)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero */}
        <div className="text-center mb-16 pt-16 px-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            {t("pricing_subtitle")}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("pricing_title")}
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t("pricing_subtitle")}
          </p>
        </div>

        {/* One-time Credit Packages */}
        <div className="mb-20 px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-bold">{t("credit_packages")}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {creditPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border transition-all ${
                  pkg.popular
                    ? "border-purple-500 shadow-purple-500/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
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
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-sm rounded-full">
                      <Zap className="w-3 h-3" />
                      {pkg.credits} credits
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    ${(parseFloat(pkg.price) / pkg.credits).toFixed(3)} per credit
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(pkg.name)}
                  disabled={true}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    pkg.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                  }`}
                >
                  {t("coming_soon") || "Coming Soon"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Subscription */}
        <div className="mb-20 px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <RefreshCw className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-bold">{t("monthly_subscription")}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {monthlyPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border transition-all ${
                  plan.popular
                    ? "border-purple-500 shadow-purple-500/10"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                    {t("recommended") || "Recommended"}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                </div>

                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">${plan.monthlyPrice}</span>
                  <span className="text-gray-400">/month</span>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">
                      <RefreshCw className="w-3 h-3" />
                      {plan.monthlyCredits}/month
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Rollover cap: {plan.rolloverCap} credits
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(`${plan.name} Monthly`)}
                  disabled={true}
                  className={`w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg`}
                >
                  {t("coming_soon") || "Coming Soon"}
                </button>
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
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-12 max-w-3xl mx-6 mb-8 border border-purple-100 dark:border-purple-800/50">
          <h2 className="text-2xl font-bold mb-4">{t("get_started_free")}</h2>
          <p className="text-gray-500 mb-6">
            3 free credits when you sign up.
          </p>
          <a
            href="/"
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
