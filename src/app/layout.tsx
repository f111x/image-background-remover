import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { PayPalProvider } from "@/components/paypal/PayPalProvider"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: {
    default: "ImageTools - Remove Image Background",
    template: "%s | ImageTools",
  },
  description: "AI-powered background removal. Upload your image and get a transparent background in seconds. Start with 2 free credits.",
  keywords: ["background removal", "AI", "image editing", "transparent background", "remove background"],
  authors: [{ name: "ImageTools" }],
  creator: "ImageTools",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imagetoolss.com",
    siteName: "ImageTools",
    title: "ImageTools - Remove Image Background",
    description: "AI-powered background removal. Upload your image and get a transparent background in seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageTools - Remove Image Background",
    description: "AI-powered background removal. Upload your image and get a transparent background in seconds.",
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
