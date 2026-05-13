import { Metadata } from "next"
import { Layout } from "@/components/layout"
import { BackgroundRemoverEditor } from "@/components/tools/background-remover/editor"
import { ToolMarketingSections } from "@/components/seo/tool-marketing-sections"
import { ToolJsonLd } from "@/components/seo/tool-json-ld"

export const metadata: Metadata = {
  title: "Remove Image Background Online Free | ImageTools",
  description: "Use AI to remove image backgrounds and get transparent PNGs in seconds. Upload JPG, PNG, or WEBP images and download results instantly. No signup required.",
  alternates: { canonical: "https://imagetoolss.com/tools/background-remover" },
  openGraph: {
    title: "Remove Image Background Online Free | ImageTools",
    description: "Use AI to remove image backgrounds and get transparent PNGs in seconds. Upload JPG, PNG, or WEBP images and download results instantly. No signup required.",
    url: "https://imagetoolss.com/tools/background-remover",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Image Background Online Free | ImageTools",
  },

  keywords: ["remove background", "background remover", "transparent background", "AI background removal", "remove bg"],
}

export default function BackgroundRemoverPage() {
  return (
    <Layout>
      <ToolJsonLd tool="background-remover" />
      {/* Page-level H1 */}
      <h1 className="sr-only">AI 一键去除图片背景，几秒生成透明 PNG</h1>

      <BackgroundRemoverEditor />

      <ToolMarketingSections
        title="去背景工具"
        description="用 AI 快速去除任意图片背景，生成适合商品图、头像、Logo 和社媒素材的透明 PNG。"
        features={[
          "一键 AI 去除背景",
          "支持 JPG、PNG、WEBP，最大 10MB",
          "导出透明 PNG",
          "游客可试用，登录送 2 积分",
          "高质量保留边缘细节",
          "适合商品图和批量工作流",
        ]}
        useCases={[
          "电商商品图",
          "头像与个人资料图",
          "Logo 与品牌素材",
          "社交媒体配图",
          "演示文稿与文档",
        ]}
        faqs={[
          {
            q: "支持哪些图片格式？",
            a: "支持 JPG、PNG、WEBP，单张图片最大 10MB。",
          },
          {
            q: "图片会被保存吗？",
            a: "不会。图片仅用于本次处理，结果生成后即可下载。",
          },
          {
            q: "需要注册才能使用吗？",
            a: "游客可以直接试用；登录后可领取 2 个免费积分，并下载无水印结果。",
          },
          {
            q: "积分如何计算？",
            a: "背景去除按 1 积分处理 1 张图片，处理成功后才扣除积分。",
          },
        ]}
        relatedTools={[
          {
            name: "去水印",
            href: "/tools/watermark-remover",
            description: "去除图片中的水印、文字或不需要的物体。",
          },
          {
            name: "AI 编辑",
            href: "/tools/ai-editor",
            description: "用自然语言提示词编辑和生成图片。",
          },
          {
            name: "图片转 PDF",
            href: "/tools/image-to-pdf",
            description: "将多张图片快速转换成 PDF 文档。",
          },
        ]}
      />
    </Layout>
  )
}
