import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, FileText, Upload, Settings, Download, CheckCircle, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Convert Multiple Images to PDF — Free Online | ImageTools",
  description: "Learn how to convert multiple images to one PDF document for free. Step-by-step guide covers merging JPG, PNG, and WEBP into a single PDF, customizing page size, and organizing scanned documents.",
  alternates: { canonical: "https://imagetoolss.com/how-to-convert-multiple-images-to-pdf" },
  openGraph: {
    title: "How to Convert Multiple Images to PDF | ImageTools",
    description: "Merge multiple images into one PDF free online. Step-by-step guide to combining photos, scanned documents, and screenshots into a single PDF file.",
    url: "https://imagetoolss.com/how-to-convert-multiple-images-to-pdf",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Multiple Images to PDF | ImageTools",
  },
  keywords: ["how to convert multiple images to pdf", "merge images into pdf", "combine photos pdf", "images to pdf free", "pdf from photos online"],
}

export default function HowToImagesToPdfPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Step-by-Step Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Convert Multiple Images to PDF</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Merge up to 20 images into one PDF document in minutes. Free, no signup required, works in any browser.
          </p>
          <div className="mt-8">
            <Link href="/tools/image-to-pdf" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
              Convert Images to PDF Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Convert Images to PDF in 4 Steps</h2>
          <div className="space-y-8">
            {[
              { step: "1", icon: Upload, title: "Select Your Images", desc: "Open ImageTools Image to PDF converter. Click to select multiple images, or drag and drop a whole folder. Supports up to 20 images per PDF. Order them as you want them to appear in the document." },
              { step: "2", icon: Settings, title: "Choose Layout Options", desc: "Select page size: A4, Letter, or Square. Choose layout: 1 image per page, 2 per page, or grid. Set image fit mode: fill, fit, or stretch. Adjust margins if needed." },
              { step: "3", icon: FileText, title: "Generate PDF", desc: "Click the generate button. Your images are processed and combined into a single PDF document. The process takes a few seconds depending on the number and size of images." },
              { step: "4", icon: Download, title: "Download Your PDF", desc: "Preview the result and download your PDF. Share via email, upload to Google Drive, or print directly. The PDF works on any device without special software." },
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
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Scanned Documents", desc: "Combine scanned pages into one searchable PDF document" },
              { title: "Photo Albums", desc: "Turn a folder of photos into a shareable photo book PDF" },
              { title: "Receipts & Invoices", desc: "Merge receipt photos into a single PDF for expense tracking" },
              { title: "Presentations", desc: "Combine screenshots and slides into a presentation PDF" },
              { title: "ID Documents", desc: "Merge front and back ID photos into a single document" },
              { title: "Recipes & Articles", desc: "Save online recipes or articles as offline PDFs" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
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
              { q: "Is this really free?", a: "Yes. Converting images to PDF is completely free without an account. No watermarks on the output PDF." },
              { q: "How many images can I merge?", a: "You can merge up to 20 images into a single PDF in one conversion. For more, you can do multiple conversions and combine the results." },
              { q: "What image formats are supported?", a: "Upload JPG, PNG, WEBP, or GIF images. The output is always a standard PDF that works on any device." },
              { q: "Can I change the page order?", a: "Yes. You can drag and drop to reorder images before generating the PDF. They will appear in the PDF in the order you set." },
              { q: "What page sizes are available?", a: "Choose from A4 (210x297mm), US Letter (8.5x11in), or Square (Instagram-style 1:1). Images are automatically fitted to the selected page size." },
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
          <h2 className="text-3xl font-bold mb-4">Start Converting Images to PDF</h2>
          <p className="text-muted-foreground mb-8">Free, fast, no signup required. Merge up to 20 images into one PDF.</p>
          <Link href="/tools/image-to-pdf" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
            Convert Images to PDF <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
