import type { Metadata } from "next"
import { Layout } from "@/components/layout"
import { LandingPage } from "@/components/seo/landing-page"
import { toolFaqSchema } from "@/components/seo/tool-content"

const faqs = [{ question: 'Can I remove watermarks online?', answer: 'Yes, but only from images you own or have permission to edit.' },{ question: 'Can this remove text from an image?', answer: 'Yes. Mark the text area and let AI reconstruct the background.' },{ question: 'What formats are supported?', answer: 'JPG, PNG, and WEBP are supported.' },{ question: 'Is there a copyright warning?', answer: 'Yes. You should only edit images that you own or are allowed to modify.' }]

export const metadata: Metadata = {
  title: 'Remove Watermark from Image Online',
  description: 'Clean up images with AI-powered watermark and object removal.',
  alternates: { canonical: '/remove-watermark' },
  openGraph: { title: 'Remove Watermark from Image Online', description: 'Clean up images with AI-powered watermark and object removal.', url: 'https://imagetoolss.com/remove-watermark' },
}

export default function Page() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolFaqSchema(faqs)) }} />
      <LandingPage title='Remove Watermark from Image Online' description='Clean up images with AI-powered watermark and object removal.' ctaHref='/tools/watermark-remover' ctaLabel='Open Watermark Remover' steps={['Upload your image', 'Mark the watermark or unwanted object', 'Generate a cleaned image']} benefits={['AI-powered inpainting', 'Remove watermarks, text, logos, and objects', 'Browser-based workflow', 'Useful for images you own or can edit']} useCases={['Cleaning draft images', 'Removing unwanted text', 'Fixing product or social images', 'Object cleanup']} faqs={faqs} disclaimer='Only remove watermarks from images you own or have permission to edit.' />
    </Layout>
  )
}
