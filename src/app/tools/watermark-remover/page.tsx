import type { Metadata } from "next"
import { Layout } from "@/components/layout"
import { WatermarkRemoverEditor } from "@/components/tools/watermark-remover/editor"
import { ToolContent, toolFaqSchema } from "@/components/seo/tool-content"

const faqs = [{ question: 'Can I remove any watermark?', answer: 'Only remove watermarks from images you own or have permission to edit.' },{ question: 'Can it remove text from images?', answer: 'Yes, paint over text or logos and the AI will try to reconstruct the area.' },{ question: 'Which formats are supported?', answer: 'JPG, PNG, and WEBP images up to 10MB are supported.' },{ question: 'Does this use credits?', answer: 'AI cleanup can use credits depending on your account and plan.' }]

export const metadata: Metadata = {
  title: 'AI Watermark Remover Online',
  description: 'Remove watermarks, text, logos, and unwanted objects from images with AI-powered inpainting.',
  alternates: { canonical: '/tools/watermark-remover' },
  openGraph: { title: 'AI Watermark Remover Online', description: 'Remove watermarks, text, logos, and unwanted objects from images with AI-powered inpainting.', url: 'https://imagetoolss.com/tools/watermark-remover' },
}

export default function Page() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolFaqSchema(faqs)) }} />
      <WatermarkRemoverEditor />
      <ToolContent
        title='How to remove watermarks from images'
        description='Remove watermarks, text, logos, and unwanted objects from images with AI-powered inpainting.'
        steps={['Upload your image', 'Paint over the unwanted area', 'Generate a cleaned image']}
        benefits={['AI-powered inpainting', 'Remove text, logos, stamps, and unwanted objects', 'Natural-looking cleanup results', 'Simple browser-based workflow']}
        useCases={['Cleaning images you own', 'Removing unwanted text from drafts', 'Fixing ecommerce and social images', 'Object cleanup for design assets']}
        faqs={faqs}
        disclaimer='Only remove watermarks from images you own or have permission to edit.'
      />
    </Layout>
  )
}
