"use client"

import Link from "next/link"
import { Upload, Scissors, Eraser, Wand2, FileText, Layers, Minimize2, Crop } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

const TOOLS = [
  { href: "/tools/background-remover", label: "Background Remover", icon: Scissors },
  { href: "/tools/watermark-remover", label: "Watermark Remover", icon: Eraser },
  { href: "/tools/ai-editor", label: "AI Image Editor", icon: Wand2 },
  { href: "/tools/image-to-pdf", label: "Image to PDF", icon: FileText },
  { href: "/tools/merge-images", label: "Merge Images", icon: Layers },
  { href: "/tools/compress-image", label: "Compress Image", icon: Minimize2 },
  { href: "/tools/crop-image", label: "Crop & Split", icon: Crop },
]

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5 text-purple-600" />
              <span className="font-bold text-lg">ImageTools</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Free AI-powered image tools. Remove backgrounds, erase watermarks, edit with AI, convert to PDF, and more. No signup required.
            </p>
            <div className="flex gap-3">
              <a href="/sitemap.xml" className="text-sm text-muted-foreground hover:text-primary">Sitemap</a>
              <span className="text-muted-foreground">•</span>
              <a href="/robots.txt" className="text-sm text-muted-foreground hover:text-primary">Robots</a>
            </div>
          </div>

          {/* Free Tools */}
          <div>
            <h4 className="font-semibold mb-4">Free Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {TOOLS.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="hover:text-primary flex items-center gap-1.5">
                    <tool.icon className="w-3 h-3" />
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer_product")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-primary">{t("footer_pricing")}</Link></li>
              <li><Link href="/faq" className="hover:text-primary">{t("nav_faq")}</Link></li>
              <li><Link href="/login" className="hover:text-primary">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-primary">Create Account</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer_legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">{t("footer_privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-primary">{t("footer_terms")}</Link></li>
              <li className="pt-2">
                <a href="mailto:support@imagetoolss.com" className="hover:text-primary">support@imagetoolss.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {year} ImageTools. All rights reserved.</p>
          <p>Free image tools · No signup required · No watermarks</p>
        </div>
      </div>
    </footer>
  )
}
