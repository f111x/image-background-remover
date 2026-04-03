import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { PayPalProvider } from "@/components/paypal/PayPalProvider"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "ImageTools - Remove Image Background",
  description: "AI-powered background removal. Upload your image and get a transparent background in seconds.",
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
