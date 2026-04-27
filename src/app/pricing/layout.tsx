import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Pricing and Credits',
  description: 'Choose ImageTools credit packages and subscriptions for background removal, watermark cleanup, AI editing, and high-quality downloads.',
  alternates: { canonical: "/pricing" },
}

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children
}
