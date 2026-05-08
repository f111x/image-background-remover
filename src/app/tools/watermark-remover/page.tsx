import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { WatermarkRemoverEditor } from "@/components/tools/watermark-remover/editor"

export const metadata: Metadata = {
  title: "Remove Watermark Online Free | ImageTools",
  description: "Remove watermarks, text, logos, or unwanted objects from your images with AI-powered inpainting. Upload JPG, PNG, or WEBP and get clean, natural results. For your own images only.",
  keywords: ["remove watermark", "watermark remover", "remove text from image", "object removal", "AI inpainting"],
}

export default function WatermarkRemoverPage() {
  return (
    <Layout>
      <WatermarkRemoverEditor />
    </Layout>
  )
}
