"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Upload, Crop, Download, Loader2, Grid, ArrowUpDown, Check,
  FileArchive, AlertCircle, X
} from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { cropImage, downloadSlice, downloadAllAsZip, type CropMode, type CropDirection } from "@/lib/crop-image"
import { analytics } from "@/lib/analytics"

const MODE_OPTIONS: { value: CropMode; label: string; desc: string }[] = [
  { value: 3, label: "3 张", desc: "3 slices" },
  { value: 6, label: "6 张", desc: "6 slices" },
  { value: 9, label: "9 张", desc: "9 slices" },
]

const DIR_OPTIONS: { value: CropDirection; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "horizontal", label: "横切", icon: <ArrowUpDown className="w-4 h-4 rotate-90" />, desc: "Cut into horizontal strips" },
  { value: "vertical", label: "竖切", icon: <ArrowUpDown className="w-4 h-4" />, desc: "Cut into vertical strips" },
]

export function CropImageEditor() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [slices, setSlices] = useState<{ blob: Blob; url: string; index: number; label: string }[]>([])

  // Options
  const [mode, setMode] = useState<CropMode>(3)
  const [direction, setDirection] = useState<CropDirection>("horizontal")

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(selectedFile.type)) {
      setError("不支持的格式，请使用 JPG、PNG 或 WEBP")
      return
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("文件过大，最大支持 20MB")
      return
    }

    setError(null)
    setFile(selectedFile)
    setSlices([])
    setProgress(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
      analytics.cropImage.upload?.()
    }
    reader.readAsDataURL(selectedFile)
  }, [])

  const handleCrop = async () => {
    if (!file) {
      setError("请先上传图片")
      return
    }

    setIsCropping(true)
    setError(null)
    setProgress(0)
    analytics.cropImage.crop?.()

    try {
      const result = await cropImage(file, mode, direction, (p) => setProgress(p))
      setSlices(result.slices)
      analytics.cropImage.success?.()
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "裁剪失败，请重试")
    } finally {
      setIsCropping(false)
      setProgress(null)
    }
  }

  const handleDownloadOne = (slice: typeof slices[0]) => {
    analytics.cropImage.download?.()
    downloadSlice(slice)
  }

  const handleDownloadAllZip = async () => {
    if (slices.length === 0) return
    analytics.cropImage.download?.()
    try {
      await downloadAllAsZip(slices)
    } catch (err) {
      // fallback: download one by one
      for (const slice of slices) {
        downloadSlice(slice)
        await new Promise((r) => setTimeout(r, 300))
      }
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setSlices([])
    setError(null)
    setProgress(null)
  }

  return (
    <section id="editor" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide flex items-center justify-center gap-2">
            <Crop className="w-4 h-4" />
            {t("crop_section_tag", "Free Tool")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            {t("crop_title", "Crop & Split Image")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("crop_subtitle", "Split one image into multiple slices. Choose 3, 6, or 9 slices with horizontal or vertical cuts.")}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-center py-3 px-4 rounded-lg mb-6 max-w-xl mx-auto flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
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
            </div>

            {preview ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 p-4">
                  <img
                    src={preview}
                    alt="Original"
                    className="w-full h-auto max-h-80 object-contain rounded-lg"
                  />
                  {/* Overlay slices preview */}
                  {slices.length > 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {direction === "horizontal"
                        ? Array.from({ length: mode }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute left-0 right-0 border border-dashed border-white/60"
                              style={{
                                top: `${(i / mode) * 100}%`,
                                height: `${100 / mode}%`,
                              }}
                            >
                              <span className="absolute top-1 left-2 text-white text-xs bg-black/60 px-1 rounded">
                                {i + 1}
                              </span>
                            </div>
                          ))
                        : Array.from({ length: mode }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute top-0 bottom-0 border border-dashed border-white/60"
                              style={{
                                left: `${(i / mode) * 100}%`,
                                width: `${100 / mode}%`,
                              }}
                            >
                              <span className="absolute top-1 left-1 text-white text-xs bg-black/60 px-1 rounded">
                                {i + 1}
                              </span>
                            </div>
                          ))}
                    </div>
                  )}
                </div>
                {file && (
                  <div className="text-sm text-muted-foreground text-center">
                    {file.name} · {(file.size / 1024).toFixed(1)} KB
                  </div>
                )}
                <Button variant="outline" onClick={handleReset} className="w-full">
                  <X className="w-4 h-4 mr-2" />
                  {t("reset", "重置")}
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="crop-image-upload"
                />
                <label htmlFor="crop-image-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("click_or_drag", "点击或拖拽上传图片")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("crop_formats", "支持 JPG, PNG, WEBP，最大 20MB")}
                  </p>
                </label>
              </div>
            )}
          </Card>

          {/* Right: Settings & Result */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Crop className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-bold text-lg">{t("crop_settings", "裁剪设置")}</h3>
            </div>

            <div className="space-y-6">
              {/* Slice count */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("crop_slice_count", "切分数量")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {MODE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMode(opt.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        mode === opt.value
                          ? "bg-orange-500 text-white"
                          : "bg-muted hover:bg-muted/70 text-muted-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direction */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("crop_direction", "切分方向")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDirection(opt.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        direction === opt.value
                          ? "bg-orange-500 text-white"
                          : "bg-muted hover:bg-muted/70 text-muted-foreground"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {direction === "horizontal"
                    ? "沿水平方向切，分为上下若干条"
                    : "沿垂直方向切，分为左右若干条"}
                </p>
              </div>

              {/* Crop button */}
              <Button
                onClick={handleCrop}
                disabled={!file || isCropping}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg py-6 rounded-xl"
              >
                {isCropping ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    {t("cropping", "正在裁剪...")}
                    {progress !== null && (
                      <span className="ml-2 text-sm opacity-75">{progress}%</span>
                    )}
                  </>
                ) : (
                  <>
                    <Crop className="w-6 h-6 mr-3" />
                    {t("crop_image", "裁剪图片")}
                    {file && (
                      <span className="ml-2 text-sm opacity-75">
                        → {mode} 张{direction === "horizontal" ? "横条" : "竖条"}
                      </span>
                    )}
                  </>
                )}
              </Button>

              {/* Progress bar */}
              {isCropping && progress !== null && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Slice previews */}
              {slices.length > 0 && (
                <>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        {t("crop_result", "裁剪结果")} — {slices.length} 张
                      </span>
                    </div>
                    <div className={`grid gap-2 ${direction === "horizontal" ? "grid-cols-1" : "grid-cols-3"}`}>
                      {slices.map((slice) => (
                        <div key={slice.index} className="relative group">
                          <img
                            src={slice.url}
                            alt={slice.label}
                            className={`w-full object-contain rounded border bg-white ${
                              direction === "horizontal" ? "h-16" : "aspect-square"
                            }`}
                          />
                          <button
                            onClick={() => handleDownloadOne(slice)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded"
                          >
                            <Download className="w-5 h-5 text-white" />
                          </button>
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-0.5">
                            {slice.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Download all as zip */}
                  <Button
                    onClick={handleDownloadAllZip}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg"
                  >
                    <FileArchive className="w-5 h-5 mr-2" />
                    {t("download_all_zip", "下载所有切片 (ZIP)")}
                  </Button>
                </>
              )}

              <p className="text-xs text-center text-muted-foreground">
                {t("crop_free_note", "图片裁剪完全免费，无需积分 · 无水印 · PNG 输出")}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
