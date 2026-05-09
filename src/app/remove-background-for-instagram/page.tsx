import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Remove Background from Instagram Photos & Reels | ImageTools",
  description: "Make Instagram photos stand out with instant background removal. Create transparent PNG overlays, product cutouts, and professional posts. Perfect for Instagram posts, Stories, and Reels.",
  alternates: { canonical: "https://imagetoolss.com/remove-background-for-instagram" },
  openGraph: {
    title: "Remove Background for Instagram — Stand Out Posts | ImageTools",
    description: "Create eye-catching Instagram posts with transparent backgrounds. AI removes backgrounds instantly for professional-looking content that gets more engagement.",
    url: "https://imagetoolss.com/remove-background-for-instagram",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Background for Instagram | ImageTools",
  },
  keywords: ["remove background instagram", "instagram photo editor", "transparent png instagram", "instagram story stickers", "remove background for social media"],
}

const igBenefits = [
  "Create eye-catching posts with transparent backgrounds",
  "Design custom Instagram Story stickers",
  "Make product photos pop on the feed",
  "Perfect for Reels thumbnails and cover images",
  "Works with any photo — portraits, products, art",
  "Free to use, no Instagram account required",
]

const igSteps = [
  {
    title: "Upload Your Photo",
    description: "Choose any photo from your gallery. Supports JPG, PNG, WEBP up to 10MB. Works best with product shots or portraits.",
  },
  {
    title: "AI Removes the Background",
    description: "Our AI detects the subject and removes the background in seconds, giving you a clean cutout on a transparent layer.",
  },
  {
    title: "Download & Post to Instagram",
    description: "Download as transparent PNG and upload directly to your Instagram post, Story, or use as a custom sticker. Get more engagement with professional visuals.",
  },
]

const igUseCases = [
  "Product showcase posts",
  "Custom Story stickers and overlays",
  "Reels cover images",
  "Before/after comparisons",
  "Fashion and apparel posts",
  "Food and lifestyle content",
]

const igFaqs = [
  {
    q: "What image format works best for Instagram?",
    a: "Instagram supports JPG and PNG. A transparent PNG (800x800px minimum recommended) gives you the most flexibility for designing posts and Stories.",
  },
  {
    q: "Can I use this for Instagram Reels thumbnails?",
    a: "Absolutely! Remove the background from any image to create clean, professional thumbnails that stand out in the Reels feed.",
  },
  {
    q: "Does this work on mobile?",
    a: "Yes. ImageTools works on any device — desktop, tablet, or phone. Open the site in your mobile browser and upload directly from your photo gallery.",
  },
  {
    q: "Is this free to use?",
    a: "Yes, you can try background removal for free as a guest. Sign up for more credits and higher quality output without watermarks.",
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
    description: "Enhance your Instagram posts with AI-powered edits and transformations.",
  },
  {
    name: "Compress Image",
    href: "/tools/compress-image",
    description: "Reduce file size for faster uploads without losing quality.",
  },
]

export default function InstagramBackgroundRemoverPage() {
  return (
    <ScenePageTemplate
      badge="For Instagram"
      title="Instagram Posts & Stories"
      platformName="Instagram"
      heading="Remove Background from Instagram Photos"
      description="Create stunning Instagram posts that stop the scroll. Remove backgrounds from any photo to make transparent overlays, product cutouts, and eye-catching visuals for posts, Stories, and Reels."
      benefits={igBenefits}
      steps={igSteps}
      useCases={igUseCases}
      faqs={igFaqs}
      relatedTools={relatedTools}
    />
  )
}