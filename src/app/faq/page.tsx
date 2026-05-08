import { Metadata } from "next"
import { FAQContent } from "./faq-content"

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | ImageTools",
  description: "Find answers to common questions about ImageTools. Learn how credits work, payment methods, processing speed, image formats supported, and how to get started with our AI image tools.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function FAQPage() {
  return <FAQContent />
}
