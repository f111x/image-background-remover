"use client"

import { useState } from "react"

const creditPackages = [
  {
    name: "Trial",
    price: "1.00",
    credits: 10,
    description: "Perfect for trying out",
    features: ["10 credits", "Standard quality", "With watermark", "Email support"],
    popular: false,
  },
  {
    name: "Starter",
    price: "5.00",
    credits: 50,
    description: "For regular users",
    features: ["50 credits", "High quality", "No watermark", "Email support"],
    popular: false,
  },
  {
    name: "Value",
    price: "15.00",
    credits: 200,
    description: "Best value",
    features: ["200 credits", "High quality", "No watermark", "Priority support"],
    popular: true,
  },
]

const monthlyPlans = [
  {
    name: "Basic",
    price: "5.00",
    period: "/month",
    credits: 50,
    description: "Light usage",
    features: ["50 credits/month", "High quality", "No watermark", "Auto-renew"],
  },
  {
    name: "Pro",
    price: "15.00",
    period: "/month",
    credits: 200,
    description: "Power users",
    features: ["200 credits/month", "High quality", "No watermark", "Priority support", "Auto-renew"],
    popular: false,
  },
]

export default function PricingPage() {
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null)

  const handlePurchase = async (packageName: string) => {
    // TODO: Integrate PayPal
    alert(`PayPal integration coming soon! Please contact us to purchase ${packageName} package.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pay only for what you use. Credits never expire.
          </p>
        </div>

        {/* Credit Packages */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">Credit Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {creditPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-2 ${
                  pkg.popular ? "border-purple-500 relative" : "border-transparent"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Best Value
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground text-sm">{pkg.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">${pkg.price}</span>
                  <span className="text-muted-foreground ml-2">+ {pkg.credits} credits</span>
                </div>

                <div className="text-center text-sm text-muted-foreground mb-4">
                  ${(parseFloat(pkg.price) / pkg.credits).toFixed(3)} per credit
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(pkg.name)}
                  disabled={true}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingPackage === pkg.name ? "Processing..." : "Coming Soon"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Plans */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Monthly Subscription</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {monthlyPlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-2 ${
                  plan.popular ? "border-purple-500 relative" : "border-transparent"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <div className="text-center text-sm text-muted-foreground mb-4">
                  {plan.credits} credits/month
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan.name)}
                  disabled={true}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingPackage === plan.name ? "Processing..." : "Coming Soon"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Common Questions</h2>
          <div className="text-left max-w-2xl mx-auto space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Do credits expire?</h3>
              <p className="text-muted-foreground text-sm">No! Credits never expire. Use them whenever you want.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2">What payment methods are supported?</h3>
              <p className="text-muted-foreground text-sm">We accept PayPal and major credit cards.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Can I get a refund?</h3>
              <p className="text-muted-foreground text-sm">Unused credits can be refunded within 30 days of purchase.</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-muted-foreground">
          <p>All payments are processed securely through PayPal.</p>
          <p className="text-sm mt-2">Need a custom plan? <a href="mailto:support@imagetoolss.com" className="text-primary hover:underline">Contact us</a></p>
        </div>
      </div>
    </div>
  )
}
