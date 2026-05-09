import { Metadata } from "next"
import { FAQContent } from "./faq-content"
import { FAQJsonLd } from "@/components/seo/faq-json-ld"

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | ImageTools",
  description: "Find answers to common questions about ImageTools. Learn how credits work, payment methods, processing speed, image formats supported, and how to get started with our AI image tools.",
  alternates: { canonical: "https://imagetoolss.com/faq" },
  openGraph: {
    title: "Frequently Asked Questions | ImageTools",
    description: "Frequently asked questions about ImageTools. Learn how our free AI image tools work, what formats are supported, and how credits and subscriptions work.",
    url: "https://imagetoolss.com/faq",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | ImageTools",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function FAQPage() {
  return (
    <>
      <FAQJsonLd />
      <FAQContent />
    </>
  )
}
