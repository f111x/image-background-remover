import { Metadata } from "next"
import SignupClient from "./signup-client"

export const metadata: Metadata = {
  title: "Sign Up — ImageTools",
  description: "Create a free ImageTools account to get credits, save your editing history, and access subscriber features.",
  alternates: { canonical: "https://imagetoolss.com/signup" },
  openGraph: {
    title: "Sign Up — ImageTools",
    description: "Create a free ImageTools account to get credits and save your editing history.",
    url: "https://imagetoolss.com/signup",
    siteName: "ImageTools",
    locale: "en_US",
    type: "website",
  },
}

export default function SignupPage() {
  return <SignupClient />
}
