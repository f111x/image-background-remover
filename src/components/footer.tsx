"use client"

import Link from "next/link"
import { Upload } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5" />
              <span className="font-bold text-lg">ImageTools</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("footer_desc")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer_product")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-primary">{t("footer_pricing")}</Link></li>
              <li><Link href="/faq" className="hover:text-primary">{t("nav_faq")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer_legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">{t("footer_privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-primary">{t("footer_terms")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer_contact")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:support@imagetoolss.com" className="hover:text-primary">support@imagetoolss.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 ImageTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
