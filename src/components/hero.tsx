"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, Scissors, Eraser, Wand2, FileText, Layers, Minimize2, Crop, Zap, Globe, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

const TOOLS = [
  { href: "/tools/background-remover", label: "Background Remover", icon: Scissors, color: "from-purple-500 to-pink-500", badge: "Most Popular" },
  { href: "/tools/watermark-remover", label: "Watermark Remover", icon: Eraser, color: "from-blue-500 to-cyan-500", badge: null },
  { href: "/tools/ai-editor", label: "AI Image Editor", icon: Wand2, color: "from-orange-500 to-red-500", badge: null },
  { href: "/tools/image-to-pdf", label: "Image to PDF", icon: FileText, color: "from-green-500 to-emerald-500", badge: null },
  { href: "/tools/merge-images", label: "Merge Images", icon: Layers, color: "from-indigo-500 to-purple-500", badge: "New" },
  { href: "/tools/compress-image", label: "Compress Image", icon: Minimize2, color: "from-yellow-500 to-orange-500", badge: "New" },
  { href: "/tools/crop-image", label: "Crop & Split", icon: Crop, color: "from-pink-500 to-rose-500", badge: "New" },
]

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative pt-24 pb-16 px-4 overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-6xl text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          {t("hero_badge")}
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            {t("hero_title")}
          </span>
          <span className="block text-3xl md:text-5xl font-bold text-foreground mt-2">
            {t("hero_title2")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
          {t("hero_subtitle")}
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link href="/tools/background-remover">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Upload className="w-5 h-5 mr-2" />
              {t("hero_button")}
            </Button>
          </Link>
          <Link href="/tools">
            <Button
              size="lg"
              variant="outline"
              className="px-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View All Tools <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <div className={`relative bg-gradient-to-br ${tool.color} rounded-xl p-3 text-white h-full flex flex-col items-center justify-center gap-1.5 hover:scale-105 transition-transform shadow-md hover:shadow-lg`}>
                {tool.badge && (
                  <span className="absolute -top-2 -right-2 text-[10px] bg-white text-gray-900 font-bold px-1.5 py-0.5 rounded-full shadow">
                    {tool.badge}
                  </span>
                )}
                <tool.icon className="w-5 h-5" />
                <span className="text-[11px] font-medium text-center leading-tight">{tool.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>{t("feat_fast_title")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>{t("feat_secure_title")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            <span>No signup required</span>
          </div>
        </div>
      </div>
    </section>
  )
}
