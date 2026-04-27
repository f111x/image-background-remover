import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolContent } from "@/components/seo/tool-content"

type FAQ = { question: string; answer: string }

type LandingPageProps = {
  title: string
  description: string
  ctaHref: string
  ctaLabel: string
  steps: string[]
  benefits: string[]
  useCases: string[]
  faqs: FAQ[]
  disclaimer?: string
}

export function LandingPage({ title, description, ctaHref, ctaLabel, steps, benefits, useCases, faqs, disclaimer }: LandingPageProps) {
  return (
    <>
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">{description}</p>
          <Link href={ctaHref}>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8">
              {ctaLabel}<ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Online tool</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Fast AI workflow</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> No design skills needed</span>
          </div>
        </div>
      </section>
      <ToolContent title={`How to use ${title}`} description={description} steps={steps} benefits={benefits} useCases={useCases} faqs={faqs} disclaimer={disclaimer} />
    </>
  )
}
