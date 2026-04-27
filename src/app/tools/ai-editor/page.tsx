import type { Metadata } from "next"
import { Layout } from "@/components/layout"
import { AIEditor } from "@/components/tools/ai-editor/ai-editor"
import { ToolContent, toolFaqSchema } from "@/components/seo/tool-content"

const faqs = [{ question: 'What can I edit with prompts?', answer: 'You can ask for background changes, style changes, object edits, lighting improvements, and creative transformations.' },{ question: 'Do I need design skills?', answer: 'No. Describe what you want in plain English and let AI generate the result.' },{ question: 'Can I use reference images?', answer: 'Yes, the editor supports reference images for more context.' },{ question: 'Does AI editing use credits?', answer: 'Yes, AI generation and editing can use credits based on your plan.' }]

export const metadata: Metadata = {
  title: 'AI Image Editor Online',
  description: 'Edit and transform photos with natural-language AI prompts. Upload an image, describe the change, and generate results online.',
  alternates: { canonical: '/tools/ai-editor' },
  openGraph: { title: 'AI Image Editor Online', description: 'Edit and transform photos with natural-language AI prompts. Upload an image, describe the change, and generate results online.', url: 'https://imagetoolss.com/tools/ai-editor' },
}

export default function Page() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolFaqSchema(faqs)) }} />
      <AIEditor />
      <ToolContent
        title='How to edit images with AI'
        description='Edit and transform photos with natural-language AI prompts. Upload an image, describe the change, and generate results online.'
        steps={['Upload a photo', 'Describe your edit with a prompt', 'Generate and download your result']}
        benefits={['Natural-language photo editing', 'Reference image support', 'Useful prompt templates', 'Creative and ecommerce transformations']}
        useCases={['Product photo enhancement', 'Social media creatives', 'Background changes', 'Creative image variations']}
        faqs={faqs}
      />
    </Layout>
  )
}
