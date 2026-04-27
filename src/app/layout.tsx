import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { PayPalProvider } from "@/components/paypal/PayPalProvider"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  metadataBase: new URL("https://imagetoolss.com"),
  title: {
    default: "ImageTools - Free AI Image Tools Online",
    template: "%s | ImageTools",
  },
  description: "Free online AI image tools to remove backgrounds, remove watermarks, edit images with AI, and convert images to PDF in seconds.",
  keywords: ["AI image tools", "background remover", "watermark remover", "AI image editor", "image to PDF", "JPG to PDF"],
  authors: [{ name: "ImageTools" }],
  creator: "ImageTools",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imagetoolss.com",
    siteName: "ImageTools",
    title: "ImageTools - Free AI Image Tools Online",
    description: "Remove backgrounds, clean up images, edit photos with AI, and convert images to PDF online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageTools - Free AI Image Tools Online",
    description: "Remove backgrounds, clean up images, edit photos with AI, and convert images to PDF online.",
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
