"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, Zap, Globe, Gift } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export function Hero() {
  const { t } = useLanguage()

  const handleStartEditing = () => {
    const editorSection = document.getElementById("editor")
    if (editorSection) {
      editorSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Gift className="w-4 h-4" />
          {t("hero_badge")}
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          {t("hero_title")}
          <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("hero_title2")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {t("hero_subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleStartEditing}
          >
            <Upload className="w-5 h-5 mr-2" />
            {t("hero_button")}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>{t("hero_badge")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>{t("feat_secure_title")}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
