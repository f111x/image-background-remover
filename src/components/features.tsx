"use client"

import { Card } from "@/components/ui/card"
import { Shield, Zap, Globe, ImageIcon } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Natural Language Editing",
    description: "Describe what you want with simple text prompts. Our AI understands context and intent.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your images are processed securely and never stored on our servers after processing.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Get your processed images in seconds. No waiting, no queues.",
  },
  {
    icon: ImageIcon,
    title: "High Quality Output",
    description: "Preserve image quality with precise edge detection and natural results.",
  },
]

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for professional background removal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
