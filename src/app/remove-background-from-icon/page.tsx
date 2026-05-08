import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Remove Background from Icon - Free AI Tool | ImageTools",
  description: "Remove background from icons instantly with AI. Upload PNG or JPG icons and get clean transparent backgrounds. Free online tool, no signup required.",
  keywords: ["remove background from icon", "icon background remover", "transparent icon maker", "PNG icon background removal", "free icon editor"],
}

const benefits = [
  "One-click background removal from any icon",
  "Preserves fine details and sharp edges",
  "Supports PNG, JPG, WEBP up to 10MB",
  "Free to use, no signup required",
  "Instant download as transparent PNG",
  "Batch ready for multiple icons",
]

const steps = [
  {
    title: "Upload Your Icon",
    description: "Click or drag to upload your icon image. Works best with PNG icons on any background. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Removes the Background",
    description: "Our AI detects the icon shape and removes the background, preserving clean edges and fine details.",
  },
  {
    title: "Download Transparent Icon",
    description: "Get your icon with a transparent background. Download as PNG and use anywhere — websites, apps, presentations.",
  },
]

const useCases = [
  "Website favicons and app icons",
  "UI/UX design elements",
  "Presentation graphics",
  "Social media graphics",
  "Print materials",
  "Mobile app assets",
]

const faqs = [
  {
    q: "What file formats does this work with?",
    a: "You can upload PNG, JPG, and WEBP icons. PNG works best as it supports transparency in the output.",
  },
  {
    q: "Will the icon edges stay sharp?",
    a: "Yes, our AI preserves fine details and sharp edges. It's optimized for icons, logos, and other graphics with clean lines.",
  },
  {
    q: "Can I use this for app icons?",
    a: "Yes! Remove backgrounds from app icons for iOS, Android, or any platform. The transparent PNG output works for all app icon formats.",
  },
  {
    q: "Is this free?",
    a: "Yes, background removal is free to try. Sign up for free credits to process more images without watermarks.",
  },
]

const relatedTools = [
  { name: "Background Remover", href: "/tools/background-remover", description: "Remove backgrounds from any image." },
  { name: "AI Image Editor", href: "/tools/ai-editor", description: "Edit icons and graphics with AI prompts." },
  { name: "Image to PDF", href: "/tools/image-to-pdf", description: "Convert icons to PDF for presentations." },
]

export default function RemoveBackgroundFromIconPage() {
  return (
    <ScenePageTemplate
      badge="For Designers"
      title="Icon Background Remover"
      platformName="Icon Design"
      heading="Remove Background from Icon"
      description="Remove background from icons instantly with AI. Get clean transparent icons perfect for websites, apps, presentations, and any creative project."
      benefits={benefits}
      steps={steps}
      useCases={useCases}
      faqs={faqs}
      relatedTools={relatedTools}
    />
  )
}
