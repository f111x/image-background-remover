import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { WatermarkRemoverEditor } from "@/components/tools/watermark-remover/editor"
import { ToolMarketingSections } from "@/components/seo/tool-marketing-sections"

export const metadata: Metadata = {
  title: "Remove Watermark Online Free | ImageTools",
  description: "Remove watermarks, text, logos, or unwanted objects from your images with AI-powered inpainting. Upload JPG, PNG, or WEBP and get clean, natural results. For your own images only.",
  alternates: { canonical: "https://imagetoolss.com/tools/watermark-remover" },
  openGraph: {
    title: "Remove Watermark Online Free | ImageTools",
    description: "",
    url: "https://imagetoolss.com/tools/watermark-remover",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Watermark Online Free | ImageTools",
  },

  keywords: ["remove watermark", "watermark remover", "remove text from image", "object removal", "AI inpainting"],
}

export default function WatermarkRemoverPage() {
  return (
    <Layout>
      <h1 className="sr-only">Remove Watermark Online Free</h1>

      <WatermarkRemoverEditor />

      <ToolMarketingSections
        title="Watermark Remover"
        description="Remove watermarks, text, logos, date stamps, or unwanted objects from your photos with AI-powered inpainting. Get clean, natural-looking results in seconds."
        features={[
          "Paint to remove any object",
          "AI-powered natural inpainting",
          "Supports JPG, PNG, WEBP up to 10MB",
          "Natural looking results",
          "No signup required to try",
          "Perfect for cleaning own photos",
        ]}
        useCases={[
          "Remove date stamps from photos",
          "Clean up old photo prints",
          "Remove logos or text overlays",
          "Erase unwanted objects",
          "Remove pen marks or scratches",
        ]}
        faqs={[
          {
            q: "What can I remove with this tool?",
            a: "You can remove watermarks, text, logos, date stamps, unwanted objects, pen marks, scratches, and other imperfections from your photos.",
          },
          {
            q: "Is this tool free to use?",
            a: "Yes, you can try it as a guest. Sign up to get free credits for higher quality output without watermarks on your results.",
          },
          {
            q: "Are there any restrictions on what I can remove?",
            a: "Only remove content from images you own or have permission to edit. Do not use this tool to remove copyright watermarks,他人版权标识, or platform watermarks from images you don't own.",
          },
          {
            q: "Is my image data secure?",
            a: "Yes. Your images are processed in memory and never stored on our servers.",
          },
        ]}
        relatedTools={[
          {
            name: "Background Remover",
            href: "/tools/background-remover",
            description: "Remove backgrounds from images instantly with AI.",
          },
          {
            name: "AI Image Editor",
            href: "/tools/ai-editor",
            description: "Edit photos with natural language AI prompts.",
          },
          {
            name: "Image to PDF",
            href: "/tools/image-to-pdf",
            description: "Convert images into professional PDF documents.",
          },
        ]}
      />
    </Layout>
  )
}
