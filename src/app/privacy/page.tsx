import { Metadata } from "next"
import PrivacyClient from "./privacy-client"

export const metadata: Metadata = {
  title: "Privacy Policy — ImageTools",
  description: "Learn how ImageTools collects, uses, and protects your personal information. Your privacy is our priority — images are processed in memory and never stored.",
  alternates: { canonical: "https://imagetoolss.com/privacy" },
  openGraph: {
    title: "Privacy Policy — ImageTools",
    description: "Learn how ImageTools collects, uses, and protects your personal information.",
    url: "https://imagetoolss.com/privacy",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
