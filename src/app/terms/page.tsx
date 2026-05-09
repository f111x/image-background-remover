import { Metadata } from "next"
import TermsClient from "./terms-client"

export const metadata: Metadata = {
  title: "Terms of Service — ImageTools",
  description: "Read the Terms of Service for ImageTools. Understand your rights, responsibilities, and our policies when using our free AI image tools.",
  alternates: { canonical: "https://imagetoolss.com/terms" },
  openGraph: {
    title: "Terms of Service — ImageTools",
    description: "Read the Terms of Service for ImageTools.",
    url: "https://imagetoolss.com/terms",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
}

export default function TermsPage() {
  return <TermsClient />
}
