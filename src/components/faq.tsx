"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n"

const faqItems = [
  { q: "faq_q1", a: "faq_a1" },
  { q: "faq_q2", a: "faq_a2" },
  { q: "faq_q3", a: "faq_a3" },
  { q: "faq_q4", a: "faq_a4" },
  { q: "faq_q5", a: "faq_a5" },
  { q: "faq_q6", a: "faq_a6" },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { t } = useLanguage()

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("faq_title")}</h2>
          <p className="text-muted-foreground text-lg">
            {t("faq_subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <div key={index} className="bg-background rounded-lg border">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">{t(faq.q)}</span>
                <span className="text-muted-foreground">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-muted-foreground">
                  {t(faq.a)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
