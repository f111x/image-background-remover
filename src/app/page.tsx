import { Layout } from "@/components/layout"
import { Hero } from "@/components/hero"
import { BackgroundRemoverEditor } from "@/components/tools/background-remover/editor"
import { AIEditor } from "@/components/tools/ai-editor/ai-editor"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"

export default function Home() {
  return (
    <Layout>
      <Hero />
      
      {/* Background Remover Tool */}
      <BackgroundRemoverEditor />
      
      {/* AI Editor Tool */}
      <AIEditor />

      <Features />
      <Showcase />
      <Testimonials />
      <FAQ />
    </Layout>
  )
}
