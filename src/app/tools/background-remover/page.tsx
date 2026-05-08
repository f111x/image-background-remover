import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { BackgroundRemoverEditor } from "@/components/tools/background-remover/editor"

export const metadata: Metadata = {
  title: "Remove Image Background Online Free | ImageTools",
  description: "Use AI to remove image backgrounds and get transparent PNGs in seconds. Upload JPG, PNG, or WEBP images and download results instantly. No signup required.",
  keywords: ["remove background", "background remover", "transparent background", "AI background removal", "remove bg"],
}

export default function BackgroundRemoverPage() {
  return (
    <Layout>
      <BackgroundRemoverEditor />
    </Layout>
  )
}
