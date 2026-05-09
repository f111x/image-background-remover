import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { BackgroundRemoverEditor } from "@/components/tools/background-remover/editor"
import { ToolMarketingSections } from "@/components/seo/tool-marketing-sections"

export const metadata: Metadata = {
  title: "Remove Image Background Online Free | ImageTools",
  description: "Use AI to remove image backgrounds and get transparent PNGs in seconds. Upload JPG, PNG, or WEBP images and download results instantly. No signup required.",
  alternates: { canonical: "https://imagetoolss.com/tools/background-remover" },
  openGraph: {
    title: "Remove Image Background Online Free | ImageTools",
    description: "",
    url: "https://imagetoolss.com/tools/background-remover",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Image Background Online Free | ImageTools",
  },

  keywords: ["remove background", "background remover", "transparent background", "AI background removal", "remove bg"],
}

export default function BackgroundRemoverPage() {
  return (
    <Layout>
      {/* Page-level H1 */}
      <h1 className="sr-only">Remove Image Background Online Free</h1>

      <BackgroundRemoverEditor />

      <ToolMarketingSections
        title="Background Remover"
        description="Remove backgrounds from any image instantly with AI. Get transparent backgrounds perfect for product photos, avatars, logos, and social media content."
        features={[
          "One-click AI background removal",
          "Supports JPG, PNG, WEBP up to 10MB",
          "Transparent PNG output",
          "No signup required to try",
          "High quality edge preservation",
          "Batch processing ready",
        ]}
        useCases={[
          "Ecommerce product photos",
          "Profile pictures & avatars",
          "Logos & brand assets",
          "Social media graphics",
          "Presentations & documents",
        ]}
        faqs={[
          {
            q: "What image formats are supported?",
            a: "We support JPG, PNG, and WEBP images up to 10MB in size.",
          },
          {
            q: "Is my image data stored on your servers?",
            a: "No. Your images are processed in memory and never stored on our servers. The result is delivered directly to you.",
          },
          {
            q: "Do I need to sign up to use this tool?",
            a: "No. You can try the background remover as a guest. Sign up to get free credits for higher quality output without watermarks.",
          },
          {
            q: "How are credits calculated?",
            a: "One credit is consumed per image processed. Credits are deducted after successful processing.",
          },
        ]}
        relatedTools={[
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
          {
            name: "Image to PDF",
            href: "/tools/image-to-pdf",
            description: "Convert your images into professional PDF documents.",
          },
        ]}
      />
    </Layout>
  )
}
