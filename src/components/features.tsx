"use client"

import { Card } from "@/components/ui/card"
import { Shield, Zap, Globe, ImageIcon } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

const features = [
  {
    icon: Zap,
    titleKey: "feat_fast_title",
    descKey: "feat_fast_desc",
  },
  {
    icon: Shield,
    titleKey: "feat_secure_title",
    descKey: "feat_secure_desc",
  },
  {
    icon: Globe,
    titleKey: "feat_quality_title",
    descKey: "feat_quality_desc",
  },
  {
    icon: ImageIcon,
    titleKey: "feat_ai_title",
    descKey: "feat_ai_desc",
  },
]

export function Features() {
  const { t } = useLanguage()

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("features_title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("features_subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t(feature.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
