import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Make Product Photo White Background Online Free | ImageTools",
  description: "Make your product photos have a pure white background online. Upload any product image and get a perfect white background in seconds. No signup required. Perfect for ecommerce and marketplace listings.",
  alternates: { canonical: "https://imagetoolss.com/make-product-photo-white-background" },
  openGraph: {
    title: "White Background Product Photos — AI-Powered | ImageTools",
    description: "Create perfect white background product photos with AI. Upload your product image and get a clean white background ready for any e-commerce platform.",
    url: "https://imagetoolss.com/make-product-photo-white-background",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "White Background Product Photos — AI-Powered | ImageTools",
  },
  keywords: ["make product photo white background", "white background product photo", "product photo white background online", "ecommerce white background", "remove background white"],
}

const benefits = [
  "Pure white (#FFFFFF) backgrounds that meet ecommerce standards",
  "AI-powered edge detection for clean, professional cutouts",
  "Works with any product type — apparel, electronics, jewelry, art",
  "No design skills or software needed",
  "Process images in seconds — batch ready",
  "High resolution output for print and web",
]

const steps = [
  {
    title: "Upload Your Product Photo",
    description: "Drag and drop or click to upload your product image. Works best with photos on any background. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Creates White Background",
    description: "Our AI removes the original background and replaces it with a pure white (#FFFFFF) background, ready for any platform.",
  },
  {
    title: "Download & Use Everywhere",
    description: "Download your white background product image and upload directly to your online store, Amazon, eBay, or any marketplace.",
  },
]

const useCases = [
  "Ecommerce product listings",
  "Amazon and eBay listings",
  "Shopify product images",
  "Printed catalogs and brochures",
  "Digital advertising banners",
  "Social media product posts",
]

const faqs = [
  {
    q: "What exactly is the white background color?",
    a: "We use pure white (#FFFFFF) which is the standard for ecommerce platforms like Amazon, eBay, and most online marketplaces. This ensures your images meet their requirements.",
  },
  {
    q: "Can I keep the background transparent instead?",
    a: "Yes! Our background remover gives you a transparent PNG by default. If you need white specifically, use our Image to PDF tool or any image editor to add a white layer behind the transparent PNG.",
  },
  {
    q: "Does this work on photos with complex backgrounds?",
    a: "Yes, our AI handles complex, busy, and intricate backgrounds. It preserves fine details like hair, fur, transparent elements, and intricate product edges.",
  },
  {
    q: "Is this free to use?",
    a: "You can try background removal as a guest. Sign up for free credits to process more images without watermarks.",
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
    description: "Edit and enhance product photos with AI.",
  },
  {
    name: "Image to PDF",
    href: "/tools/image-to-pdf",
    description: "Convert product images to professional PDF documents.",
  },
]

export default function MakeProductPhotoWhiteBackgroundPage() {
  return (
    <ScenePageTemplate
      badge="Ecommerce Essential"
      title="White Background Product Photos"
      platformName="Ecommerce"
      heading="Make Product Photo White Background Online Free"
      description="Turn any product photo into a perfect white background image. Instant AI processing gives you professional ecommerce-ready images in seconds."
      benefits={benefits}
      steps={steps}
      useCases={useCases}
      faqs={faqs}
      relatedTools={relatedTools}
    />
  )
}
