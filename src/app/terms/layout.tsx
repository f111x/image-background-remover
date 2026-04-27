import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ImageTools terms of service for online AI image tools.',
  alternates: { canonical: "/terms" },
}

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children
}
