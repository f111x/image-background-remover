import { JsonLd } from "./json-ld"

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does background removal work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI automatically detects the subject in your image and removes the background. You can then download the result as a transparent PNG.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We support JPG, PNG, and WEBP images up to 10MB in size.",
      },
    },
    {
      "@type": "Question",
      name: "Is my image data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Your images are processed and never stored on our servers. All processing happens in memory and the result is delivered directly to you.",
      },
    },
    {
      "@type": "Question",
      name: "How are credits calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "One credit is consumed per image processed. Credits are deducted after successful processing.",
      },
    },
  ],
}

export function FAQJsonLd() {
  return <JsonLd data={faqSchema} />
}
