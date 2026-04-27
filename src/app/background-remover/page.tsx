import type { Metadata } from "next"
import { Layout } from "@/components/layout"
import { LandingPage } from "@/components/seo/landing-page"
import { toolFaqSchema } from "@/components/seo/tool-content"

const faqs = [{ question: 'Can I remove backgrounds online?', answer: 'Yes. Upload an image and use ImageTools to remove the background online.' },{ question: 'Can I make the background transparent?', answer: 'Yes. The background remover is designed for transparent PNG-style output.' },{ question: 'What files are supported?', answer: 'JPG, PNG, and WEBP images are supported.' },{ question: 'Is this useful for ecommerce?', answer: 'Yes. It works well for product photos, online stores, and marketplace listings.' }]

export const metadata: Metadata = {
  title: 'Background Remover Online',
  description: 'Use AI to remove backgrounds from product photos, logos, portraits, and social media images.',
  alternates: { canonical: '/background-remover' },
  openGraph: { title: 'Background Remover Online', description: 'Use AI to remove backgrounds from product photos, logos, portraits, and social media images.', url: 'https://imagetoolss.com/background-remover' },
}

export default function Page() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolFaqSchema(faqs)) }} />
      <LandingPage title='Background Remover Online' description='Use AI to remove backgrounds from product photos, logos, portraits, and social media images.' ctaHref='/tools/background-remover' ctaLabel='Upload Image' steps={['Upload your image', 'Let AI remove the background', 'Download your result']} benefits={['Automatic background removal', 'Transparent PNG output', 'Works for ecommerce, logos, portraits, and social images', 'Fast online workflow']} useCases={['Product photos', 'Logo assets', 'Profile photos', 'Marketing images']} faqs={faqs} />
    </Layout>
  )
}
