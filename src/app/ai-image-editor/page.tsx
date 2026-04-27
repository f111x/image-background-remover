import type { Metadata } from "next"
import { Layout } from "@/components/layout"
import { LandingPage } from "@/components/seo/landing-page"
import { toolFaqSchema } from "@/components/seo/tool-content"

const faqs = [{ question: 'How do I edit images with AI?', answer: 'Upload an image, enter a prompt describing the desired change, and generate.' },{ question: 'Can AI change a background?', answer: 'Yes, use prompts such as change the background to white or make it look professional.' },{ question: 'Do I need Photoshop skills?', answer: 'No. Plain-language prompts are enough.' },{ question: 'Does AI editing use credits?', answer: 'AI generation may use credits based on your plan.' }]

export const metadata: Metadata = {
  title: 'AI Image Editor Online',
  description: 'Edit images with AI prompts. Upload a photo, describe the change, and generate results.',
  alternates: { canonical: '/ai-image-editor' },
  openGraph: { title: 'AI Image Editor Online', description: 'Edit images with AI prompts. Upload a photo, describe the change, and generate results.', url: 'https://imagetoolss.com/ai-image-editor' },
}

export default function Page() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolFaqSchema(faqs)) }} />
      <LandingPage title='AI Image Editor Online' description='Edit images with AI prompts. Upload a photo, describe the change, and generate results.' ctaHref='/tools/ai-editor' ctaLabel='Open AI Editor' steps={['Upload an image', 'Describe your edit', 'Generate and download']} benefits={['Edit with natural-language prompts', 'Change backgrounds and styles', 'Improve product and social photos', 'No professional software required']} useCases={['AI photo editing', 'Product photo enhancement', 'Social media creatives', 'Creative transformations']} faqs={faqs} />
    </Layout>
  )
}
