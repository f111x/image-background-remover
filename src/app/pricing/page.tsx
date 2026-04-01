"use client"

import { PayPalCheckout } from "@/components/paypal/PayPalButtons"

const packages = [
  {
    name: "Starter",
    price: "1.00",
    credits: 10,
    description: "Perfect for trying out",
    features: ["10 credits", "Basic support", "Standard processing"],
  },
  {
    name: "Standard",
    price: "4.00",
    credits: 50,
    description: "For regular users",
    features: ["50 credits", "Priority support", "Faster processing"],
    popular: true,
  },
  {
    name: "Pro",
    price: "10.00",
    credits: 100,
    description: "For power users",
    features: ["100 credits", "Premium support", "Fastest processing"],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the package that fits your needs. No subscriptions, pay only for what you use.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-2 ${
                pkg.popular ? "border-purple-500 relative" : "border-transparent"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm">{pkg.description}</p>
              </div>

              <div className="text-center mb-6">
                <span className="text-5xl font-bold">${pkg.price}</span>
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

              <div className="border-t pt-6">
                <PayPalCheckout
                  packageName={pkg.name}
                  price={pkg.price}
                  credits={pkg.credits}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-muted-foreground">
          <p>All payments are processed securely through PayPal.</p>
          <p className="text-sm mt-2">Credits never expire. Need more? Contact us anytime.</p>
        </div>
      </div>
    </div>
  )
}
