import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Make Image Background Transparent Online Free | ImageTools",
  description: "Make any image background transparent online free. Upload JPG, PNG, or WEBP and get transparent backgrounds in seconds. No signup required. AI-powered instant results.",
  keywords: ["make image background transparent", "transparent background maker", "remove image background online", "free transparent background", "transparent PNG maker"],
}

const benefits = [
  "Make any image background transparent instantly",
  "AI-powered detection for accurate cutouts",
  "Works with any image — photos, graphics, illustrations",
  "Preserves fine details like hair and transparent elements",
  "Free to use, no signup required",
  "Download as transparent PNG",
]

const steps = [
  {
    title: "Upload Your Image",
    description: "Click or drag to upload any image. Our AI works with photos, graphics, and illustrations on any background. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Makes Background Transparent",
    description: "Our AI detects the subject and removes the background, creating a clean transparent PNG.",
  },
  {
    title: "Download Transparent Image",
    description: "Get your image with a transparent background. Use it in designs, presentations, websites, or layer it over any new background.",
  },
]

const useCases = [
  "Layer images over new backgrounds",
  "Create marketing graphics and banners",
  "Product photo composites",
  "Social media content creation",
  "Website and blog graphics",
  "Presentation materials",
]

const faqs = [
  {
    q: "What's the difference between transparent and white background?",
    a: "A transparent background means no background at all — the image can be placed over any color or image. White background is solid white (#FFFFFF). Both have their uses depending on your project.",
  },
  {
    q: "Can I use this for photos with complex backgrounds?",
    a: "Yes, our AI handles complex and busy backgrounds. It preserves fine details like hair, fur, transparent elements, and intricate edges.",
  },
  {
    q: "What file format is the output?",
    a: "The output is a transparent PNG, which supports transparency and works in all major image editors and design tools.",
  },
  {
    q: "Is this really free?",
    a: "Yes, transparent background creation is free to try. Sign up for free credits to process more images without watermarks.",
  },
]

const relatedTools = [
  { name: "Background Remover", href: "/tools/background-remover", description: "Remove backgrounds from any image." },
  { name: "Make Product Photo White Background", href: "/make-product-photo-white-background", description: "Add white background to product photos." },
  { name: "AI Image Editor", href: "/tools/ai-editor", description: "Edit images with AI prompts." },
]

export default function MakeImageBackgroundTransparentPage() {
  return (
    <ScenePageTemplate
      badge="Most Popular"
      title="Transparent Background Maker"
      platformName="Image Editing"
      heading="Make Image Background Transparent Online Free"
      description="Make any image background transparent in seconds. Upload your photo and download a transparent PNG — no signup required. AI-powered instant results."
      benefits={benefits}
      steps={steps}
      useCases={useCases}
      faqs={faqs}
      relatedTools={relatedTools}
    />
  )
}
