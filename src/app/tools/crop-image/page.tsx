import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { CropImageEditor } from "@/components/tools/crop-image/editor"
import { ToolMarketingSections } from "@/components/seo/tool-marketing-sections"

export const metadata: Metadata = {
  title: "Crop & Split Image Online Free — Divide Images into Multiple Slices | ImageTools",
  description: "Split one image into 3, 6, or 9 equal slices. Choose horizontal or vertical cuts and download all slices as a ZIP. Free to use, no signup required.",
  alternates: { canonical: "https://imagetoolss.com/tools/crop-image" },
  openGraph: {
    title: "Crop & Split Image Online Free | ImageTools",
    description: "",
    url: "https://imagetoolss.com/tools/crop-image",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop & Split Image Online Free | ImageTools",
  },

  keywords: ["crop image", "split image", "image slicer", "divide image", "image cropper", "slice image", "image splitter"],
}

export default function CropImagePage() {
  return (
    <Layout>
      <h1 className="sr-only">Crop & Split Image Online — Divide Images into Multiple Equal Slices for Free</h1>

      <CropImageEditor />

      <ToolMarketingSections
        title="Crop & Split Image"
        description="Divide a single image into multiple equal slices in seconds. Perfect for social media grids, design layouts, or splitting scanned documents."
        features={[
          "Split into 3, 6, or 9 equal slices",
          "Horizontal or vertical cut direction",
          "Visual slice preview before downloading",
          "Download individual slices or all as ZIP",
          "Free to use — no credits required",
          "No watermarks · PNG output",
        ]}
        useCases={[
          "Create Instagram / Twitter grid posts",
          "Split scanned documents into pages",
          "Divide panoramic photos into strips",
          "Prepare images for carousel posts",
          "Split design mockups into sections",
        ]}
        faqs={[
          {
            q: "How does the slicing work?",
            a: "Your image is divided equally based on the slice count and direction. For example, 9 horizontal slices creates 9 equal horizontal strips stacked top to bottom.",
          },
          {
            q: "What is the output format?",
            a: "Each slice is exported as a high-quality PNG file, preserving the original resolution of that slice.",
          },
          {
            q: "Can I download all slices at once?",
            a: "Yes. Click 'Download All as ZIP' to get all slices bundled into a single ZIP file.",
          },
          {
            q: "Are my images uploaded to your servers?",
            a: "No. All cropping and slicing happens in your browser using Canvas API. Your images never leave your device.",
          },
        ]}
        relatedTools={[
          {
            name: "Merge Images",
            href: "/tools/merge-images",
            description: "Merge slices back together or combine multiple images.",
          },
          {
            name: "Compress Image",
            href: "/tools/compress-image",
            description: "Reduce the file size of sliced images before sharing.",
          },
          {
            name: "Background Remover",
            href: "/tools/background-remover",
            description: "Remove backgrounds from images before splitting.",
          },
        ]}
      />
    </Layout>
  )
}
