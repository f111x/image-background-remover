import { Metadata } from "next"
import LoginClient from "./login-client"

export const metadata: Metadata = {
  title: "Sign In — ImageTools",
  description: "Sign in to your ImageTools account to access credits, history, and subscriber features.",
  robots: { index: false, follow: false },
  other: {
    "google-ads-integration": "no",
  },
}

export { LoginClient as default }
