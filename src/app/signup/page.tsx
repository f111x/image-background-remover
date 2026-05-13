import { Metadata } from "next"
import SignupClient from "./signup-client"

export const metadata: Metadata = {
  title: "Sign Up — ImageTools",
  description: "Create a free ImageTools account to get credits, save your editing history, and access subscriber features.",
  robots: { index: false, follow: false },
  other: {
    "google-ads-integration": "no",
  },
}

export default function SignupPage() {
  return <SignupClient />
}
