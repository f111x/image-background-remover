import { MetadataRoute } from "next"

const baseUrl = "https://imagetoolss.com"

const coreRoutes = [
  { path: "", priority: 1, changeFrequency: "daily" as const },
  { path: "/tools", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/tools/background-remover", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/tools/watermark-remover", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/tools/ai-editor", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/tools/image-to-pdf", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
]

const seoRoutes = [
  "/remove-background",
  "/background-remover",
  "/transparent-background",
  "/watermark-remover",
  "/remove-watermark",
  "/ai-image-editor",
  "/image-to-pdf",
  "/jpg-to-pdf",
  "/product-photo-background-remover",
  "/make-product-photo-white-background",
  "/remove-background-for-shopify",
  "/remove-background-for-etsy",
  "/remove-background-for-amazon",
  "/ai-product-photo-editor",
  "/remove-background-from-logo",
  "/remove-background-from-jpg",
  "/remove-background-from-png",
  "/remove-text-from-image",
  "/remove-object-from-image",
  "/png-to-pdf",
  "/webp-to-pdf",
  "/multiple-images-to-pdf",
]

const blogRoutes = [
  "/blog",
  "/blog/how-to-remove-background-from-image",
  "/blog/how-to-remove-watermark-from-image",
  "/blog/how-to-convert-jpg-to-pdf",
  "/blog/best-ai-image-tools",
  "/blog/how-to-make-product-photos-white-background",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    ...coreRoutes.map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...seoRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...blogRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
