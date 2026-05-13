import { Layout } from "@/components/layout"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { ConversionProof } from "@/components/conversion-proof"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free AI Image Tools Online — Background Remover, Watermark Remover, AI Editor | ImageTools",
  description: "Remove backgrounds, erase watermarks, edit photos with AI, and convert images to PDF — all free, all in your browser. No signup required. Trusted by 50,000+ users.",
  alternates: { canonical: "https://imagetoolss.com/" },
  openGraph: {
    title: "ImageTools — Free AI Image Tools Online",
    description: "Remove backgrounds, erase watermarks, edit photos with AI, and convert images to PDF — all free in your browser.",
    url: "https://imagetoolss.com/",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageTools — Free AI Image Tools Online",
    description: "Remove backgrounds, erase watermarks, edit photos with AI, and convert images to PDF — all free.",
  },
}

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <ConversionProof />
      <Showcase />
      <Testimonials />
      <FAQ />
    </Layout>
  )
}
