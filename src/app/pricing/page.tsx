"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, CreditCard, Zap, RefreshCw, Shield, Clock, ArrowRight } from "lucide-react"

const creditPackages = [
  {
    name: "Trial",
    price: "1",
    credits: 10,
    description: "Perfect for trying out",
    features: [
      "10 one-time credits",
      "Standard quality",
      "High quality output",
      "No watermark on request",
      "Email support",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Starter",
    price: "5",
    credits: 50,
    description: "For regular users",
    features: [
      "50 one-time credits",
      "High quality output",
      "No watermark",
      "Priority email support",
      "Credits never expire",
    ],
    popular: true,
    cta: "Most Popular",
  },
  {
    name: "Value",
    price: "15",
    credits: 200,
    description: "Best value",
    features: [
      "200 one-time credits",
      "Highest quality output",
      "No watermark",
      "Priority support",
      "Credits never expire",
      "Bulk discount",
    ],
    popular: false,
    cta: "Best Value",
  },
]

const monthlyPlans = [
  {
    name: "Basic",
    monthlyPrice: "5",
    monthlyCredits: 50,
    rolloverCap: 100,
    description: "Light usage",
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
    description: "Power users",
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
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null)

  const handlePurchase = async (packageName: string) => {
    alert(`PayPal integration coming soon! Please contact us to purchase the ${packageName} package.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
      <header className="p-6 border-b border-gray-800/50 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ImageTools
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/pricing" className="text-purple-400 font-medium">Pricing</Link>
            <Link href="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Hero */}
        <div className="text-center mb-16 pt-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Simple, transparent pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pay only for what you use. Credits never expire with one-time packages.
            <br className="hidden md:block" />
            Monthly subscribers get rolling credits that carry over.
          </p>
        </div>

        {/* One-time Credit Packages */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-bold">One-time Credit Packages</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {creditPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative bg-gray-800/30 backdrop-blur rounded-2xl p-8 border transition-all ${
                  pkg.popular 
                    ? "border-purple-500 shadow-lg shadow-purple-500/10 scale-105" 
                    : "border-gray-700/50 hover:border-gray-600"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                  <p className="text-gray-400 text-sm">{pkg.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">${pkg.price}</span>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-400 text-sm rounded-full">
                      <Zap className="w-3 h-3" />
                      {pkg.credits} credits
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ${(parseFloat(pkg.price) / pkg.credits).toFixed(3)} per credit
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(pkg.name)}
                  disabled={true}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    pkg.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                >
                  {loadingPackage === pkg.name ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {pkg.cta}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Subscription */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <RefreshCw className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-bold">Monthly Subscription</h2>
          </div>
          <p className="text-center text-gray-400 mb-8 max-w-xl mx-auto">
            Subscribe for a monthly credit allocation. Unused credits roll over to the next month (up to 2x your monthly allocation).
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {monthlyPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-gray-800/30 backdrop-blur rounded-2xl p-8 border transition-all ${
                  plan.popular 
                    ? "border-purple-500 shadow-lg shadow-purple-500/10" 
                    : "border-gray-700/50 hover:border-gray-600"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                    Recommended
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">${plan.monthlyPrice}</span>
                  <span className="text-gray-400">/month</span>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full">
                      <RefreshCw className="w-3 h-3" />
                      {plan.monthlyCredits}/month
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Rollover cap: {plan.rolloverCap} credits
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(`${plan.name} Monthly`)}
                  disabled={true}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                >
                  {loadingPackage === plan.name ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-bold">Common Questions</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              {
                q: "Do credits expire?",
                a: "One-time purchased credits never expire. Monthly subscription credits refresh each month, with unused credits rolling over (up to 2x your monthly allocation).",
              },
              {
                q: "What payment methods are supported?",
                a: "We accept PayPal and major credit cards. More payment options coming soon.",
              },
              {
                q: "Can I get a refund?",
                a: "Unused one-time purchased credits can be refunded within 30 days of purchase. Contact support for assistance.",
              },
              {
                q: "How is credit usage calculated?",
                a: "Each image processing request uses 1 credit, regardless of image size or complexity.",
              },
              {
                q: "What happens when I run out of credits?",
                a: "You'll need to purchase more credits or subscribe to a monthly plan to continue using ImageTools.",
              },
              {
                q: "Can I upgrade or downgrade my subscription?",
                a: "Yes, you can change your subscription plan at any time. Contact support for plan changes.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-800/30 backdrop-blur rounded-xl p-5 border border-gray-700/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  {faq.q}
                </h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-12 border border-purple-500/20 mb-8">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Create an account and get 3 free credits to try ImageTools.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm">
          <p>All payments are processed securely through PayPal.</p>
          <p className="mt-1">
            Need a custom plan? <a href="mailto:support@imagetoolss.com" className="text-purple-400 hover:underline">Contact us</a>
          </p>
        </div>
      </main>
    </div>
  )
}
