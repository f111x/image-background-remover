import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "White Background Product Photos — AI Background Editor | ImageTools",
  description: "Add pure white backgrounds to your product photos instantly with AI. Upload any image and get a perfect white background that meets Amazon, eBay, and all major marketplace requirements. Free to try.",
  alternates: { canonical: "https://imagetoolss.com/white-background-for-product-photos" },
  openGraph: {
    title: "White Background Product Photos — AI Tool | ImageTools",
    description: "Add pure white backgrounds to product photos in seconds. Meet Amazon, eBay, and Shopify requirements with AI-powered background replacement.",
    url: "https://imagetoolss.com/white-background-for-product-photos",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "White Background for Product Photos | ImageTools",
  },
  keywords: ["white background product photos", "product photo white background", "white background amazon", "ecommerce product images", "white background editor"],
}

const wbBenefits = [
  "Pure white (#FFFFFF) backgrounds that meet marketplace standards",
  "AI-powered edge detection for clean product cutouts",
  "Works with any product type — apparel, electronics, jewelry",
  "Preserves original image quality and resolution",
  "Instant download as JPG or PNG",
  "Free to try, no signup required",
]

const wbSteps = [
  {
    title: "Upload Your Product Photo",
    description: "Upload any product photo, whether taken on a colored background or with a busy setting. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Detects and Replaces the Background",
    description: "Our AI detects the product subject and replaces the background with a pure white (#FFFFFF), giving you a clean, compliant product image.",
  },
  {
    title: "Download & Upload to Any Marketplace",
    description: "Download your white background product photo and upload directly to Amazon, eBay, Shopify, or any other platform. Get approved faster with compliant images.",
  },
]

const wbUseCases = [
  "Amazon product listings",
  "eBay product images",
  "Shopify store photos",
  "Google Shopping ads",
  "Facebook Marketplace",
  "Print catalogs and brochures",
]

const wbFaqs = [
  {
    q: "Is the white background pure (#FFFFFF)?",
    a: "Yes. Our AI replaces the background with a pure white (#FFFFFF), which meets Amazon, eBay, and most major marketplace requirements for professional product images.",
  },
  {
    q: "Will it work on complex product photos?",
    a: "Yes. The AI handles most product types including apparel on hangers, products with shadows, and items with fine details like jewelry or electronics.",
  },
  {
    q: "What if the background isn't fully removed?",
    a: "The AI is trained on millions of product images and handles most cases well. For tricky images with similar foreground/background colors, results may need minor touch-ups.",
  },
  {
    q: "Is this free to use?",
    a: "Yes, you can process images for free as a guest. Sign up for more credits to process at higher quality for professional use.",
  },
]

const relatedTools = [
  {
    name: "Background Remover",
    href: "/tools/background-remover",
    description: "Remove backgrounds completely for transparent cutouts.",
  },
  {
    name: "AI Image Editor",
    href: "/tools/ai-editor",
    description: "Further enhance your product photos with AI edits.",
  },
  {
    name: "Compress Image",
    href: "/tools/compress-image",
    description: "Reduce file size for faster marketplace uploads.",
  },
]

export default function WhiteBackgroundProductPage() {
  return (
    <ScenePageTemplate
      badge="For Product Photos"
      title="White Background Editor"
      platformName="Marketplaces"
      heading="Add White Background to Product Photos"
      description="Turn any product photo into a professional white background image. Our AI adds a pure white background that meets Amazon, eBay, and all major marketplace requirements. Upload, process, and download in seconds."
      benefits={wbBenefits}
      steps={wbSteps}
      useCases={wbUseCases}
      faqs={wbFaqs}
      relatedTools={relatedTools}
    />
  )
}