"use client"

import { useLanguage } from "@/lib/i18n"

export function Testimonials() {
  const { t } = useLanguage()

  const testimonials = [
    {
      quoteKey: "test_sarah_content",
      authorKey: "test_sarah_name",
      roleKey: "test_sarah_role",
    },
    {
      quoteKey: "test_marcus_content",
      authorKey: "test_marcus_name",
      roleKey: "test_marcus_role",
    },
    {
      quoteKey: "test_emily_content",
      authorKey: "test_emily_name",
      roleKey: "test_emily_role",
    },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("testimonials_title")}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background rounded-xl p-6 shadow-sm">
              <p className="text-muted-foreground mb-4">&ldquo;{t(testimonial.quoteKey)}&rdquo;</p>
              <div>
                <p className="font-medium">{t(testimonial.authorKey)}</p>
                <p className="text-sm text-muted-foreground">{t(testimonial.roleKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
