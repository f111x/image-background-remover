import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Make Image Background White Online Free | ImageTools",
  description: "Make any image background white instantly. Upload a photo and get a pure white background perfect for ID photos, product images, and documents. Free, no signup required.",
  keywords: ["make image background white", "white background maker", "change background to white online", "white background for photo", "free white background tool"],
}

const benefits = [
  "Add pure white (#FFFFFF) background to any image",
  "AI-powered for clean, professional results",
  "Perfect for ID photos, passports, and documents",
  "Works with any photo — portrait, product, landscape",
  "Free to use, no signup required",
  "Instant download as JPG or PNG",
]

const steps = [
  {
    title: "Upload Your Photo",
    description: "Click or drag to upload your photo. Works with portraits, ID photos, product images, or any photo. Supports JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Adds White Background",
    description: "Our AI removes the original background and replaces it with a pure white (#FFFFFF) background, suitable for official documents.",
  },
  {
    title: "Download & Print",
    description: "Download your photo with a white background. Perfect for ID cards, passports, resumes, visa applications, and official documents.",
  },
]

const useCases = [
  "ID photos and passport images",
  "Resume and CV photos",
  "Visa and immigration applications",
  "Professional profile photos",
  "Driver's license photos",
  "Official document photos",
]

const faqs = [
  {
    q: "What white background standard does this use?",
    a: "We use pure white (#FFFFFF) which meets most official requirements. For specific standards like passport photos, check your country's requirements as they vary.",
  },
  {
    q: "Will the face and features look natural?",
    a: "Yes, our AI preserves natural skin tones, facial features, and details. The white background is applied cleanly around the subject.",
  },
  {
    q: "Can I use this for passport photos?",
    a: "This tool creates white backgrounds. For passport photos, also ensure the photo meets size, lighting, and face positioning requirements for your specific country.",
  },
  {
    q: "Is this free?",
    a: "Yes, white background creation is free to try. Sign up for free credits to process more images without watermarks.",
  },
]

const relatedTools = [
  { name: "Background Remover", href: "/tools/background-remover", description: "Remove backgrounds from any image." },
  { name: "Make Product Photo White Background", href: "/make-product-photo-white-background", description: "White background for product photos." },
  { name: "AI Image Editor", href: "/tools/ai-editor", description: "Edit photos with AI." },
]

export default function MakeImageBackgroundWhitePage() {
  return (
    <ScenePageTemplate
      badge="Documents & IDs"
      title="White Background Maker"
      platformName="Documents"
      heading="Make Image Background White Online Free"
      description="Add a pure white background to any photo instantly. Perfect for ID photos, passport applications, resumes, and official documents."
      benefits={benefits}
      steps={steps}
      useCases={useCases}
      faqs={faqs}
      relatedTools={relatedTools}
    />
  )
}
