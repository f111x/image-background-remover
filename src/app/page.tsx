import { Layout } from "@/components/layout"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <Showcase />
      <Testimonials />
      <FAQ />
    </Layout>
  )
}
