import { Metadata } from "next"
import { ToolsClient } from "./tools-client"

export const metadata: Metadata = {
  title: "Free Online AI Image Tools — Background Removal, Watermark Clean & More",
  description: "Browse all free AI-powered image tools online. Remove backgrounds, clean watermarks, edit photos with text prompts, convert images to PDF, merge, compress, and crop. No signup required.",
  alternates: { canonical: "https://imagetoolss.com/tools" },
  openGraph: {
    title: "Free AI Image Tools — Background Remover, Watermark Remover, AI Editor | ImageTools",
    description: "Free AI image tools: background remover, watermark remover, AI editor, image to PDF, merge images, compress image, and crop/split. All free, no signup required.",
    url: "https://imagetoolss.com/tools",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Image Tools — ImageTools",
  },
}

export default function ToolsPage() {
  return <ToolsClient />
}
