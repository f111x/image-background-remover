import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ImageTools privacy policy for online AI image tools and image processing.',
  alternates: { canonical: "/privacy" },
}

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children
}
