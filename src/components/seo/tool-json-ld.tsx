import { JsonLd } from "./json-ld"

interface ToolJsonLdProps {
  name: string
  description: string
  url: string
  category?: string
}

const TOOL_SCHEMAS: Record<string, ToolJsonLdProps> = {
  "background-remover": {
    name: "Background Remover — Free AI Tool | ImageTools",
    description: "Remove image backgrounds instantly with AI. Get transparent PNGs in seconds. Supports JPG, PNG, WEBP up to 10MB. Free to use, no signup required.",
    url: "https://imagetoolss.com/tools/background-remover",
    category: "Image Editing",
  },
  "watermark-remover": {
    name: "Watermark Remover — Remove Text & Objects Online | ImageTools",
    description: "Remove watermarks, text, logos, or unwanted objects from photos. AI-powered inpainting fills in the removed area naturally.",
    url: "https://imagetoolss.com/tools/watermark-remover",
    category: "Image Editing",
  },
  "ai-editor": {
    name: "AI Image Editor — Edit Photos with Text | ImageTools",
    description: "Edit photos using natural language AI prompts. Remove objects, change backgrounds, or transform images with text commands. Describe what you want and AI handles the rest.",
    url: "https://imagetoolss.com/tools/ai-editor",
    category: "Image Editing",
  },
  "image-to-pdf": {
    name: "Image to PDF Converter — Free Online | ImageTools",
    description: "Convert JPG, PNG, WEBP, or GIF images into professional PDF documents. Merge up to 20 images into one PDF. Free, no signup required.",
    url: "https://imagetoolss.com/tools/image-to-pdf",
    category: "Document Conversion",
  },
  "merge-images": {
    name: "Merge Images — Combine Photos Online Free | ImageTools",
    description: "Merge 2 to 9 images into one. Grid, horizontal, or vertical layouts. Supports JPG, PNG, WEBP. Adjustable spacing and background. Free, no watermarks.",
    url: "https://imagetoolss.com/tools/merge-images",
    category: "Image Editing",
  },
  "compress-image": {
    name: "Compress Image — Reduce File Size Online Free | ImageTools",
    description: "Reduce image file size without losing quality. Adjust compression from 10% to 100%. Supports JPG, PNG, WEBP output. Free to use, instant results.",
    url: "https://imagetoolss.com/tools/compress-image",
    category: "Image Optimization",
  },
  "crop-image": {
    name: "Crop & Split Image — Divide Photos into Slices | ImageTools",
    description: "Split one image into 3, 6, or 9 equal slices. Horizontal or vertical cuts. Download individual slices or all as ZIP. Free, no watermarks, PNG output.",
    url: "https://imagetoolss.com/tools/crop-image",
    category: "Image Editing",
  },
}

export function ToolJsonLd({ tool }: { tool: string }) {
  const config = TOOL_SCHEMAS[tool]
  if (!config) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.name,
    description: config.description,
    url: config.url,
    applicationCategory: config.category,
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      name: "ImageTools",
      url: "https://imagetoolss.com",
    },
  }

  return <JsonLd data={schema} />
}
