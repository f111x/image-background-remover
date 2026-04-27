import { Metadata } from "next"
import Link from "next/link"
import { Scissors, Wand2, ArrowRight, CheckCircle, Eraser, FileText } from "lucide-react"
import { Layout } from "@/components/layout"

export const metadata: Metadata = {
  title: "Free Online Image Tools",
  description: "Explore free online image tools including background remover, watermark remover, AI image editor, and image to PDF converter.",
  alternates: { canonical: "/tools" },
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
    name: "AI Editor",
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
]

export default function ToolsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">Free Online Image Tools</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Remove backgrounds, clean up images, edit photos with AI, and convert images to PDF with fast browser-based tools.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-4xl mx-auto px-6 py-12">
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
