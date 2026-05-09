"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Upload, ImageIcon, Download, Loader2, X, Layers, Grid, ArrowLeftRight,
  Type, Check
} from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { mergeImages, downloadMerge, type MergeImage, type LayoutDirection, type BackgroundColor } from "@/lib/merge-images"
import { analytics } from "@/lib/analytics"

const MAX_FILES = 9

const DIRECTION_OPTIONS: { value: LayoutDirection; label: string; icon: React.ReactNode }[] = [
  { value: "grid", label: "网格", icon: <Grid className="w-4 h-4" /> },
  { value: "horizontal", label: "横向", icon: <ArrowLeftRight className="w-4 h-4 rotate-90" /> },
  { value: "vertical", label: "纵向", icon: <ArrowLeftRight className="w-4 h-4" /> },
]

const BG_OPTIONS: { value: BackgroundColor; label: string }[] = [
  { value: "white", label: "白色" },
  { value: "black", label: "黑色" },
  { value: "transparent", label: "透明" },
]

export function MergeImagesEditor() {
  const { t } = useLanguage()
  const [images, setImages] = useState<MergeImage[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  // Options
  const [direction, setDirection] = useState<LayoutDirection>("grid")
  const [gap, setGap] = useState<number>(4)
  const [bgColor, setBgColor] = useState<BackgroundColor>("white")

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const remaining = MAX_FILES - images.length
    if (remaining <= 0) {
      setError(`最多只能合并 ${MAX_FILES} 张图片`)
      return
    }

    const toAdd = files.slice(0, remaining)
    const validTypes = ["image/jpeg", "image/png", "image/webp"]

    const validFiles = toAdd.filter((f) => {
      if (!validTypes.includes(f.type)) {
        setError(`不支持的格式: ${f.name}，请使用 JPG/PNG/WEBP`)
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
      validFiles.map((f) => {
        return new Promise<MergeImage>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve({ file: f, preview: reader.result as string })
          reader.readAsDataURL(f)
        })
      })
    ).then((newImages) => {
      setImages((prev) => [...prev, ...newImages])
      setError(null)
      setResultBlob(null)
      setResultUrl(null)
      analytics.mergeImages.upload?.()
    })
  }, [images.length])

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setResultBlob(null)
    setResultUrl(null)
  }

  const handleMerge = async () => {
    if (images.length < 2) {
      setError("请至少上传 2 张图片")
      return
    }

    setIsMerging(true)
    setError(null)
    setProgress(0)
    analytics.mergeImages.convert?.()

    try {
      const blob = await mergeImages(images, {
        direction,
        gap,
        bgColor,
        maxWidth: 4096,
        maxHeight: 4096,
      }, (p) => setProgress(p))

      setResultBlob(blob)
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      analytics.mergeImages.success?.()
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "合并失败，请重试")
    } finally {
      setIsMerging(false)
      setProgress(null)
    }
  }

  const handleDownload = () => {
    if (!resultBlob) return
    analytics.mergeImages.download?.()
    downloadMerge(resultBlob, `merged-${Date.now()}.png`)
  }

  const handleReset = () => {
    setImages([])
    setResultBlob(null)
    setResultUrl(null)
    setError(null)
    setProgress(null)
  }

  return (
    <section id="editor" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide flex items-center justify-center gap-2">
            <Layers className="w-4 h-4" />
            {t("merge_section_tag", "Free Tool")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            {t("merge_title", "Merge Images")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("merge_subtitle", "Combine multiple images into one. Supports up to 9 images in grid, horizontal, or vertical layout.")}
          </p>
        </div>

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
              <h3 className="font-bold text-lg">{t("upload_images", "上传图片")}</h3>
              {images.length > 0 && (
                <span className="ml-auto text-sm text-muted-foreground">
                  {images.length} / {MAX_FILES} 张
                </span>
              )}
            </div>

            {/* Upload area */}
            {images.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="merge-image-upload"
                />
                <label htmlFor="merge-image-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("click_or_drag_multi", "点击或拖拽上传多张图片")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("merge_formats", "支持 JPG, PNG, WEBP，最多 9 张")}
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-4 min-h-[200px] bg-muted/20">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="merge-image-upload"
                  />
                  <label htmlFor="merge-image-upload" className="block cursor-pointer">
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

                <Button variant="outline" onClick={handleReset} className="w-full">
                  {t("clear_all", "清空全部")}
                </Button>
              </div>
            )}

            {/* Status bar */}
            {images.length > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="w-4 h-4" />
                  <span>
                    {images.length < 2
                      ? t("merge_min_hint", `还需要 ${2 - images.length} 张图片`)
                      : t("merge_ready", `${images.length} 张图片就绪，可立即合并`)}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Right: Settings & Result */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="font-bold text-lg">{t("merge_settings", "合并设置")}</h3>
            </div>

            <div className="space-y-5">
              {/* Direction */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t("merge_layout", "布局方向")}</label>
                <div className="flex flex-wrap gap-2">
                  {DIRECTION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDirection(opt.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        direction === opt.value
                          ? "bg-purple-500 text-white"
                          : "bg-muted hover:bg-muted/70 text-muted-foreground"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gap */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("merge_gap", "图片间距")} — {gap}px
                </label>
                <Slider
                  value={[gap]}
                  onValueChange={([v]) => setGap(v)}
                  min={0}
                  max={20}
                  step={1}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0px</span>
                  <span>20px</span>
                </div>
              </div>

              {/* Background */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t("merge_bg", "背景颜色")}</label>
                <div className="flex flex-wrap gap-2">
                  {BG_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBgColor(opt.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        bgColor === opt.value
                          ? "bg-purple-500 text-white"
                          : "bg-muted hover:bg-muted/70 text-muted-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Merge Button */}
              <Button
                onClick={handleMerge}
                disabled={images.length < 2 || isMerging}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6 rounded-xl mt-4"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    {t("merging", "正在合并...")}
                    {progress !== null && (
                      <span className="ml-2 text-sm opacity-75">{progress}%</span>
                    )}
                  </>
                ) : (
                  <>
                    <Layers className="w-6 h-6 mr-3" />
                    {t("merge_images", "合并图片")}
                    {images.length >= 2 && (
                      <span className="ml-2 text-sm opacity-75">
                        ({images.length} 张)
                      </span>
                    )}
                  </>
                )}
              </Button>

              {/* Download button */}
              {resultUrl && (
                <>
                  <div className="border-2 border-dashed border-border rounded-lg aspect-square bg-muted/30 overflow-hidden flex items-center justify-center">
                    <img
                      src={resultUrl}
                      alt="Merged result"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {t("download_result", "下载合并结果")}
                  </Button>
                </>
              )}

              <p className="text-xs text-center text-muted-foreground">
                {t("merge_free_note", "图片合并完全免费，无需积分 · 无水印 · PNG输出")}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
