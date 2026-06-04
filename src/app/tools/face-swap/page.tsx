import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { FaceSwapEditor } from "@/components/tools/face-swap/face-swap"
import { ToolMarketingSections } from "@/components/seo/tool-marketing-sections"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"

export const metadata: Metadata = {
  title: "Face Swap Online Free | ImageTools",
  description: "Swap faces in any photo with AI. Upload a source face and target photo — get realistic face swaps in seconds. Free to try, supports JPG/PNG/WEBP.",
  alternates: { canonical: "https://imagetoolss.com/tools/face-swap" },
  openGraph: {
    title: "Face Swap Online Free | ImageTools",
    description: "Swap faces in any photo with AI. Upload a source face and target photo — get realistic face swaps in seconds.",
    url: "https://imagetoolss.com/tools/face-swap",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Face Swap Online Free | ImageTools",
  },
  keywords: ["face swap", "AI face swap", "swap faces", "face replacement", "deepfake alternative"],
}

export default function FaceSwapPage() {
  return (
    <Layout>
      <ToolJsonLd tool="face-swap" />
      <h1 className="sr-only">Face Swap Online Free</h1>

      <FaceSwapEditor />

      <ToolMarketingSections
        title="AI Face Swap"
        description="Swap faces between photos with AI-powered precision. Upload a source face and a target photo — get realistic, seamless face swaps in seconds."
        features={[
          "Realistic face swapping",
          "Supports JPG, PNG, WEBP up to 10MB",
          "No signup required to try",
          "Fast processing (~26 seconds)",
          "Guest-friendly with watermarked results",
          "Perfect for creative projects",
        ]}
        useCases={[
          "Create fun face swap photos",
          "Replace faces in portraits",
          "Swap faces in group photos",
          "Edit profile pictures creatively",
          "Creative photo collages",
        ]}
        faqs={[
          {
            q: "How does the face swap work?",
            a: "Upload a source image containing the face you want to use, then upload a target photo where you want to place that face. Our AI will seamlessly swap the face onto the target.",
          },
          {
            q: "Is this tool free to use?",
            a: "Yes, you can try it as a guest. Sign up to get free credits for higher quality output without watermarks on your results.",
          },
          {
            q: "What image formats are supported?",
            a: "We support JPG, PNG, and WEBP images up to 10MB in size.",
          },
          {
            q: "Are there any restrictions?",
            a: "Only use face swap for images you own or have permission to edit. Do not use this tool to create misleading content or impersonate others.",
          },
        ]}
        relatedTools={[
          {
            name: "Background Remover",
            href: "/tools/background-remover",
            description: "Remove backgrounds from images instantly with AI.",
          },
          {
            name: "Watermark Remover",
            href: "/tools/watermark-remover",
            description: "Remove watermarks, text, or unwanted objects from images.",
          },
          {
            name: "AI Image Editor",
            href: "/tools/ai-editor",
            description: "Edit photos with natural language AI prompts.",
          },
        ]}
      />
    </Layout>
  )
}