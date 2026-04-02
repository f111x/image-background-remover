import { Layout } from "@/components/layout"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import Link from "next/link"

export default function Home() {
  return (
    <Layout>
      <Hero />
      
      {/* Tools Showcase */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Tools</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Multiple AI tools in one platform. All with unified credits system.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Background Remover Tool Card */}
            <div className="bg-card rounded-2xl p-8 border shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Background Remover</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Remove image backgrounds instantly with AI. Supports JPG, PNG, WebP up to 10MB.
              </p>
              <Link
                href="/tools/background-remover"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Now →
              </Link>
            </div>

            {/* AI Editor Tool Card */}
            <div className="bg-card rounded-2xl p-8 border shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-medium">Coming Soon</span>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Image Editor</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Transform images with natural language prompts. Character consistency & scene preservation.
              </p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-sm font-medium rounded-lg cursor-not-allowed">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <Showcase />
      <Testimonials />
      <FAQ />
    </Layout>
  )
}
