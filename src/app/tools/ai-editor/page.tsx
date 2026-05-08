import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { AIEditor } from "@/components/tools/ai-editor/ai-editor"

export const metadata: Metadata = {
  title: "AI Image Editor Online Free | ImageTools",
  description: "Edit photos with natural language AI prompts. Remove objects, change backgrounds, or transform images with text commands. Upload any image and describe what you want — AI handles the rest.",
  keywords: ["AI image editor", "photo editor", "AI edit", "remove objects", "change background AI"],
}

export default function AIEditorPage() {
  return (
    <Layout>
      <AIEditor />
    </Layout>
  )
}
