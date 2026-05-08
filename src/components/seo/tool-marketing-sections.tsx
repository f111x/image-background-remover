import Link from "next/link"
import { CheckCircle, HelpCircle, ArrowRight, Shield, Zap, ImageIcon } from "lucide-react"

interface ToolMarketingProps {
  title: string
  description: string
  features: string[]
  useCases?: string[]
  faqs?: { q: string; a: string }[]
  relatedTools?: { name: string; href: string; description: string }[]
}

export function ToolMarketingSections({
  title,
  description,
  features,
  useCases,
  faqs,
  relatedTools,
}: ToolMarketingProps) {
  return (
    <>
      {/* How It Works */}
      <section className="py-16 px-4 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold text-lg mb-2">Upload Your Image</h3>
              <p className="text-muted-foreground text-sm">Drag and drop or click to upload. Supports JPG, PNG, WEBP up to 10MB.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold text-lg mb-2">AI Processes It</h3>
              <p className="text-muted-foreground text-sm">Our AI automatically detects the subject and removes or edits the background in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold text-lg mb-2">Download Result</h3>
              <p className="text-muted-foreground text-sm">Get your processed image instantly. Transparent PNG ready for any use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">Why Use {title}?</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{description}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      {useCases && useCases.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-4">What You Can Use It For</h2>
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {useCases.map((useCase) => (
                <div key={useCase} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <ImageIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Privacy */}
      <section className="py-12 px-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
        <div className="container mx-auto max-w-3xl text-center">
          <Shield className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-2">Private & Secure</h3>
          <p className="text-muted-foreground text-sm">Your images are processed in memory and never stored on our servers. All processing happens locally — your files stay yours.</p>
        </div>
      </section>

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
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
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools && relatedTools.length > 0 && (
        <section className="py-16 px-4 bg-secondary/20">
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
      )}
    </>
  )
}
