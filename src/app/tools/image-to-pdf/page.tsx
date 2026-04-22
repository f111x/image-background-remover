import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { ImageToPDFEditor } from "@/components/tools/image-to-pdf/editor"

export const metadata: Metadata = {
  title: "Image to PDF",
  description: "Convert your images into professional PDF documents. Free to use, no credits required. Supports JPG, PNG, WEBP, GIF up to 10MB.",
}

export default function ImageToPDFPage() {
  return (
    <Layout>
      <ImageToPDFEditor />
    </Layout>
  )
}