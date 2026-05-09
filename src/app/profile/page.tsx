import { Metadata } from "next"
import ProfileClient from "./profile-client"

export const metadata: Metadata = {
  title: "My Profile — ImageTools",
  description: "View your credits, usage history, and subscription details.",
  robots: { index: false, follow: false },
}

export default function ProfilePage() {
  return <ProfileClient />
}
