import Link from "next/link"
import { CheckCircle, HelpCircle, ArrowRight, ImageIcon, ShoppingBag, Star, Package } from "lucide-react"

interface ScenePageTemplateProps {
  /** e.g. "for Shopify" */
  badge: string
  /** e.g. "Shopify Product Photos" */
  title: string
  /** e.g. "https://shopify.com" */
  platformName: string
  /** H1 heading */
  heading: string
  /** Meta description */
  description: string
  /** Key benefits of using this tool for the platform */
  benefits: string[]
  /** Step-by-step usage guide */
  steps: { title: string; description: string }[]
  /** Common use cases for this platform */
  useCases: string[]
  /** Platform-specific FAQs */
  faqs: { q: string; a: string }[]
  /** Related tool links */
  relatedTools: { name: string; href: string; description: string }[]
  /** JSON-LD structured data */
  jsonLd?: object
}

export function ScenePageTemplate({
  badge,
  title,
  platformName,
  heading,
  description,
  benefits,
  steps,
  useCases,
  faqs,
  relatedTools,
}: ScenePageTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-6">
            <ShoppingBag className="w-4 h-4" />
            {badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heading}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{description}</p>
          <div className="mt-8">
            <Link
              href="/tools/background-remover"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              Remove Background for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">Why Use Background Removal for {platformName}?</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Professional product images are essential for {platformName} success. Remove backgrounds instantly and make your products stand out.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 bg-gray-50 rounded-xl p-5">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">How to Prepare {platformName} Product Images</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-lg text-center mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">Perfect for Every {platformName} Image Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {useCases.map((useCase) => (
              <div key={useCase} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <Package className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-medium">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-2 justify-center mb-8">
            <Star className="w-6 h-6 text-purple-500" />
            <h2 className="text-3xl font-bold">{platformName} Image Tips</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-2">Use pure white backgrounds</h3>
              <p className="text-muted-foreground text-sm">{platformName} recommends pure white (#FFFFFF) backgrounds for best results. Our AI removes backgrounds completely, giving you a perfect cutout.</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-2">Maintain image quality</h3>
              <p className="text-muted-foreground text-sm">Use high-resolution images (at least 1000x1000px) for {platformName}. Our tool preserves edges and details for professional results.</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-2">Consistent sizing</h3>
              <p className="text-muted-foreground text-sm">Keep your product images consistent in size and style across your {platformName} store for a professional appearance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-2 justify-center mb-8">
            <HelpCircle className="w-6 h-6 text-purple-500" />
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-2">Q: {faq.q}</h3>
                <p className="text-muted-foreground text-sm">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-8">Related Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <h3 className="font-bold mb-1 group-hover:text-purple-600 transition-colors">{tool.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{tool.description}</p>
                <span className="inline-flex items-center gap-1 text-purple-500 text-sm font-medium group-hover:gap-2 transition-all">
                  Try it <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Perfect {platformName} Images?</h2>
          <p className="text-purple-100 mb-8">Remove backgrounds from your product images in seconds. No signup required.</p>
          <Link
            href="/tools/background-remover"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
