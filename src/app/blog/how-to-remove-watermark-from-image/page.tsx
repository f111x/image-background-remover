import type { Metadata } from "next"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'How to Remove Watermark from Image',
  description: 'Learn how to clean up watermarks, text, and unwanted objects from images you own or can edit.',
  alternates: { canonical: '/blog/how-to-remove-watermark-from-image' },
}

export default function Page() {
  return (
    <Layout>
      <article className="pt-32 pb-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm text-purple-600 hover:underline">ImageTools Blog</Link>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">How to Remove Watermark from Image</h1>
          <p className="text-xl text-muted-foreground mb-8">Learn how to clean up watermarks, text, and unwanted objects from images you own or can edit.</p>
          <Link href='/tools/watermark-remover'><Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Try Watermark Remover</Button></Link>
          <section className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold">Step-by-step guide</h2>
            <ol className="space-y-4"><li className="flex gap-3"><span className="text-purple-500 font-bold">1.</span><span>Upload an image you own or have permission to modify.</span></li><li className="flex gap-3"><span className="text-purple-500 font-bold">2.</span><span>Paint over the watermark, logo, text, or object.</span></li><li className="flex gap-3"><span className="text-purple-500 font-bold">3.</span><span>Generate the cleaned result and review the output.</span></li></ol>
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
