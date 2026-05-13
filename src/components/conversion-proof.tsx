"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, ShieldCheck, Sparkles, Upload } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

const proofStats = [
  { value: "7", labelKey: "proof_stat_tools" },
  { value: "2", labelKey: "proof_stat_free_credits" },
  { value: "10MB", labelKey: "proof_stat_file_size" },
]

const proofPoints = [
  { icon: Clock, titleKey: "proof_speed_title", descKey: "proof_speed_desc" },
  { icon: ShieldCheck, titleKey: "proof_privacy_title", descKey: "proof_privacy_desc" },
  { icon: CheckCircle, titleKey: "proof_no_watermark_title", descKey: "proof_no_watermark_desc" },
]

export function ConversionProof() {
  const { t } = useLanguage()

  return (
    <section className="px-4 py-16 bg-gradient-to-b from-white to-purple-50/40">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center rounded-3xl border border-purple-100 bg-white p-6 md:p-10 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 mb-4">
              <Sparkles className="h-4 w-4" />
              {t("proof_badge")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("proof_title")}
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              {t("proof_subtitle")}
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {proofStats.map((stat) => (
                <div key={stat.labelKey} className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-8">
              {proofPoints.map((point) => (
                <div key={point.titleKey} className="flex gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <point.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t(point.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(point.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/tools/background-remover" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-purple-700 hover:to-pink-700">
                <Upload className="h-4 w-4" />
                {t("proof_primary_cta")}
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:border-purple-300 hover:text-purple-700">
                {t("proof_secondary_cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-950 p-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-white/50">imagetoolss.com/tools/background-remover</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 p-4 min-h-[230px] flex flex-col justify-between">
                <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700">{t("proof_before")}</span>
                <div className="mx-auto h-28 w-28 rounded-full bg-gradient-to-b from-orange-200 to-orange-400 shadow-lg" />
                <div className="h-12 rounded-xl bg-white/50" />
              </div>
              <div className="relative rounded-2xl bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f4f6_75%),linear-gradient(-45deg,transparent_75%,#f3f4f6_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px] p-4 min-h-[230px] flex flex-col justify-between">
                <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{t("proof_after")}</span>
                <div className="mx-auto h-28 w-28 rounded-full bg-gradient-to-b from-orange-200 to-orange-400 shadow-2xl ring-4 ring-white" />
                <div className="flex items-center gap-2 rounded-xl bg-white/90 p-3 text-sm font-medium text-green-700 shadow-sm">
                  <CheckCircle className="h-4 w-4" />
                  {t("proof_result_label")}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white/10 p-4 text-white">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>{t("proof_processing_label")}</span>
                <span className="text-green-300">100%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
