"use client"

import Link from "next/link"
import { ArrowRight, Upload, Wand2, Download, Scissors, Eraser, FileText, Layers, Minimize2, Crop } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

const TOOL_LINKS = [
  { href: "/tools/background-remover", labelKey: "tool_background_remover", icon: Scissors, color: "from-purple-500 to-pink-500", descKey: "tool_background_remover_desc" },
  { href: "/tools/watermark-remover", labelKey: "tool_watermark_remover", icon: Eraser, color: "from-blue-500 to-cyan-500", descKey: "tool_watermark_remover_desc" },
  { href: "/tools/ai-editor", labelKey: "tool_ai_editor", icon: Wand2, color: "from-orange-500 to-red-500", descKey: "tool_ai_editor_desc" },
  { href: "/tools/image-to-pdf", labelKey: "tool_image_to_pdf", icon: FileText, color: "from-green-500 to-emerald-500", descKey: "tool_image_to_pdf_desc" },
  { href: "/tools/merge-images", labelKey: "tool_merge_images", icon: Layers, color: "from-indigo-500 to-purple-500", descKey: "tool_merge_images_desc" },
  { href: "/tools/compress-image", labelKey: "tool_compress_image", icon: Minimize2, color: "from-yellow-500 to-orange-500", descKey: "tool_compress_image_desc" },
  { href: "/tools/crop-image", labelKey: "tool_crop_image", icon: Crop, color: "from-teal-500 to-cyan-500", descKey: "tool_crop_image_desc" },
]

export function Showcase() {
  const { t } = useLanguage()

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("showcase_title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("showcase_subtitle")}
          </p>
        </div>

        {/* How it works - 3 steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Upload, step: "1", title: t("showcase_step_upload_title"), desc: t("showcase_step_upload_desc") },
            { icon: Wand2, step: "2", title: t("showcase_step_ai_title"), desc: t("showcase_step_ai_desc") },
            { icon: Download, step: "3", title: t("showcase_step_download_title"), desc: t("showcase_step_download_desc") },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 mb-4">
                <item.icon className="w-9 h-9 text-purple-600" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">{item.step}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Tool grid */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-2">{t("showcase_all_tools_title")}</h3>
          <p className="text-muted-foreground text-sm">{t("showcase_rules_line")}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {TOOL_LINKS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <div className={`bg-gradient-to-br ${tool.color} rounded-xl p-4 text-white h-full flex flex-col items-center gap-2 hover:scale-105 transition-transform shadow-md hover:shadow-lg`}>
                <tool.icon className="w-6 h-6" />
                <span className="text-sm font-semibold text-center">{t(tool.labelKey)}</span>
                <span className="text-[11px] text-white/80 text-center hidden sm:block">{t(tool.descKey)}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/tools/background-remover" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
            {t("showcase_try_bg_free")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
