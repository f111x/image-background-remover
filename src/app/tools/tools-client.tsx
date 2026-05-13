"use client"

import Link from "next/link"
import { Scissors, Wand2, ArrowRight, CheckCircle, Eraser, FileText, Layers, Minimize2, Crop } from "lucide-react"
import { Layout } from "@/components/layout"
import { ConversionProof } from "@/components/conversion-proof"
import { ToolsJsonLd } from "@/components/seo/tools-json-ld"
import { useLanguage } from "@/lib/i18n"

const tools = [
  {
    id: "background-remover",
    nameKey: "tool_background_remover",
    descriptionKey: "tools_bg_desc_long",
    href: "/tools/background-remover",
    icon: Scissors,
    features: ["tools_bg_feature_1", "tools_bg_feature_2", "tools_bg_feature_3", "tools_bg_feature_4"],
  },
  {
    id: "watermark-remover",
    nameKey: "tool_watermark_remover",
    descriptionKey: "tools_watermark_desc_long",
    href: "/tools/watermark-remover",
    icon: Eraser,
    features: ["tools_watermark_feature_1", "tools_watermark_feature_2", "tools_watermark_feature_3", "tools_watermark_feature_4"],
  },
  {
    id: "ai-editor",
    nameKey: "tool_ai_editor",
    descriptionKey: "tools_ai_desc_long",
    href: "/tools/ai-editor",
    icon: Wand2,
    features: ["tools_ai_feature_1", "tools_ai_feature_2", "tools_ai_feature_3", "tools_ai_feature_4"],
  },
  {
    id: "image-to-pdf",
    nameKey: "tool_image_to_pdf",
    descriptionKey: "tools_pdf_desc_long",
    href: "/tools/image-to-pdf",
    icon: FileText,
    features: ["tools_pdf_feature_1", "tools_pdf_feature_2", "tools_pdf_feature_3", "tools_pdf_feature_4"],
  },
  {
    id: "merge-images",
    nameKey: "tool_merge_images",
    descriptionKey: "tools_merge_desc_long",
    href: "/tools/merge-images",
    icon: Layers,
    features: ["tools_merge_feature_1", "tools_merge_feature_2", "tools_merge_feature_3", "tools_merge_feature_4"],
  },
  {
    id: "compress-image",
    nameKey: "tool_compress_image",
    descriptionKey: "tools_compress_desc_long",
    href: "/tools/compress-image",
    icon: Minimize2,
    features: ["tools_compress_feature_1", "tools_compress_feature_2", "tools_compress_feature_3", "tools_compress_feature_4"],
  },
  {
    id: "crop-image",
    nameKey: "tool_crop_image",
    descriptionKey: "tools_crop_desc_long",
    href: "/tools/crop-image",
    icon: Crop,
    features: ["tools_crop_feature_1", "tools_crop_feature_2", "tools_crop_feature_3", "tools_crop_feature_4"],
  },
]

export function ToolsClient() {
  const { t } = useLanguage()

  return (
    <Layout>
      <ToolsJsonLd />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">{t("tools_page_title")}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("tools_page_subtitle")}
            </p>
          </div>
        </div>

        <ConversionProof />

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-500">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold">{t(tool.nameKey)}</h2>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        {t("tools_status_live")}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">{t(tool.descriptionKey)}</p>
                  </div>
                </div>

                <ul className="space-y-1.5 mb-6">
                  {tool.features.map((featureKey) => (
                    <li key={featureKey} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {t(featureKey)}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1 text-sm font-medium text-purple-500 group-hover:text-purple-600">
                  <span>{t("tools_open_tool")}</span>
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
