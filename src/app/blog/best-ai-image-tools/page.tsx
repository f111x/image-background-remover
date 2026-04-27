import type { Metadata } from "next"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Best AI Image Tools for Everyday Work',
  description: 'A practical list of AI image tools for background removal, image cleanup, AI editing, and PDF conversion.',
  alternates: { canonical: '/blog/best-ai-image-tools' },
}

export default function Page() {
  return (
    <Layout>
      <article className="pt-32 pb-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm text-purple-600 hover:underline">ImageTools Blog</Link>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Best AI Image Tools for Everyday Work</h1>
          <p className="text-xl text-muted-foreground mb-8">A practical list of AI image tools for background removal, image cleanup, AI editing, and PDF conversion.</p>
          <Link href='/tools'><Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Explore All Tools</Button></Link>
          <section className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold">Step-by-step guide</h2>
            <ol className="space-y-4"><li className="flex gap-3"><span className="text-purple-500 font-bold">1.</span><span>Use Background Remover for transparent product and logo assets.</span></li><li className="flex gap-3"><span className="text-purple-500 font-bold">2.</span><span>Use Watermark Remover for cleanup on images you own.</span></li><li className="flex gap-3"><span className="text-purple-500 font-bold">3.</span><span>Use AI Image Editor for prompt-based creative changes.</span></li><li className="flex gap-3"><span className="text-purple-500 font-bold">4.</span><span>Use Image to PDF for free document workflows.</span></li></ol>
            <h2 className="text-2xl font-bold pt-6">Tips for better results</h2>
            <p className="text-muted-foreground">Use clear, high-resolution images with good lighting. Keep the main subject visible and avoid overly compressed files. For ecommerce images, check platform requirements before uploading final assets.</p>
            <h2 className="text-2xl font-bold pt-6">Related ImageTools</h2>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-full border px-4 py-2 text-sm" href="/tools/background-remover">Background Remover</Link>
              <Link className="rounded-full border px-4 py-2 text-sm" href="/tools/watermark-remover">Watermark Remover</Link>
              <Link className="rounded-full border px-4 py-2 text-sm" href="/tools/ai-editor">AI Image Editor</Link>
              <Link className="rounded-full border px-4 py-2 text-sm" href="/tools/image-to-pdf">Image to PDF</Link>
            </div>
          </section>
        </div>
      </article>
    </Layout>
  )
}
