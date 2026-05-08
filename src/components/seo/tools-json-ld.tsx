import { JsonLd } from "./json-ld"

const toolsListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Online AI Image Tools",
  description: "Browse all AI-powered image tools: background remover, watermark remover, AI editor, and image to PDF converter.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Background Remover",
      url: "https://imagetoolss.com/tools/background-remover",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Watermark Remover",
      url: "https://imagetoolss.com/tools/watermark-remover",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "AI Image Editor",
      url: "https://imagetoolss.com/tools/ai-editor",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Image to PDF",
      url: "https://imagetoolss.com/tools/image-to-pdf",
    },
  ],
}

export function ToolsJsonLd() {
  return <JsonLd data={toolsListSchema} />
}
