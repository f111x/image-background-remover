import { Metadata } from "next"
import Link from "next/link"
import { Scissors, Wand2, ArrowRight, CheckCircle, Eraser, FileText, Layers, Minimize2, Crop } from "lucide-react"
import { Layout } from "@/components/layout"
import { ToolsJsonLd } from "@/components/seo/tools-json-ld"

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

const tools = [
  {
    id: "background-remover",
    name: "Background Remover",
    description: "Remove backgrounds from images instantly with AI. Get transparent backgrounds in seconds.",
    href: "/tools/background-remover",
    icon: Scissors,
    status: "live" as const,
    features: ["One-click background removal", "Supports JPG, PNG, WEBP", "Up to 10MB", "High quality output"],
  },
  {
    id: "watermark-remover",
    name: "Watermark Remover",
    description: "Remove watermarks, text, or unwanted objects from images with AI-powered inpainting.",
    href: "/tools/watermark-remover",
    icon: Eraser,
    status: "live" as const,
    features: ["Paint to remove", "AI-powered inpainting", "Supports JPG, PNG, WEBP", "Natural looking results"],
  },
  {
    id: "ai-editor",
    name: "AI Image Editor",
    description: "Edit and transform your images using natural language prompts powered by AI.",
    href: "/tools/ai-editor",
    icon: Wand2,
    status: "live" as const,
    features: ["Text-based editing", "Reference image support", "Up to 9 reference images", "Creative transformations"],
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description: "Convert your images into professional PDF documents. Free to use, no credits required.",
    href: "/tools/image-to-pdf",
    icon: FileText,
    status: "live" as const,
    features: ["Free tool", "Up to 20 images", "Customizable layout", "Multiple page sizes"],
  },
  {
    id: "merge-images",
    name: "Merge Images",
    description: "Combine multiple images into one. Grid, horizontal, or vertical layouts with adjustable spacing.",
    href: "/tools/merge-images",
    icon: Layers,
    status: "live" as const,
    features: ["Merge up to 9 images", "Grid, horizontal, vertical layouts", "Adjustable spacing", "Free — no credits needed"],
  },
  {
    id: "compress-image",
    name: "Compress Image",
    description: "Reduce image file size without losing quality. Adjust compression level from 10% to 100%.",
    href: "/tools/compress-image",
    icon: Minimize2,
    status: "live" as const,
    features: ["Quality slider 10%–100%", "JPG, PNG, WEBP output", "Real-time size preview", "Free — no watermarks"],
  },
  {
    id: "crop-image",
    name: "Crop & Split",
    description: "Split one image into 3, 6, or 9 equal slices. Download individually or as a ZIP.",
    href: "/tools/crop-image",
    icon: Crop,
    status: "live" as const,
    features: ["Split into 3, 6, or 9 slices", "Horizontal or vertical cuts", "Download individual or ZIP", "Free — PNG output"],
  },
]

export default function ToolsPage() {
  return (
    <Layout>
      <ToolsJsonLd />
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">AI Image Tools</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful AI-powered image editing tools. Upload your image and get professional results in seconds.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tool.status === "live"
                      ? "bg-purple-100 text-purple-500"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold">{tool.name}</h2>
                      {tool.status === "live" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{tool.description}</p>
                  </div>
                </div>

                <ul className="space-y-1.5 mb-6">
                  {tool.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1 text-sm font-medium text-purple-500 group-hover:text-purple-600">
                  <span>Open tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}