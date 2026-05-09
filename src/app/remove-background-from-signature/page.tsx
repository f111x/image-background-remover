import { Metadata } from "next"
import { ScenePageTemplate } from "@/components/seo/scene-page-template"

export const metadata: Metadata = {
  title: "Remove Background from Signature - Free Online Tool | ImageTools",
  description: "Remove background from your signature image instantly. Upload a scanned or photographed signature and get a clean transparent PNG. Free, no signup required.",
  alternates: { canonical: "https://imagetoolss.com/remove-background-from-signature" },
  openGraph: {
    title: "Remove Background from Signature — Clean Signatures | ImageTools",
    description: "Remove background from signature images. Get clean transparent signatures for digital documents, forms, and email. Works with scanned or photographed signatures.",
    url: "https://imagetoolss.com/remove-background-from-signature",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Background from Signature — Clean Signatures | ImageTools",
  },
  keywords: ["remove background from signature", "signature background remover", "transparent signature", "signature image editor", "remove signature background"],
}

const benefits = [
  "Remove any background from signature images",
  "Clean transparent PNG output",
  "Works with scanned or photographed signatures",
  "Preserves fine handwriting details",
  "Free to use, no signup required",
  "Instant results in seconds",
]

const steps = [
  {
    title: "Upload Your Signature",
    description: "Upload a photo or scan of your signature. Works with any image format — JPG, PNG, WEBP up to 10MB.",
  },
  {
    title: "AI Removes the Background",
    description: "Our AI detects the signature strokes and removes the background, preserving the fine details of your handwriting.",
  },
  {
    title: "Download & Use",
    description: "Download your transparent PNG signature and use it in documents, forms, contracts, or any digital application.",
  },
]

const useCases = [
  "Digital document signing",
  "Email signature images",
  "Contract and agreement forms",
  "Legal document signatures",
  "Business correspondence",
  "Online forms and applications",
]

const faqs = [
  {
    q: "Will my signature look exactly the same?",
    a: "Yes, our AI preserves the fine details of handwriting including pen strokes, ink variation, and subtle line weights.",
  },
  {
    q: "What format should my signature be?",
    a: "Upload any image format — photo of a printed signature, scanned signature, or digital signature image. Works best with clear, high-contrast images.",
  },
  {
    q: "Is this secure?",
    a: "Yes. Your signature images are processed in memory and never stored on our servers. All processing happens locally.",
  },
  {
    q: "Is this free?",
    a: "Yes, signature background removal is free to try. Sign up for free credits to process more images without watermarks.",
  },
]

const relatedTools = [
  { name: "Background Remover", href: "/tools/background-remover", description: "Remove backgrounds from any image." },
  { name: "Image to PDF", href: "/tools/image-to-pdf", description: "Add signature to a PDF document." },
  { name: "Watermark Remover", href: "/tools/watermark-remover", description: "Remove unwanted marks from documents." },
]

export default function RemoveBackgroundFromSignaturePage() {
  return (
    <ScenePageTemplate
      badge="For Documents"
      title="Signature Background Remover"
      platformName="Documents"
      heading="Remove Background from Signature"
      description="Remove background from your signature image and get a clean transparent PNG. Upload a scanned or photographed signature and use it anywhere."
      benefits={benefits}
      steps={steps}
      useCases={useCases}
      faqs={faqs}
      relatedTools={relatedTools}
    />
  )
}
