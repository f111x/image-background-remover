import Link from "next/link"

type FAQ = { question: string; answer: string }

type ToolContentProps = {
  title: string
  description: string
  steps: string[]
  benefits: string[]
  useCases: string[]
  faqs: FAQ[]
  related?: { label: string; href: string }[]
  disclaimer?: string
}

export function ToolContent({ title, description, steps, benefits, useCases, faqs, related, disclaimer }: ToolContentProps) {
  return (
    <section className="px-4 py-16 bg-white">
      <div className="container mx-auto max-w-5xl space-y-14">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={step} className="rounded-2xl border p-6 bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-4">{index + 1}</div>
              <h3 className="font-bold text-lg">{step}</h3>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Why use ImageTools?</h2>
            <ul className="space-y-3">
              {benefits.map((item) => <li key={item} className="flex gap-3"><span className="text-green-500">✓</span><span>{item}</span></li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Best use cases</h2>
            <ul className="space-y-3">
              {useCases.map((item) => <li key={item} className="flex gap-3"><span className="text-purple-500">•</span><span>{item}</span></li>)}
            </ul>
          </div>
        </div>

        {disclaimer && (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-900">
            <strong>Important:</strong> {disclaimer}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border p-5 bg-gray-50">
                <h3 className="font-bold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Related tools</h2>
          <div className="flex flex-wrap gap-3">
            {(related || defaultRelated).map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full border px-4 py-2 text-sm hover:border-purple-400 hover:text-purple-600">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const defaultRelated = [
  { label: "Background Remover", href: "/tools/background-remover" },
  { label: "Watermark Remover", href: "/tools/watermark-remover" },
  { label: "AI Image Editor", href: "/tools/ai-editor" },
  { label: "Image to PDF", href: "/tools/image-to-pdf" },
]

export const toolFaqSchema = (faqs: FAQ[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
})
