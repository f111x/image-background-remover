import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Remove Date Stamp from Photo - Free AI Tool | ImageTools",
  description: "Remove date stamps, timestamps, and watermarks from photos instantly. Upload any photo and erase date stamps using AI-powered inpainting. Free to use, no signup required.",
  alternates: { canonical: "https://imagetoolss.com/remove-date-stamp-from-photo" },
  openGraph: {
    title: "Remove Date Stamp from Photo — Clean Old Photos | ImageTools",
    description: "Remove date stamps and timestamps from photos. Restore old photographs by removing unwanted text and stamps. AI-powered inpainting fills areas naturally.",
    url: "https://imagetoolss.com/remove-date-stamp-from-photo",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Date Stamp from Photo — Clean Old Photos | ImageTools",
  },
  keywords: ["remove date stamp from photo", "remove timestamp from photo", "erase date from image", "photo date stamp remover", "remove watermark from photo"],
}

const benefits = [
  "Remove date stamps and timestamps instantly",
  "AI-powered inpainting for natural results",
  "Also removes other text, logos, or watermarks",
  "Works on any photo — old photos, documents, screenshots",
  "Free to use, no signup required",
  "Preserves original photo quality",
]

const steps = [
  {
    title: "Upload Your Photo",
    description: "Upload any photo with a date stamp, timestamp, or watermark. Works with old photos, screenshots, scanned documents, and more. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "Paint Over the Date Stamp",
    description: "Use the brush tool to paint over the date stamp or unwanted area. Our AI will fill in the area naturally.",
  },
  {
    title: "Download Clean Photo",
    description: "Get your photo with the date stamp removed. The AI fills in the background naturally so it looks like the stamp was never there.",
  },
]

const useCases = [
  "Remove date stamps from old photos",
  "Clean up scanned documents",
  "Remove timestamps from screenshots",
  "Erase unwanted text from photos",
  "Remove logo overlays",
  "Clean up heritage or vintage photos",
]

const faqs = [
  {
    q: "Can this remove other watermarks too?",
    a: "Yes, the same tool removes watermarks, logos, text, timestamps, and any unwanted objects from photos. Just paint over what you want removed.",
  },
  {
    q: "Will it look natural after removing the date?",
    a: "Yes, our AI uses intelligent inpainting to fill the area where the date stamp was, matching the surrounding background naturally.",
  },
  {
    q: "Does this work on old or damaged photos?",
    a: "Yes! Works great on scanned old photos, vintage prints, and photos with physical stamps or writing on them.",
  },
  {
    q: "Is this free?",
    a: "Yes, date stamp removal is free to try. Sign up for free credits to process more images without watermarks.",
  },
]

const relatedTools = [
  { name: "Watermark Remover", href: "/tools/watermark-remover", description: "Remove watermarks, text, logos from photos." },
  { name: "Background Remover", href: "/tools/background-remover", description: "Remove full backgrounds from photos." },
  { name: "AI Image Editor", href: "/tools/ai-editor", description: "Edit photos with AI prompts." },
]

export default function RemoveDateStampFromPhotoPage() {
  return (
    <ScenePageTemplate
      badge="Photo Editing"
      title="Remove Date Stamps"
      platformName="Photo Editing"
      heading="Remove Date Stamp from Photo"
      description="Remove date stamps, timestamps, and watermarks from photos with AI. Erase unwanted text from any image and get clean, natural results."
      benefits={benefits}
      steps={steps}
      useCases={useCases}
      faqs={faqs}
      relatedTools={relatedTools}
    />
  )
}
