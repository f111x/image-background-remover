"use client"

import { track } from "@vercel/analytics"

export const analytics = {
  backgroundRemover: {
    upload: () => track("background_remover_upload"),
    success: (metadata?: { creditsUsed?: number }) =>
      track("background_remover_success", metadata),
    download: () => track("background_remover_download"),
  },
  watermarkRemover: {
    upload: () => track("watermark_remover_upload"),
    success: (metadata?: { creditsUsed?: number }) =>
      track("watermark_remover_success", metadata),
  },
  aiEditor: {
    generate: () => track("ai_editor_generate"),
    success: (metadata?: { creditsUsed?: number }) =>
      track("ai_editor_success", metadata),
  },
  imageToPdf: {
    convert: () => track("image_to_pdf_convert"),
    success: () => track("image_to_pdf_success"),
  },
  pricing: {
    view: () => track("pricing_view"),
    checkoutClick: (metadata?: { plan?: string }) =>
      track("checkout_click", metadata),
    purchaseSuccess: (metadata?: { plan?: string; credits?: number }) =>
      track("purchase_success", metadata),
  },
}
