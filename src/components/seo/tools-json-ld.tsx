import { JsonLd } from "./json-ld"

const toolsListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Online AI Image Tools — ImageTools",
  description: "7 free AI-powered image tools: background remover, watermark remover, AI editor, image to PDF, merge images, compress image, and crop/split image. No signup required.",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Background Remover", url: "https://imagetoolss.com/tools/background-remover" },
    { "@type": "ListItem", position: 2, name: "Watermark Remover", url: "https://imagetoolss.com/tools/watermark-remover" },
    { "@type": "ListItem", position: 3, name: "AI Image Editor", url: "https://imagetoolss.com/tools/ai-editor" },
    { "@type": "ListItem", position: 4, name: "Image to PDF", url: "https://imagetoolss.com/tools/image-to-pdf" },
    { "@type": "ListItem", position: 5, name: "Merge Images", url: "https://imagetoolss.com/tools/merge-images" },
    { "@type": "ListItem", position: 6, name: "Compress Image", url: "https://imagetoolss.com/tools/compress-image" },
    { "@type": "ListItem", position: 7, name: "Crop & Split Image", url: "https://imagetoolss.com/tools/crop-image" },
  ],
}

export function ToolsJsonLd() {
  return <JsonLd data={toolsListSchema} />
}
