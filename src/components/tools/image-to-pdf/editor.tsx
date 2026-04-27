"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, ImageIcon, Download, Loader2, FileText, X, Lock, Check } from "lucide-react"
import { SignInDialog } from "@/components/sign-in-dialog"
import { useLanguage } from "@/lib/i18n"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import {
  type ImageFile,
  type PageSize,
  type Orientation,
  type ImageFit,
  type ImagesPerPage,
  type PageMargin,
  generatePDF,
  downloadPDF,
} from "@/lib/pdf-generator"

const PAGE_SIZES: { value: PageSize; label: string }[] = [
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
  { value: "legal", label: "Legal" },
]

const ORIENTATIONS: { value: Orientation; label: string }[] = [
  { value: "portrait", label: "纵向" },
  { value: "landscape", label: "横向" },
]

const IMAGES_PER_PAGE_OPTIONS: { value: ImagesPerPage; label: string }[] = [
  { value: 1, label: "1 张/页" },
  { value: 2, label: "2 张/页" },
  { value: 4, label: "4 张/页 (2×2)" },
  { value: 6, label: "6 张/页 (2×3)" },
  { value: 9, label: "9 张/页 (3×3)" },
]

const IMAGE_FIT_OPTIONS: { value: ImageFit; label: string }[] = [
  { value: "fit", label: "适应 (完整显示)" },
  { value: "fill", label: "填充 (裁切填满)" },
  { value: "center", label: "居中 (保留白边)" },
]

const MARGIN_OPTIONS: { value: PageMargin; label: string }[] = [
  { value: 0, label: "无" },
  { value: 5, label: "5mm" },
  { value: 10, label: "10mm" },
  { value: 15, label: "15mm" },
]

const MAX_FILES = 20

export function ImageToPDFEditor() {
  const { user, loading } = useSupabaseUser()
  const { t } = useLanguage()

  const [images, setImages] = useState<ImageFile[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSignIn, setShowSignIn] = useState(false)
  const [showLoginRequired, setShowLoginRequired] = useState(false)

  // Layout options
  const [pageSize, setPageSize] = useState<PageSize>("a4")
  const [orientation, setOrientation] = useState<Orientation>("portrait")
  const [imagesPerPage, setImagesPerPage] = useState<ImagesPerPage>(1)
  const [imageFit, setImageFit] = useState<ImageFit>("fit")
  const [margin, setMargin] = useState<PageMargin>(5)

  // Whether multi-image is allowed (requires login if images.length > 1)
  const multiImageAllowed = user !== null || images.length <= 1

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const remaining = MAX_FILES - images.length
    if (remaining <= 0) {
      setError(`最多只能上传 ${MAX_FILES} 张图片`)
      return
    }

    const toAdd = files.slice(0, remaining)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    const validFiles = toAdd.filter(f => {
      if (!validTypes.includes(f.type)) {
        setError(`不支持的格式: ${f.name}，请使用 JPG/PNG/WEBP/GIF`)
        return false
      }
      if (f.size > 10 * 1024 * 1024) {
        setError(`文件过大: ${f.name}，最大 10MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    Promise.all(
      validFiles.map(f => {
        return new Promise<ImageFile>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve({ file: f, preview: reader.result as string })
          }
          reader.readAsDataURL(f)
        })
      })
    ).then(newImages => {
      setImages(prev => [...prev, ...newImages])
      setError(null)
    })
  }, [images.length])

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    if (images.length === 0) {
      setError("请先上传至少一张图片")
      return
    }

    if (images.length > 1 && !user) {
      setShowLoginRequired(true)
      setShowSignIn(true)
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const blob = await generatePDF(images, {
        pageSize,
        orientation,
        imagesPerPage,
        imageFit,
        margin,
      })
      downloadPDF(blob, `imagetools-${Date.now()}.pdf`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成 PDF 失败，请重试")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const dt = new DataTransfer()
    files.forEach(f => dt.items.add(f))
    const fileInput = document.getElementById("pdf-image-upload") as HTMLInputElement
    if (fileInput) {
      // We can't set files on input directly, trigger via click would need ref
      // For now, just use the drop as a visual cue and rely on click
    }
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const isGuestWithMultiple = !user && images.length > 1

  return (
    <>
      <section id="editor" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wide flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              {t("pdf_section_tag", "Free Tool")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              {t("pdf_title", "Image to PDF")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("pdf_subtitle", "Convert your images into professional PDF documents in seconds")}
            </p>
          </div>

          {/* Login gate notice */}
          {isGuestWithMultiple && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-center py-3 px-4 rounded-lg mb-6 max-w-xl mx-auto flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>多图合并 PDF 需要登录 · <button onClick={() => setShowSignIn(true)} className="underline hover:text-yellow-300">{t("login")}</button></span>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive text-center py-3 px-4 rounded-lg mb-6 max-w-xl mx-auto">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Upload & Preview */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{t("upload_image", "上传图片")}</h3>
                {images.length > 0 && (
                  <span className="ml-auto text-sm text-muted-foreground">
                    {images.length} / {MAX_FILES} 张
                  </span>
                )}
              </div>

              {/* Upload area */}
              {images.length === 0 ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="pdf-image-upload"
                  />
                  <label htmlFor="pdf-image-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">{t("click_or_drag", "点击或拖拽上传图片")}</p>
                    <p className="text-xs text-muted-foreground">{t("supported_formats", "支持 JPG, PNG, WEBP, GIF，最大 10MB")}</p>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Thumbnail grid */}
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-4 min-h-[200px] bg-muted/20"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="pdf-image-upload"
                    />
                    <label htmlFor="pdf-image-upload" className="block cursor-pointer">
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((img, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border bg-white">
                              <img
                                src={img.preview}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                removeImage(index)
                              }}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              {index + 1}
                            </span>
                          </div>
                        ))}
                        {images.length < MAX_FILES && (
                          <div className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors">
                            <Upload className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {t("click_to_add_more", "点击或拖拽添加更多图片")}
                      </p>
                    </label>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setImages([])}
                    className="w-full"
                  >
                    {t("clear_all", "清空全部")}
                  </Button>
                </div>
              )}

              {/* Status bar */}
              {images.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  {isGuestWithMultiple ? (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Lock className="w-4 h-4" />
                      <span>{t("multi_image_login_required", "登录后可合并多张图片为 PDF")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="w-4 h-4" />
                      <span>
                        {images.length === 1
                          ? t("single_image_free", "单图免费使用，无需登录")
                          : t("multi_image_ready", `已登录 · ${images.length} 张图片将合并为一个 PDF`)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Right: Settings & Generate */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="font-bold text-lg">{t("pdf_settings", "PDF 设置")}</h3>
              </div>

              <div className="space-y-5">
                {/* Page Size */}
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("pdf_page_size", "纸张尺寸")}</label>
                  <div className="flex flex-wrap gap-2">
                    {PAGE_SIZES.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setPageSize(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          pageSize === opt.value
                            ? "bg-purple-500 text-white"
                            : "bg-muted hover:bg-muted/70 text-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orientation */}
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("pdf_orientation", "页面方向")}</label>
                  <div className="flex flex-wrap gap-2">
                    {ORIENTATIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setOrientation(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          orientation === opt.value
                            ? "bg-purple-500 text-white"
                            : "bg-muted hover:bg-muted/70 text-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Images per page */}
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("pdf_images_per_page", "每页图片数")}</label>
                  <div className="flex flex-wrap gap-2">
                    {IMAGES_PER_PAGE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setImagesPerPage(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          imagesPerPage === opt.value
                            ? "bg-purple-500 text-white"
                            : "bg-muted hover:bg-muted/70 text-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image fit */}
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("pdf_image_fit", "图片填充方式")}</label>
                  <div className="flex flex-wrap gap-2">
                    {IMAGE_FIT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setImageFit(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          imageFit === opt.value
                            ? "bg-purple-500 text-white"
                            : "bg-muted hover:bg-muted/70 text-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Margin */}
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("pdf_margin", "页边距")}</label>
                  <div className="flex flex-wrap gap-2">
                    {MARGIN_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setMargin(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          margin === opt.value
                            ? "bg-purple-500 text-white"
                            : "bg-muted hover:bg-muted/70 text-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={images.length === 0 || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6 rounded-xl mt-4"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      {t("generating_pdf", "正在生成 PDF...")}
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6 mr-3" />
                      {t("generate_pdf", "生成 PDF")}
                      {images.length > 0 && (
                        <span className="ml-2 text-sm opacity-75">
                          ({images.length} {images.length === 1 ? "张图" : `张图 / ${Math.ceil(images.length / imagesPerPage)} 页`})
                        </span>
                      )}
                    </>
                  )}
                </Button>

                {/* Free notice */}
                {images.length > 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    {t("pdf_free_note", "PDF 生成完全免费，无需积分 · 无水印")}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <SignInDialog isOpen={showSignIn} onClose={() => { setShowSignIn(false); setShowLoginRequired(false) }} />
    </>
  )
}
