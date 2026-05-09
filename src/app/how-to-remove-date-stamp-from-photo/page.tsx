import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Eraser, Upload, Wand2, Download, CheckCircle, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Remove Date Stamp from Photo — Free AI Tool | ImageTools",
  description: "Learn how to remove date stamps and timestamps from photos instantly with AI. Restore old photographs or clean up images for sharing. Free step-by-step guide with no signup required.",
  alternates: { canonical: "https://imagetoolss.com/how-to-remove-date-stamp-from-photo" },
  openGraph: {
    title: "How to Remove Date Stamp from Photo | ImageTools",
    description: "Remove date stamps from photos for free in seconds. AI-powered inpainting restores the original image naturally. No signup required.",
    url: "https://imagetoolss.com/how-to-remove-date-stamp-from-photo",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Date Stamp from Photo | ImageTools",
  },
  keywords: ["how to remove date stamp from photo", "remove timestamp from photo", "delete date from picture", "photo restoration", "remove text from photo"],
}

export default function HowToRemoveDateStampPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Step-by-Step Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Remove a Date Stamp from a Photo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Remove date stamps, timestamps, and text from any photo in seconds. AI fills in the removed area naturally — no design skills needed.
          </p>
          <div className="mt-8">
            <Link href="/tools/watermark-remover" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
              Remove Date Stamps Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Remove Date Stamps in 3 Steps</h2>
          <div className="space-y-8">
            {[
              { step: "1", icon: Upload, title: "Upload Your Photo", desc: "Open ImageTools Watermark Remover and upload your photo. Drag and drop or click to select. Supports JPG, PNG, WEBP up to 10MB. Works on old scanned photos too.", tip: "For best results, use the highest resolution version of the photo you have." },
              { step: "2", icon: Eraser, title: "Paint Over the Date Stamp", desc: "Use the brush tool to paint over the date stamp or timestamp. The brush is adjustable in size. You can also remove logos, text, or any unwanted objects the same way.", tip: "Use a brush size slightly larger than the text to avoid leaving edges. Zoom in for precision." },
              { step: "3", icon: Download, title: "Download the Clean Photo", desc: "Click generate and AI fills in the painted area with natural content that matches the surrounding image. Download the result and share your restored photo.", tip: "If the result isn't perfect, undo and try again with a different brush size or area selection." },
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
          <h2 className="text-3xl font-bold text-center mb-8">What Else Can You Remove?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["Date stamps & timestamps", "Logos and watermarks", "Power lines", "Tourists in photos", "Dust spots & scratches", "Unwanted objects"].map((item) => (
              <div key={item} className="bg-white rounded-xl p-4 text-center">
                <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Will the removed area look natural?", a: "Yes. Our AI uses intelligent inpainting — it analyzes the surrounding image and fills in the removed area with content that matches naturally, including textures, patterns, and lighting." },
              { q: "Does this work on old photos?", a: "Yes. The tool works on both digital photos and scanned old photographs. For very old or damaged photos, results depend on the resolution and condition of the scan." },
              { q: "Is it free to remove date stamps?", a: "Yes. You can try removing date stamps and text from photos for free. Guest users get 5 free credits. Sign up for more credits without watermarks." },
              { q: "Can I remove multiple things from the same photo?", a: "Yes. You can paint over multiple areas in one session before generating. Each area costs one credit." },
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
          <h2 className="text-3xl font-bold mb-4">Remove Date Stamps from Photos Now</h2>
          <p className="text-muted-foreground mb-8">Free to try, no signup required. Restore your photos in seconds.</p>
          <Link href="/tools/watermark-remover" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
            Remove Date Stamps Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
