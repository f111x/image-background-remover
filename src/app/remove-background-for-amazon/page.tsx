import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Remove Background from Product Images for Amazon | ImageTools",
  description: "Create Amazon-compliant product images with instant AI background removal. Meet Amazon's white background requirement and boost your product listings with professional images.",
  alternates: { canonical: "https://imagetoolss.com/remove-background-for-amazon" },
  openGraph: {
    title: "Remove Background for Amazon — Amazon Image Requirements | ImageTools",
    description: "Meet Amazon's product image requirements with instant AI background removal. Get pure white background images that comply with Amazon's guidelines.",
    url: "https://imagetoolss.com/remove-background-for-amazon",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Background for Amazon — Amazon Image Requirements | ImageTools",
  },
  keywords: ["remove background amazon", "amazon product image", "amazon white background", "product photo editor amazon", "amazon listing image"],
}

const amazonBenefits = [
  "Meet Amazon's pure white (#FFFFFF) background requirement",
  "Create professional images that increase click-through rates",
  "Instant background removal — seconds per image",
  "Transparent PNG output for versatile use",
  "No design software needed",
  "High quality edge preservation for detailed products",
]

const amazonSteps = [
  {
    title: "Upload Your Product Photo",
    description: "Upload your product image. Works best with photos on neutral backgrounds. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Removes the Background",
    description: "Our AI detects the product and removes the background, creating a clean cutout ready for Amazon.",
  },
  {
    title: "Download & Upload to Amazon",
    description: "Download your image with a pure white background and upload directly to your Amazon listing.",
  },
]

const amazonUseCases = [
  "Main product image (hero shot)",
  "Lifestyle and contextual photos",
  "Infographic-style product images",
  "Comparison images",
  "Close-up detail shots",
  "Packaging images",
]

const amazonFaqs = [
  {
    q: "What are Amazon's image requirements?",
    a: "Amazon requires product images to have a pure white (#FFFFFF) background. The image must be at least 1000 pixels on the longest side, in RGB or RGBA format (PNG recommended).",
  },
  {
    q: "Will my image quality be preserved?",
    a: "Yes, our AI preserves edges and fine details like hair, fur, or intricate patterns. The output is high quality and suitable for Amazon's standards.",
  },
  {
    q: "Can I use this for Amazon Seller or Vendor Central?",
    a: "Yes, the images you create can be used on Amazon Seller Central, Vendor Central, or any Amazon marketplace.",
  },
  {
    q: "Is this free to use?",
    a: "You can try background removal as a guest. Sign up to get free credits for higher quality output without watermarks on your images.",
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
    description: "Enhance product photos with AI-powered editing.",
  },
  {
    name: "Image to PDF",
    href: "/tools/image-to-pdf",
    description: "Create product catalogs and spec sheets as PDF.",
  },
]

export default function AmazonBackgroundRemoverPage() {
  return (
    <ScenePageTemplate
      badge="For Amazon"
      title="Amazon Product Photos"
      platformName="Amazon"
      heading="Remove Background from Product Images for Amazon"
      description="Create professional Amazon product images that meet Amazon's strict image requirements. Instant AI background removal for listings that convert."
      benefits={amazonBenefits}
      steps={amazonSteps}
      useCases={amazonUseCases}
      faqs={amazonFaqs}
      relatedTools={relatedTools}
    />
  )
}
