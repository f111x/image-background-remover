import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { PayPalProvider } from "@/components/paypal/PayPalProvider"
import { Analytics } from "@vercel/analytics/next"
import { GlobalJsonLd } from "@/components/seo/global-json-ld"

export const metadata: Metadata = {
  metadataBase: new URL("https://imagetoolss.com"),
  title: {
    default: "ImageTools - Free AI Image Tools Online",
    template: "%s",
  },
  description: "Free AI-powered image tools online. Remove backgrounds, clean watermarks, edit photos with AI prompts, and convert images to PDF. No signup required. Start with 2 free credits.",
  keywords: ["AI image tools", "background removal", "watermark remover", "AI editor", "image to PDF", "free image editing"],
  authors: [{ name: "ImageTools" }],
  creator: "ImageTools",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imagetoolss.com",
    siteName: "ImageTools",
    title: "ImageTools - Free AI Image Tools Online",
    description: "Remove backgrounds, clean watermarks, edit photos with AI, and convert images to PDF — all in one browser-based image toolkit.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageTools - Free AI Image Tools Online",
    description: "Remove backgrounds, clean watermarks, edit photos with AI, and convert images to PDF — all in one browser-based image toolkit.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <GlobalJsonLd />
        <Providers>
          <PayPalProvider>
            {children}
          </PayPalProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
