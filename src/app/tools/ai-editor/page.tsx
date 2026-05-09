import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { AIEditor } from "@/components/tools/ai-editor/ai-editor"
import { ToolMarketingSections } from "@/components/seo/tool-marketing-sections"

export const metadata: Metadata = {
  title: "AI Image Editor Online Free | ImageTools",
  description: "Edit photos with natural language AI prompts. Remove objects, change backgrounds, or transform images with text commands. Upload any image and describe what you want — AI handles the rest.",
  alternates: { canonical: "https://imagetoolss.com/tools/ai-editor" },
  openGraph: {
    title: "AI Image Editor — Edit Photos with Natural Language | ImageTools",
    description: "",
    url: "https://imagetoolss.com/tools/ai-editor",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Editor — Edit Photos with Natural Language | ImageTools",
  },

  keywords: ["AI image editor", "photo editor", "AI edit", "remove objects", "change background AI"],
}

export default function AIEditorPage() {
  return (
    <Layout>
      <h1 className="sr-only">AI Image Editor Online Free</h1>

      <AIEditor />

      <ToolMarketingSections
        title="AI Image Editor"
        description="Edit photos with natural language. Tell the AI what you want to change — remove objects, swap backgrounds, adjust colors, or apply creative effects."
        features={[
          "Natural language photo editing",
          "Reference image support (up to 9 images)",
          "Remove or replace backgrounds",
          "Object removal with AI",
          "Color and style adjustments",
          "Creative transformations",
        ]}
        useCases={[
          "Remove unwanted objects from photos",
          "Change photo background",
          "Adjust colors and lighting",
          "Apply artistic styles",
          "Product photo enhancements",
        ]}
        faqs={[
          {
            q: "What can I do with the AI Image Editor?",
            a: "You can remove objects, change backgrounds, adjust colors, apply effects, and make natural edits — all by describing what you want in plain English.",
          },
          {
            q: "How does reference image work?",
            a: "You can upload up to 9 reference images to guide the AI's style and output. The AI will use these as style references for your edit.",
          },
          {
            q: "Is there a free trial?",
            a: "Yes. Guest users can try the AI editor with limited credits. Sign up to get more free credits.",
          },
          {
            q: "What image formats are supported?",
            a: "We support JPG, PNG, and WEBP images up to 10MB in size.",
          },
        ]}
        relatedTools={[
          {
            name: "Background Remover",
            href: "/tools/background-remover",
            description: "Remove backgrounds from images instantly with AI.",
          },
          {
            name: "Watermark Remover",
            href: "/tools/watermark-remover",
            description: "Remove watermarks, text, or unwanted objects from images.",
          },
          {
            name: "Image to PDF",
            href: "/tools/image-to-pdf",
            description: "Convert images into professional PDF documents.",
          },
        ]}
      />
    </Layout>
  )
}
