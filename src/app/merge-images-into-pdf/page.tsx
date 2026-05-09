import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Merge Images into PDF - Free Online Tool | ImageTools",
  description: "Merge multiple images into one PDF document online free. Upload JPG, PNG, WEBP, or GIF images and combine them into a single PDF. No signup required.",
  alternates: { canonical: "https://imagetoolss.com/merge-images-into-pdf" },
  openGraph: {
    title: "Merge Images into PDF — Combine & Convert | ImageTools",
    description: "",
    url: "https://imagetoolss.com/merge-images-into-pdf",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge Images into PDF — Combine & Convert | ImageTools",
  },
  keywords: ["merge images into pdf", "combine images into pdf", "multiple images to pdf", "join images pdf", "images to pdf converter free"],
}

const benefits = [
  "Merge up to 20 images into one PDF",
  "Free to use, no credits required",
  "Supports JPG, PNG, WEBP, GIF formats",
  "Customizable page sizes — A4, Letter, and more",
  "Adjustable layout and orientation",
  "All processing happens in your browser",
]

const steps = [
  {
    title: "Upload Your Images",
    description: "Select multiple images to merge into one PDF. Drag and drop to reorder them. Supports JPG, PNG, WEBP, GIF up to 10MB each.",
  },
  {
    title: "Choose Layout Options",
    description: "Select your preferred page size (A4, Letter, etc.), orientation (portrait or landscape), and layout preferences.",
  },
  {
    title: "Download Your PDF",
    description: "Get your merged PDF instantly. All images are combined into a single professional document ready to share or print.",
  },
]

const useCases = [
  "Combine scanned documents into one PDF",
  "Create photo albums and portfolios",
  "Merge screenshots for documentation",
  "Combine design drafts and mockups",
  "Archive multiple images as PDF",
  "Create presentation materials",
]

const faqs = [
  {
    q: "How many images can I merge into one PDF?",
    a: "You can merge up to 20 images into a single PDF document. Each image becomes one page in the PDF.",
  },
  {
    q: "What page sizes are available?",
    a: "Common sizes include A4, Letter, Legal, and custom dimensions. You can also choose between portrait and landscape orientation.",
  },
  {
    q: "Will my images be uploaded to your servers?",
    a: "No, all processing happens locally in your browser. Your images are never uploaded to our servers, keeping them completely private.",
  },
  {
    q: "Is this really free?",
    a: "Yes, merging images into PDF is completely free to use. No signup or credits required.",
  },
]

const relatedTools = [
  { name: "Image to PDF", href: "/tools/image-to-pdf", description: "Convert images to PDF." },
  { name: "Background Remover", href: "/tools/background-remover", description: "Remove backgrounds before adding to PDF." },
  { name: "Watermark Remover", href: "/tools/watermark-remover", description: "Clean up images before creating PDF." },
]

export default function MergeImagesIntoPdfPage() {
  return (
    <ScenePageTemplate
      badge="Free Tool"
      title="Merge Images to PDF"
      platformName="PDF Tools"
      heading="Merge Images into PDF"
      description="Combine multiple images into one PDF document instantly. Upload your JPG, PNG, or GIF images and download a merged PDF — free, no signup required."
      benefits={benefits}
      steps={steps}
      useCases={useCases}
      faqs={faqs}
      relatedTools={relatedTools}
    />
  )
}
