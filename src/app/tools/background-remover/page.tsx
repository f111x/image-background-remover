import type { Metadata } from "next"
import { Layout } from "@/components/layout"
import { BackgroundRemoverEditor } from "@/components/tools/background-remover/editor"
import { ToolContent, toolFaqSchema } from "@/components/seo/tool-content"

const faqs = [{ question: 'Can I remove a background for free?', answer: 'Yes, you can try the tool online and use credits for higher-value processing.' },{ question: 'Which formats are supported?', answer: 'JPG, PNG, and WEBP images up to 10MB are supported.' },{ question: 'Can I download transparent PNG files?', answer: 'Yes, background removal results are designed for transparent PNG downloads.' },{ question: 'Are my images stored?', answer: 'Images are processed for the requested edit and should not be used for any other purpose.' }]

export const metadata: Metadata = {
  title: 'Remove Background from Image Online Free',
  description: 'Remove image backgrounds automatically with AI. Upload JPG, PNG, or WEBP images and download transparent PNG files in seconds.',
  alternates: { canonical: '/tools/background-remover' },
  openGraph: { title: 'Remove Background from Image Online Free', description: 'Remove image backgrounds automatically with AI. Upload JPG, PNG, or WEBP images and download transparent PNG files in seconds.', url: 'https://imagetoolss.com/tools/background-remover' },
}

export default function Page() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolFaqSchema(faqs)) }} />
      <BackgroundRemoverEditor />
      <ToolContent
        title='How to remove background from an image'
        description='Remove image backgrounds automatically with AI. Upload JPG, PNG, or WEBP images and download transparent PNG files in seconds.'
        steps={['Upload your image', 'AI removes the background', 'Download transparent PNG']}
        benefits={['One-click AI background removal', 'Transparent PNG output', 'Works for product photos, logos, portraits, and social posts', 'Guest mode available for quick testing']}
        useCases={['Ecommerce product photos', 'Logo and design assets', 'Profile photos and portraits', 'Social media creatives']}
        faqs={faqs}
      />
    </Layout>
  )
}
