import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { MergeImagesEditor } from "@/components/tools/merge-images/editor"
import { ToolMarketingSections } from "@/components/seo/tool-marketing-sections"

export const metadata: Metadata = {
  title: "Merge Images Online Free — Combine Multiple Photos | ImageTools",
  description: "Merge up to 9 images into one photo instantly. Supports grid, horizontal, and vertical layouts. Free to use, no signup required, no watermarks.",
  keywords: ["merge images", "combine images", "image joiner", "merge photos", "photo grid maker", "combine pictures"],
}

export default function MergeImagesPage() {
  return (
    <Layout>
      <h1 className="sr-only">Merge Images Online — Combine Multiple Photos for Free</h1>

      <MergeImagesEditor />

      <ToolMarketingSections
        title="Merge Images"
        description="Combine multiple photos into one image in seconds. Choose from grid, horizontal, or vertical layouts and download the result as a high-quality PNG."
        features={[
          "Merge up to 9 images at once",
          "Grid, horizontal, and vertical layouts",
          "Adjustable spacing between images",
          "Customizable background color",
          "Free to use — no credits required",
          "No watermarks · PNG output",
        ]}
        useCases={[
          "Create photo collages",
          "Combine screenshots",
          "Make comparison grids",
          "Join scanned pages",
          "Build visual stories",
        ]}
        faqs={[
          {
            q: "How many images can I merge at once?",
            a: "You can merge between 2 and 9 images in a single operation.",
          },
          {
            q: "What layouts are available?",
            a: "Three layouts are supported: grid (auto-fit like 2×2, 3×3), horizontal (all in one row), and vertical (all in one column).",
          },
          {
            q: "Is this really free?",
            a: "Yes, image merging is completely free. No login, no credits, no watermarks.",
          },
          {
            q: "What format is the output?",
            a: "The merged result is downloaded as a high-quality PNG file.",
          },
          {
            q: "Are my images uploaded to your servers?",
            a: "No. All merging happens in your browser using Canvas API. Your images never leave your device.",
          },
        ]}
        relatedTools={[
          {
            name: "Image to PDF",
            href: "/tools/image-to-pdf",
            description: "Convert merged images into a professional PDF document.",
          },
          {
            name: "Background Remover",
            href: "/tools/background-remover",
            description: "Remove backgrounds before merging images.",
          },
          {
            name: "Compress Image",
            href: "/tools/compress-image",
            description: "Reduce image file size without losing quality.",
          },
        ]}
      />
    </Layout>
  )
}
