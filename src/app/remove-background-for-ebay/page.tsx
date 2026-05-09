import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Remove Background from Product Images for eBay | ImageTools",
  description: "Create professional eBay product listings with instant AI background removal. Meet eBay's image requirements with transparent or white backgrounds. Free to use, no signup required.",
  alternates: { canonical: "https://imagetoolss.com/remove-background-for-ebay" },
  openGraph: {
    title: "Remove Background for eBay — Professional Listings | ImageTools",
    description: "Create professional eBay listings with perfect product images. AI removes backgrounds instantly for clean, compliant photos.",
    url: "https://imagetoolss.com/remove-background-for-ebay",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Background for eBay | ImageTools",
  },
  keywords: ["remove background ebay", "ebay product image", "ebay listing photos", "background remover for ebay", "ebay image requirements"],
}

const ebayBenefits = [
  "Meet eBay's image requirements for professional listings",
  "Create clean, consistent product gallery images",
  "Instant transparent or white backgrounds",
  "Works with any product type — electronics, apparel, collectibles",
  "No design skills needed",
  "Fast processing — seconds per image",
]

const ebaySteps = [
  {
    title: "Upload Your Product Photo",
    description: "Drag and drop or click to upload your eBay product image. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Removes the Background",
    description: "Our AI automatically detects the product and removes the background, giving you a perfect cutout in seconds.",
  },
  {
    title: "Download & List on eBay",
    description: "Download your transparent PNG and upload directly to your eBay listing. Get more views with professional photos.",
  },
]

const ebayUseCases = [
  "Electronics and gadgets",
  "Clothing and accessories",
  "Collectibles and antiques",
  "Home and garden items",
  "Sports and outdoors",
  "Toys and games",
]

const ebayFaqs = [
  {
    q: "What image format does eBay recommend?",
    a: "eBay recommends using up to 12 photos per listing with at least 800px on the longest side. PNG files with transparent backgrounds are ideal for showing products from all angles.",
  },
  {
    q: "Does eBay require white backgrounds?",
    a: "eBay doesn't strictly require white backgrounds, but clean, distraction-free product photos perform significantly better and look more professional in search results.",
  },
  {
    q: "Can I remove backgrounds from multiple images?",
    a: "Each image is processed individually. For batch processing, consider signing up for a plan with more credits.",
  },
  {
    q: "Is this free to use for eBay sellers?",
    a: "Yes, you can try the background remover as a guest. Sign up for free credits to process more images at higher quality.",
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
    description: "Further enhance your product photos with AI-powered edits.",
  },
  {
    name: "Compress Image",
    href: "/tools/compress-image",
    description: "Reduce file size while maintaining quality for faster uploads.",
  },
]

export default function EbayBackgroundRemoverPage() {
  return (
    <ScenePageTemplate
      badge="For eBay"
      title="eBay Product Photos"
      platformName="eBay"
      heading="Remove Background from Product Images for eBay"
      description="Create professional eBay listings with perfect product photos. Our AI removes backgrounds instantly, giving you clean images that meet eBay's best practices and attract more buyers."
      benefits={ebayBenefits}
      steps={ebaySteps}
      useCases={ebayUseCases}
      faqs={ebayFaqs}
      relatedTools={relatedTools}
    />
  )
}