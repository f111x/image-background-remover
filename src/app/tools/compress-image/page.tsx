import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { CompressImageEditor } from "@/components/tools/compress-image/editor"
import { ToolMarketingSections } from "@/components/seo/tool-marketing-sections"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"

export const metadata: Metadata = {
  title: "Compress Image Online Free — Reduce Image Size | ImageTools",
  description: "Reduce image file size without losing quality. Adjust compression level from 10% to 100%, choose output format, and download instantly. Free to use, no signup required.",
  alternates: { canonical: "https://imagetoolss.com/tools/compress-image" },
  openGraph: {
    title: "Compress Image Online — Reduce File Size | ImageTools",
    description: "Reduce image file size without losing quality. Adjust compression from 10% to 100%, choose output format (JPG/PNG/WEBP), and download instantly. Free to use.",
    url: "https://imagetoolss.com/tools/compress-image",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress Image Online — Reduce File Size | ImageTools",
  },

  keywords: ["compress image", "image compressor", "reduce image size", "resize image", "image optimizer", "jpg compressor", "png compressor"],
}

export default function CompressImagePage() {
  return (
    <Layout>
      <ToolJsonLd tool="compress-image" />
      <h1 className="sr-only">Compress Image Online — Reduce Image File Size for Free</h1>

      <CompressImageEditor />

      <ToolMarketingSections
        title="Image Compressor"
        description="Reduce your image file size with precision quality control. Choose from JPG, PNG, or WEBP output formats and see the result before downloading."
        features={[
          "Adjustable compression quality (10%–100%)",
          "Support for JPG, PNG, and WEBP formats",
          "Real-time size estimation before compressing",
          "Side-by-side quality comparison",
          "Free to use — no credits required",
          "No watermarks · Original resolution preserved",
        ]}
        useCases={[
          "Optimize images for web",
          "Reduce file size for email attachments",
          "Compress photos before uploading",
          "Prepare images for social media",
          "Save storage space on your device",
        ]}
        faqs={[
          {
            q: "How does compression quality affect the image?",
            a: "Lower quality produces smaller files but may introduce visible artifacts. Our slider lets you find the perfect balance between file size and visual quality.",
          },
          {
            q: "Will compression reduce the image dimensions?",
            a: "No. Image dimensions (width × height) stay exactly the same. Only the file size is reduced through encoding quality adjustment.",
          },
          {
            q: "Which format should I choose?",
            a: "JPG is best for photographs, PNG for graphics with transparency, and WEBP for the best balance of quality and size in modern browsers.",
          },
          {
            q: "Is my image uploaded to your servers?",
            a: "No. All compression happens in your browser using Canvas API. Your images never leave your device.",
          },
        ]}
        relatedTools={[
          {
            name: "Merge Images",
            href: "/tools/merge-images",
            description: "Combine multiple images into one before compressing.",
          },
          {
            name: "Background Remover",
            href: "/tools/background-remover",
            description: "Remove backgrounds to reduce image complexity and size.",
          },
          {
            name: "Image to PDF",
            href: "/tools/image-to-pdf",
            description: "Convert images to PDF — smaller than individual image files.",
          },
        ]}
      />
    </Layout>
  )
}
