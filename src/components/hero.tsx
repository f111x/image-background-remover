"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, Wand2, Eraser, FileText, Sparkles, ShieldCheck, Zap } from "lucide-react"

const tools = [
  { name: "Background Remover", href: "/tools/background-remover", icon: Upload, desc: "Remove image backgrounds and download transparent PNGs." },
  { name: "Watermark Remover", href: "/tools/watermark-remover", icon: Eraser, desc: "Clean up watermarks, text, logos, and unwanted objects." },
  { name: "AI Image Editor", href: "/tools/ai-editor", icon: Wand2, desc: "Edit photos with natural-language AI prompts." },
  { name: "Image to PDF", href: "/tools/image-to-pdf", icon: FileText, desc: "Convert JPG, PNG, and WEBP images into PDF files." },
]

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto max-w-6xl text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Free AI Image Tools Online
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          Free AI Image Tools
          <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Online</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Remove backgrounds, clean up images, edit photos with AI, and convert images to PDF in seconds. Built for ecommerce sellers, creators, designers, and everyday productivity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/tools/background-remover">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <Upload className="w-5 h-5 mr-2" />
              Start with Background Remover
            </Button>
          </Link>
          <Link href="/tools">
            <Button size="lg" variant="outline" className="px-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <Sparkles className="w-5 h-5 mr-2" />
              Explore All Tools
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left mb-10">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group rounded-2xl border bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all">
              <tool.icon className="w-7 h-7 text-primary mb-3" />
              <h2 className="text-lg font-bold mb-2 group-hover:text-primary">{tool.name}</h2>
              <p className="text-sm text-muted-foreground">{tool.desc}</p>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span>Fast AI processing</span></div>
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /><span>Private image handling</span></div>
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /><span>No design skills needed</span></div>
        </div>
      </div>
    </section>
  )
}
