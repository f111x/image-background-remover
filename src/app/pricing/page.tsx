import { Metadata } from "next"
import { PricingContent } from "./pricing-content"
import { PricingJsonLd } from "@/components/seo/pricing-json-ld"

export const metadata: Metadata = {
  title: "Pricing - Credit Packages & Subscription Plans | ImageTools",
  description: "Choose from affordable credit packages or monthly subscriptions. Pay only for what you use. Credits never expire. High quality output, no watermark on paid plans. Start with free trial credits.",
  alternates: { canonical: "https://imagetoolss.com/pricing" },
  openGraph: {
    title: "Pricing — Credit Packages & Subscription Plans | ImageTools",
    description: "",
    url: "https://imagetoolss.com/pricing",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Credit Packages & Subscription Plans | ImageTools",
  },
  keywords: ["ImageTools pricing", "buy credits", "credit packages", "subscription plans", "AI background remover cost"],
  robots: {
    index: true,
    follow: true,
  },
}

export default function PricingPage() {
  return (
    <>
      <PricingJsonLd />
      <PricingContent />
    </>
  )
}
