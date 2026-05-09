import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { ImageToPDFEditor } from "@/components/tools/image-to-pdf/editor"
import { ToolMarketingSections } from "@/components/seo/tool-marketing-sections"

export const metadata: Metadata = {
  title: "Image to PDF Converter Online Free | ImageTools",
  description: "Convert JPG, PNG, WEBP, or GIF images into professional PDF documents online. Merge multiple images into one PDF, customize page size, and download instantly. Free to use, no signup required.",
  alternates: { canonical: "https://imagetoolss.com/tools/image-to-pdf" },
  openGraph: {
    title: "Image to PDF Converter Online Free | ImageTools",
    description: "",
    url: "https://imagetoolss.com/tools/image-to-pdf",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to PDF Converter Online Free | ImageTools",
  },

}

export default function ImageToPDFPage() {
  return (
    <Layout>
      <h1 className="sr-only">Image to PDF Converter Online Free</h1>

      <ImageToPDFEditor />

      <ToolMarketingSections
        title="Image to PDF"
        description="Convert your images into professional PDF documents. Merge multiple images, choose page sizes, and download instantly — all in your browser."
        features={[
          "Free to use, no credits required",
          "Merge up to 20 images into one PDF",
          "Multiple page size options",
          "Supports JPG, PNG, WEBP, GIF",
          "Customizable layout and orientation",
          "Processed locally — your files stay private",
        ]}
        useCases={[
          "Convert photos to PDF documents",
          "Merge scanned documents",
          "Create photo albums",
          "Combine screenshots",
          "Archive images as PDF",
        ]}
        faqs={[
          {
            q: "Is this tool really free?",
            a: "Yes, image to PDF conversion is completely free to use. No signup or credits required.",
          },
          {
            q: "How many images can I convert at once?",
            a: "You can merge up to 20 images into a single PDF document.",
          },
          {
            q: "What page sizes are available?",
            a: "You can choose from common sizes including A4, Letter, and custom dimensions.",
          },
          {
            q: "Are my images stored on your servers?",
            a: "No. All processing happens in your browser. Your images are never uploaded to our servers.",
          },
        ]}
        relatedTools={[
          {
            name: "Background Remover",
            href: "/tools/background-remover",
            description: "Remove backgrounds from images before converting to PDF.",
          },
          {
            name: "Watermark Remover",
            href: "/tools/watermark-remover",
            description: "Clean up images before adding them to a PDF.",
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
