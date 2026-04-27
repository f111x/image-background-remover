import type { Metadata } from "next"
import { Layout } from "@/components/layout"
import { LandingPage } from "@/components/seo/landing-page"
import { toolFaqSchema } from "@/components/seo/tool-content"

const faqs = [{ question: 'Can I convert JPG to PDF online?', answer: 'Yes. Upload JPG images and generate a PDF.' },{ question: 'Is Image to PDF free?', answer: 'Yes. Image to PDF is available as a free tool.' },{ question: 'Can I combine multiple images?', answer: 'Yes, the tool supports multi-image PDF layouts.' },{ question: 'Can I customize the PDF?', answer: 'Yes. You can choose page size, orientation, layout, fit mode, and margins.' }]

export const metadata: Metadata = {
  title: 'JPG to PDF Converter Online',
  description: 'Convert JPG images to PDF documents online for free.',
  alternates: { canonical: '/jpg-to-pdf' },
  openGraph: { title: 'JPG to PDF Converter Online', description: 'Convert JPG images to PDF documents online for free.', url: 'https://imagetoolss.com/jpg-to-pdf' },
}

export default function Page() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolFaqSchema(faqs)) }} />
      <LandingPage title='JPG to PDF Converter Online' description='Convert JPG images to PDF documents online for free.' ctaHref='/tools/image-to-pdf' ctaLabel='Convert Images to PDF' steps={['Upload images', 'Choose PDF settings', 'Generate PDF']} benefits={['Free image to PDF conversion', 'JPG, PNG, WEBP, and GIF support', 'Page size, layout, orientation, and margin controls', 'Great for documents and product catalogs']} useCases={['JPG to PDF', 'PNG to PDF', 'Receipts and documents', 'Multiple images to one PDF']} faqs={faqs} />
    </Layout>
  )
}
