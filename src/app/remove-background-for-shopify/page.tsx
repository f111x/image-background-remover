import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Remove Background from Product Images for Shopify | ImageTools",
  description: "Remove backgrounds from your Shopify product images instantly. Get perfect white backgrounds that meet Shopify's requirements. Upload your images and download transparent PNGs in seconds.",
  alternates: { canonical: "https://imagetoolss.com/remove-background-for-shopify" },
  openGraph: {
    title: "Remove Background for Shopify — Shopify Product Images | ImageTools",
    description: "",
    url: "https://imagetoolss.com/remove-background-for-shopify",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Background for Shopify — Shopify Product Images | ImageTools",
  },
  keywords: ["remove background shopify", "shopify product image", "white background shopify", "product photo editor", "background remover for ecommerce"],
}

const shopifyBenefits = [
  "Meet Shopify's recommended image requirements",
  "Create consistent, professional product galleries",
  "Instant transparent or white backgrounds",
  "Works with any product type — apparel, accessories, electronics",
  "No design skills needed",
  "Fast processing — seconds per image",
]

const shopifySteps = [
  {
    title: "Upload Your Product Photo",
    description: "Drag and drop or click to upload your product image. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Removes the Background",
    description: "Our AI automatically detects the product and removes the background, giving you a perfect cutout.",
  },
  {
    title: "Download & Upload to Shopify",
    description: "Download your transparent PNG and upload directly to your Shopify product page.",
  },
]

const shopifyUseCases = [
  "Apparel and clothing photos",
  "Accessories and jewelry",
  "Electronics and gadgets",
  "Home and garden products",
  "Beauty and cosmetics",
  "Sports and outdoors",
]

const shopifyFaqs = [
  {
    q: "What image format does Shopify recommend?",
    a: "Shopify recommends using PNG files with pure white backgrounds (#FFFFFF) for product images. Our tool can remove backgrounds completely for a transparent PNG, or add a white background.",
  },
  {
    q: "What image size should I use for Shopify?",
    a: "Shopify recommends product images of at least 1000x1000 pixels. Our tool preserves image quality so your images meet this requirement.",
  },
  {
    q: "Can I process multiple images at once?",
    a: "You can process images one at a time. For batch processing, consider using our API or signing up for a plan with more credits.",
  },
  {
    q: "Is this free to use for Shopify sellers?",
    a: "Yes, you can try the background remover as a guest. Sign up to get free credits for higher quality output without watermarks.",
  },
]

const relatedTools = [
  {
    name: "Background Remover",
    href: "/tools/background-remover",
    description: "Remove backgrounds from any image instantly with AI.",
  },
  {
    name: "AI Image Editor",
    href: "/tools/ai-editor",
    description: "Edit product photos with natural language AI prompts.",
  },
  {
    name: "Watermark Remover",
    href: "/tools/watermark-remover",
    description: "Clean up unwanted objects from product photos.",
  },
]

export default function ShopifyBackgroundRemoverPage() {
  return (
    <ScenePageTemplate
      badge="For Shopify"
      title="Shopify Product Photos"
      platformName="Shopify"
      heading="Remove Background from Product Images for Shopify"
      description="Create perfect Shopify product images with instant AI background removal. Get professional photos that meet Shopify's guidelines and make your products stand out."
      benefits={shopifyBenefits}
      steps={shopifySteps}
      useCases={shopifyUseCases}
      faqs={shopifyFaqs}
      relatedTools={relatedTools}
    />
  )
}
