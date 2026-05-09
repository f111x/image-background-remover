import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Scissors, Wand2, Download, Upload, CheckCircle, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Remove Background from Image — Complete Guide | ImageTools",
  description: "Learn how to remove background from any image in 3 simple steps. This comprehensive guide covers the best free online tools, tips for perfect cutouts, and how to use AI-powered background removal.",
  alternates: { canonical: "https://imagetoolss.com/how-to-remove-background-from-image" },
  openGraph: {
    title: "How to Remove Background from Image — Free Guide | ImageTools",
    description: "Step-by-step guide: remove image backgrounds for free in seconds. No signup required. Learn tips for perfect results every time.",
    url: "https://imagetoolss.com/how-to-remove-background-from-image",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Remove Background from Image | ImageTools",
  },
  keywords: ["how to remove background from image", "remove image background guide", "background removal tutorial", "free background remover", "AI background removal"],
}

export default function HowToRemoveBackgroundPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Step-by-Step Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Remove Background from an Image</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Remove backgrounds from any image in 3 simple steps — no design skills needed. This free guide shows you exactly how it's done.
          </p>
          <div className="mt-8">
            <Link href="/tools/background-remover" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
              Try It Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Step by Step */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Remove Background in 3 Steps</h2>
          <div className="space-y-12">
            {[
              {
                step: "1",
                icon: Upload,
                title: "Upload Your Image",
                desc: "Open ImageTools Background Remover and upload any image. Drag and drop or click to select. Supports JPG, PNG, WEBP up to 10MB. No signup required.",
                tip: "For best results, use high-resolution images with clear subject-to-background contrast."
              },
              {
                step: "2",
                icon: Wand2,
                title: "AI Removes the Background",
                desc: "Our AI automatically detects the subject in your image and removes the background in 1-2 seconds. No clicks needed — it's fully automatic.",
                tip: "The AI handles complex edges, fine hair strands, and translucent areas better than traditional tools."
              },
              {
                step: "3",
                icon: Download,
                title: "Download Your Image",
                desc: "Preview the result and download as PNG with a transparent background. Use it anywhere — websites, presentations, social media, or print.",
                tip: "Transparent PNG works on any colored background. Share directly or use in design tools."
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-3">{item.desc}</p>
                  <div className="bg-purple-50 rounded-lg p-3 text-sm">
                    <span className="font-semibold text-purple-600">Pro tip:</span> {item.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">Tips for Perfect Background Removal</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Use high-resolution images for sharper edges in the output",
              "Good lighting on the original photo helps AI detect edges more accurately",
              "For portraits, hair details are preserved even with complex backgrounds",
              "Remove shadows from the original image first for cleaner results",
              "The AI works best when the subject takes up at least 30% of the image",
              "For product photos, lay items flat on a contrasting surface if possible",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-3 bg-white rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is there a free way to remove image backgrounds?", a: "Yes. ImageTools offers a free background remover that works entirely in your browser. No signup required. You get 5 free credits for higher quality output." },
              { q: "What image formats are supported?", a: "Upload JPG, PNG, or WEBP images up to 10MB. The output is always a transparent PNG, which is the industry standard for cutout images." },
              { q: "Can I remove background from multiple images at once?", a: "Currently images are processed one at a time. Each account gets credits for processing. For batch processing, our API is available on paid plans." },
              { q: "Does it work on mobile?", a: "Yes. Open ImageTools in any mobile browser, upload from your photo gallery, and download the result directly. Works on iPhone and Android." },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-2">Q: {faq.q}</h3>
                <p className="text-muted-foreground text-sm">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Try It Now — It's Free</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link href="/tools/background-remover" className="bg-white rounded-xl p-5 hover:shadow-md transition">
              <Scissors className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-bold">Background Remover</h3>
              <p className="text-sm text-muted-foreground">Remove backgrounds instantly</p>
            </Link>
            <Link href="/tools/watermark-remover" className="bg-white rounded-xl p-5 hover:shadow-md transition">
              <Wand2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold">Watermark Remover</h3>
              <p className="text-sm text-muted-foreground">Remove text and objects</p>
            </Link>
            <Link href="/tools/ai-editor" className="bg-white rounded-xl p-5 hover:shadow-md transition">
              <Scissors className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-bold">AI Image Editor</h3>
              <p className="text-sm text-muted-foreground">Edit with text prompts</p>
            </Link>
          </div>
          <Link href="/tools/background-remover" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
            Start Removing Backgrounds <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}