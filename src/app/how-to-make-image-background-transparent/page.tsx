import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Layers, Upload, Wand2, Download, CheckCircle, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Make Image Background Transparent Online | ImageTools",
  description: "Learn how to make any image background transparent in seconds. Free guide covers the easiest method using AI, tips for perfect PNG cutouts, and how to use transparent images on any background.",
  alternates: { canonical: "https://imagetoolss.com/how-to-make-image-background-transparent" },
  openGraph: {
    title: "How to Make Image Background Transparent | ImageTools",
    description: "Make image backgrounds transparent for free in seconds. No signup required. Learn how to get perfect PNG cutouts with AI.",
    url: "https://imagetoolss.com/how-to-make-image-background-transparent",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Make Background Transparent | ImageTools",
  },
  keywords: ["how to make image background transparent", "transparent background online", "make png transparent", "remove background transparent"],
}

export default function HowToTransparentBgPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Step-by-Step Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Make an Image Background Transparent</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Make any image background transparent in 3 clicks. No design skills needed — AI does the work for you, completely free.
          </p>
          <div className="mt-8">
            <Link href="/tools/background-remover" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
              Try It Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">The Easiest Way to Get Transparent Backgrounds</h2>
          <div className="space-y-8">
            {[
              { step: "1", icon: Upload, title: "Open the Transparent Background Tool", desc: "Go to ImageTools Background Remover. Click or drag to upload your image. Supports JPG, PNG, WEBP up to 10MB. No account needed.", tip: "Higher resolution images produce cleaner edge quality in the output PNG." },
              { step: "2", icon: Wand2, title: "AI Removes the Background Automatically", desc: "The AI detects your subject and removes the background instantly — no buttons to click, no settings to adjust.", tip: "Works on portraits, products, animals, text, and any other clear subject." },
              { step: "3", icon: Download, title: "Download Transparent PNG", desc: "Save your result as a transparent PNG. Place it on any colored background — white, gradient, photo, or pattern. It just works.", tip: "Transparent PNGs work in Canva, Photoshop, Keynote, PowerPoint, and any web project." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col md:flex-row gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{item.desc}</p>
                  <div className="bg-purple-50 rounded-lg p-2.5 text-sm">
                    <span className="font-semibold text-purple-600">Tip:</span> {item.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">Transparent vs Removed Background — What's the Difference?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-purple-600">Transparent Background</h3>
              <p className="text-muted-foreground text-sm mb-3">The background is removed but the canvas stays the same size. The "empty" areas are see-through (alpha channel). Great for overlays, stickers, and placing over other images.</p>
              <div className="bg-gray-100 rounded-lg p-3 text-sm font-mono">Use case: Stickers, logos, overlays, custom graphics</div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-purple-600">Background Removed</h3>
              <p className="text-muted-foreground text-sm mb-3">The subject is cropped to fit tightly around the edges with no background at all. Best for clean cutouts that you want to composite into other scenes.</p>
              <div className="bg-gray-100 rounded-lg p-3 text-sm font-mono">Use case: Product photos, profile pictures, social posts</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is ImageTools really free?", a: "Yes. You can remove backgrounds from images for free without creating an account. We give you 5 free credits to try higher quality output." },
              { q: "What file formats support transparency?", a: "Only PNG and WEBP support transparent backgrounds. JPG does not support transparency. ImageTools always outputs PNG so you get a transparent result." },
              { q: "Can I make the background white instead of transparent?", a: "Yes. After removing the background, use our AI Image Editor to add a white background instead. Or use our White Background product photo tool for marketplace-ready images." },
              { q: "Why does my transparent PNG show a checkerboard pattern?", a: "That's normal — it's a preview pattern showing transparency. The actual PNG has no background. In any image editor or on a colored webpage, it will look correct." },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-2">Q: {faq.q}</h3>
                <p className="text-muted-foreground text-sm">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Backgrounds Transparent?</h2>
          <p className="text-muted-foreground mb-8">Free, instant, no signup required. Get transparent PNGs in seconds.</p>
          <Link href="/tools/background-remover" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
            Make Backgrounds Transparent <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {[
              { href: "/tools/background-remover", label: "Background Remover", desc: "Transparent cutouts" },
              { href: "/tools/ai-editor", label: "AI Image Editor", desc: "Add new backgrounds" },
              { href: "/white-background-for-product-photos", label: "White Background", desc: "Add white backgrounds" },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="bg-white rounded-xl p-4 hover:shadow-md transition">
                <h3 className="font-bold text-sm">{t.label}</h3>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
