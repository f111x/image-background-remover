"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Upload, ImageIcon, Download, Loader2, Minimize2, Check, AlertCircle
} from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { compressImage, downloadCompressed, formatBytes } from "@/lib/compress-image"
import { analytics } from "@/lib/analytics"

const MIN_QUALITY = 10
const MAX_QUALITY = 100
const DEFAULT_QUALITY = 80

const FORMAT_OPTIONS: { value: "image/jpeg" | "image/png" | "image/webp"; label: string }[] = [
  { value: "image/jpeg", label: "JPG（推荐）" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WEBP" },
]

export function CompressImageEditor() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [compressedResult, setCompressedResult] = useState<{
    compressedUrl: string
    originalSize: number
    compressedSize: number
    quality: number
  } | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quality, setQuality] = useState<number>(DEFAULT_QUALITY)
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg")
  const [liveSize, setLiveSize] = useState<number | null>(null)

  // Live preview: estimate compressed size without full recompress
  useEffect(() => {
    if (!file) { setLiveSize(null); return }
    // Estimate based on quality
    const estimated = Math.round(file.size * (quality / 100) * 0.85)
    setLiveSize(Math.max(estimated, 1024)) // minimum 1KB
  }, [quality, file])

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
    setCompressedResult(null)
    setLiveSize(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
      analytics.compressImage.upload?.()
    }
    reader.readAsDataURL(selectedFile)
  }, [])

  const handleCompress = async () => {
    if (!file) {
      setError("请先上传图片")
      return
    }

    setIsCompressing(true)
    setError(null)
    analytics.compressImage.compress?.()

    try {
      const result = await compressImage(file, quality / 100, format)
      setCompressedResult(result)
      analytics.compressImage.success?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "压缩失败，请重试")
    } finally {
      setIsCompressing(false)
    }
  }

  const handleDownload = async () => {
    if (!compressedResult) return
    analytics.compressImage.download?.()
    const blob = await fetch(compressedResult.compressedUrl).then(r => r.blob())
    const ext = format.split("/")[1]
    downloadCompressed(blob, `compressed-${Date.now()}.${ext}`)
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setCompressedResult(null)
    setError(null)
    setQuality(DEFAULT_QUALITY)
    setLiveSize(null)
  }

  const reduction = compressedResult
    ? Math.round((1 - compressedResult.compressedSize / compressedResult.originalSize) * 100)
    : liveSize && file
    ? Math.round((1 - liveSize / file.size) * 100)
    : 0

  return (
    <section id="editor" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide flex items-center justify-center gap-2">
            <Minimize2 className="w-4 h-4" />
            {t("compress_section_tag", "Free Tool")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            {t("compress_title", "Compress Image")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("compress_subtitle", "Reduce image file size without losing quality. Adjust compression level and see the result instantly.")}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-center py-3 px-4 rounded-lg mb-6 max-w-xl mx-auto flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Upload */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg">{t("upload_image", "上传图片")}</h3>
            </div>

            <div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="compress-image-upload"
                />
                <label htmlFor="compress-image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("click_or_drag", "点击或拖拽上传图片")}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("compress_formats", "支持 JPG, PNG, WEBP，最大 20MB")}</p>
                </label>
              </div>

              {preview && (
                <div className="relative mt-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 p-4">
                  <img src={preview} alt="Original" className="w-full h-auto max-h-72 object-contain rounded-lg" />
                  {file && (
                    <div className="mt-2 text-sm text-muted-foreground text-center">
                      {file.name} · {formatBytes(file.size)}
                    </div>
                  )}
                </div>
              )}

              {file && (
                <Button variant="outline" onClick={handleReset} className="w-full mt-3">
                  {t("reset", "重置")}
                </Button>
              )}
            </div>
          </Card>

          {/* Right: Settings & Result */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Minimize2 className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="font-bold text-lg">{t("compress_settings", "压缩设置")}</h3>
            </div>

            <div className="space-y-6">
              {/* Quality Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">{t("compress_quality", "压缩质量")}</label>
                  <span className="text-sm font-bold text-purple-400">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={([v]) => { setQuality(v); setCompressedResult(null) }}
                  min={MIN_QUALITY}
                  max={MAX_QUALITY}
                  step={5}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>小体积 {MIN_QUALITY}%</span>
                  <span>高画质 {MAX_QUALITY}%</span>
                </div>

                {/* Live estimate */}
                {file && liveSize && !compressedResult && (
                  <div className="mt-3 bg-muted/50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">预计压缩后</span>
                      <span className="font-medium">{formatBytes(liveSize)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">预计减少</span>
                      <span className={`font-bold ${reduction > 0 ? "text-green-400" : "text-yellow-400"}`}>
                        {reduction > 0 ? `~${reduction}%` : "~0%"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Format */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t("compress_format", "输出格式")}</label>
                <div className="flex flex-wrap gap-2">
                  {FORMAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setFormat(opt.value); setCompressedResult(null) }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        format === opt.value
                          ? "bg-green-500 text-white"
                          : "bg-muted hover:bg-muted/70 text-muted-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compress Button */}
              <Button
                onClick={handleCompress}
                disabled={!file || isCompressing}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-6 rounded-xl"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    {t("compressing", "正在压缩...")}
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-6 h-6 mr-3" />
                    {t("compress_image", "压缩图片")}
                  </>
                )}
              </Button>

              {/* Result */}
              {compressedResult && (
                <>
                  <div className="border-2 border-dashed border-border rounded-lg aspect-square bg-muted/30 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={compressedResult.compressedUrl}
                      alt="Compressed"
                      className="max-w-full max-h-full object-contain"
                    />
                    {/* Size badge */}
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {formatBytes(compressedResult.compressedSize)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">原始大小</span>
                      <span className="font-medium">{formatBytes(compressedResult.originalSize)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">压缩后</span>
                      <span className="font-medium">{formatBytes(compressedResult.compressedSize)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">减少</span>
                      <span className="font-bold text-green-400">
                        {Math.round((1 - compressedResult.compressedSize / compressedResult.originalSize) * 100)}%
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {t("download_result", "下载压缩结果")}
                  </Button>
                </>
              )}

              <p className="text-xs text-center text-muted-foreground">
                {t("compress_free_note", "图片压缩完全免费，无需积分 · 无水印 · 保留 EXIF 信息")}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
