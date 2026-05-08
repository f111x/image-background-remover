import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { ImageToPDFEditor } from "@/components/tools/image-to-pdf/editor"

export const metadata: Metadata = {
  title: "Image to PDF Converter Online Free | ImageTools",
  description: "Convert JPG, PNG, WEBP, or GIF images into professional PDF documents online. Merge multiple images into one PDF, customize page size, and download instantly. Free to use, no signup required.",
}

export default function ImageToPDFPage() {
  return (
    <Layout>
      <ImageToPDFEditor />
    </Layout>
  )
}