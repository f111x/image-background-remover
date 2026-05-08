import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "AI Product Photo Editor - Edit Product Images with AI | ImageTools",
  description: "Edit and enhance product photos with AI. Use natural language to remove objects, change backgrounds, adjust lighting, and transform product images for professional results.",
  keywords: ["AI product photo editor", "product photo editing AI", "AI edit product photos", "product photo enhancement AI", "AI-powered product photo editing"],
}

const benefits = [
  "Edit product photos using natural language commands",
  "Remove unwanted objects from product photos instantly",
  "Change or replace product backgrounds with AI",
  "Adjust colors, lighting, and contrast automatically",
  "Apply professional enhancements in seconds",
  "Reference image support for consistent style",
]

const steps = [
  {
    title: "Upload Your Product Photo",
    description: "Upload your product photo and optionally add reference images to guide the AI's style. The more context you provide, the better the results.",
  },
  {
    title: "Describe What You Want",
    description: "Type your editing instructions in plain English. For example: 'Remove the distracting background' or 'Make the colors more vibrant' or 'Add a white background'.",
  },
  {
    title: "AI Edits & Download",
    description: "Our AI processes your product photo according to your instructions and delivers professional results ready for your store or listing.",
  },
]

const useCases = [
  "Remove distracting elements from product photos",
  "Change product backgrounds for different seasons",
  "Standardize lighting across product catalogs",
  "Enhance colors and contrast for better appeal",
  "Create lifestyle context around products",
  "Generate multiple product image variations",
]

const faqs = [
  {
    q: "What can I do with the AI product photo editor?",
    a: "You can remove objects, change backgrounds, adjust lighting, enhance colors, apply effects, and make virtually any edit — all by describing what you want in plain English.",
  },
  {
    q: "Can I use reference images?",
    a: "Yes, you can upload up to 9 reference images to guide the AI's style. This is useful for maintaining consistency across your product catalog.",
  },
  {
    q: "How does this compare to Photoshop?",
    a: "Unlike Photoshop, no design skills are needed. Just describe what you want in words and the AI handles the editing. It's fast, simple, and produces professional results.",
  },
  {
    q: "Is this free to use?",
    a: "You can try the AI editor as a guest. Sign up to get free credits for more processing power and higher quality output without watermarks.",
  },
]

const relatedTools = [
  {
    name: "Background Remover",
    href: "/tools/background-remover",
    description: "One-click background removal for product photos.",
  },
  {
    name: "Watermark Remover",
    href: "/tools/watermark-remover",
    description: "Remove watermarks and unwanted objects from images.",
  },
  {
    name: "Image to PDF",
    href: "/tools/image-to-pdf",
    description: "Convert product images to professional PDF catalogs.",
  },
]

export default function AIProductPhotoEditorPage() {
  return (
    <ScenePageTemplate
      badge="AI-Powered"
      title="AI Product Photo Editing"
      platformName="Product Photography"
      heading="AI Product Photo Editor"
      description="Edit and enhance product photos with AI using simple text commands. Remove objects, change backgrounds, adjust lighting, and transform your product images — no design skills needed."
      benefits={benefits}
      steps={steps}
      useCases={useCases}
      faqs={faqs}
      relatedTools={relatedTools}
    />
  )
}
