import type { Metadata } from "next"
import { Layout } from "@/components/layout"
import { ImageToPDFEditor } from "@/components/tools/image-to-pdf/editor"
import { ToolContent, toolFaqSchema } from "@/components/seo/tool-content"

const faqs = [{ question: 'Is Image to PDF free?', answer: 'Yes, this converter is designed as a free tool.' },{ question: 'Can I convert JPG to PDF?', answer: 'Yes, JPG, PNG, WEBP, and GIF files are supported.' },{ question: 'Can I customize the PDF layout?', answer: 'Yes, choose page size, orientation, images per page, fit mode, and margins.' },{ question: 'Do I need to log in?', answer: 'Single-image conversion is free; some advanced multi-image workflows may require login.' }]

export const metadata: Metadata = {
  title: 'Image to PDF Converter Online Free',
  description: 'Convert JPG, PNG, WEBP, and GIF images into PDF documents online for free with page size, orientation, layout, and margin options.',
  alternates: { canonical: '/tools/image-to-pdf' },
  openGraph: { title: 'Image to PDF Converter Online Free', description: 'Convert JPG, PNG, WEBP, and GIF images into PDF documents online for free with page size, orientation, layout, and margin options.', url: 'https://imagetoolss.com/tools/image-to-pdf' },
}

export default function Page() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolFaqSchema(faqs)) }} />
      <ImageToPDFEditor />
      <ToolContent
        title='How to convert images to PDF'
        description='Convert JPG, PNG, WEBP, and GIF images into PDF documents online for free with page size, orientation, layout, and margin options.'
        steps={['Upload one or more images', 'Choose PDF size and layout', 'Generate and download your PDF']}
        benefits={['Free image to PDF conversion', 'Supports common image formats', 'Custom page size, orientation, layout, and margins', 'Great traffic entry point with no credits required']}
        useCases={['Documents and receipts', 'School or office files', 'Product catalogs', 'Combining multiple images into one PDF']}
        faqs={faqs}
      />
    </Layout>
  )
}
