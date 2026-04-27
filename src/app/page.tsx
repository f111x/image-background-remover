import { Layout } from "@/components/layout"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free AI Image Tools Online",
  description: "Remove backgrounds, remove watermarks, edit photos with AI, and convert images to PDF online with ImageTools.",
  alternates: { canonical: "/" },
}


export default function Home() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "ImageTools",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        url: "https://imagetoolss.com",
        description: "Free online AI image tools for background removal, watermark removal, AI image editing, and image to PDF conversion.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }) }} />
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />
    </Layout>
  )
}
