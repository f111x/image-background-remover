import { Metadata } from "next"
import { PricingContent } from "./pricing-content"

export const metadata: Metadata = {
  title: "Pricing - Credit Packages & Subscription Plans | ImageTools",
  description: "Choose from affordable credit packages or monthly subscriptions. Pay only for what you use. Credits never expire. High quality output, no watermark on paid plans. Start with free trial credits.",
  keywords: ["ImageTools pricing", "buy credits", "credit packages", "subscription plans", "AI background remover cost"],
  robots: {
    index: true,
    follow: true,
  },
}

export default function PricingPage() {
  return <PricingContent />
}
