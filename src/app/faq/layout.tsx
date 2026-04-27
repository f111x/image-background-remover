import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'ImageTools FAQ',
  description: 'Frequently asked questions about ImageTools, credits, image privacy, payments, supported formats, and account usage.',
  alternates: { canonical: "/faq" },
}

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children
}
