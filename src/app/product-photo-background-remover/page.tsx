import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Product Photo Background Remover - Free AI Tool | ImageTools",
  description: "Remove background from product photos instantly with AI. Upload your product images and get clean, transparent backgrounds perfect for ecommerce, advertising, and catalogs.",
  keywords: ["product photo background remover", "remove background from product photo", "product image background removal", "ecommerce background remover", "free product photo editor"],
}

const benefits = [
  "Remove backgrounds from any product photo instantly",
  "AI-powered detection for accurate product cutouts",
  "Works with all product types and image qualities",
  "Preserves fine details — edges, hair, transparent parts",
  "No design skills required — fully automated",
  "Free to try with no signup required",
]

const steps = [
  {
    title: "Upload Your Product Photo",
    description: "Drag and drop or click to upload your product image. Our AI works best with clearly visible products. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Removes the Background",
    description: "Our AI automatically detects your product and removes the background, delivering a clean transparent PNG in seconds.",
  },
  {
    title: "Download & Use Anywhere",
    description: "Download your transparent PNG and use it on any platform, in any design, or combine with any background you like.",
  },
]

const useCases = [
  "Ecommerce product listings",
  "Online store product galleries",
  "Advertising and banner images",
  "Print catalogs and flyers",
  "Social media posts and ads",
  "Product mockups and presentations",
]

const faqs = [
  {
    q: "What happens to the background?",
    a: "The original background is removed completely, leaving a transparent PNG. You can then place your product on any new background.",
  },
  {
    q: "Can I process multiple product photos at once?",
    a: "Yes, you can process images one at a time. For high-volume users, our API and paid plans offer more credits for faster processing.",
  },
  {
    q: "Will the edges look natural?",
    a: "Yes, our AI preserves fine details like hair strands, fur, transparent elements, and intricate product edges for natural-looking results.",
  },
  {
    q: "Is this free to use?",
    a: "You can try the background remover as a guest. Sign up to get free credits for higher quality output without watermarks on your images.",
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
    description: "Further edit and enhance your product photos with AI.",
  },
  {
    name: "Watermark Remover",
    href: "/tools/watermark-remover",
    description: "Remove unwanted objects from product photos.",
  },
]

export default function ProductPhotoBackgroundRemoverPage() {
  return (
    <ScenePageTemplate
      badge="Background Removal"
      title="Product Photo Background Remover"
      platformName="Ecommerce"
      heading="Product Photo Background Remover"
      description="Remove background from product photos instantly with AI. Get clean, transparent product images perfect for ecommerce, advertising, and any creative project."
      benefits={benefits}
      steps={steps}
      useCases={useCases}
      faqs={faqs}
      relatedTools={relatedTools}
    />
  )
}
