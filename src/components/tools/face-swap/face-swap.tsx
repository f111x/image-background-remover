"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, ImageIcon, Download, Loader2, Coins, LogIn, X, RefreshCw } from "lucide-react"
import { SignInDialog } from "@/components/sign-in-dialog"
import { useLanguage } from "@/lib/i18n"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { analytics } from "@/lib/analytics"

export function FaceSwapEditor() {
  const { user, loading } = useSupabaseUser()
  const { t } = useLanguage()
  const [showSignIn, setShowSignIn] = useState(false)
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [targetImage, setTargetImage] = useState<string | null>(null)
  const [targetFile, setTargetFile] = useState<File | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "source" | "target"
  ) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError(t("error_invalid_type"))
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(t("error_file_too_large"))
      return
    }

    setError(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      if (type === "source") {
        setSourceImage(dataUrl)
        setSourceFile(selectedFile)
        setResultImage(null)
      } else {
        setTargetImage(dataUrl)
        setTargetFile(selectedFile)
        setResultImage(null)
      }
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleProcess = async () => {
    if (!sourceImage || !targetImage) return

    if (!user) {
      setShowSignIn(true)
    }

    setIsProcessing(true)
    setError(null)
    analytics.faceSwap.generate()

    try {
      const response = await fetch("/api/face-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImage: sourceImage,
          targetImage: targetImage,
        }),
      })

      let data: Record<string, any> = {}
      if (!response.ok) {
        data = await response.json().catch(() => ({}))
        if (data.code === "UNAUTHORIZED") {
          setShowSignIn(true)
          setIsProcessing(false)
          return
        }
        if (data.code === "INSUFFICIENT_CREDITS") {
          setError(`${t("error_insufficient")} (Required: 1 credit)`)
          setIsProcessing(false)
          return
        }
        throw new Error(data.error || t("error_processing"))
      }

      data = await response.json()
      setResultImage(data.imageUrl)
      analytics.faceSwap.success()

      if (data.creditsRemaining !== undefined) {
        setCredits(data.creditsRemaining)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error_processing"))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async (imageUrl: string, filename?: string) => {
    analytics.faceSwap.download?.()
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename || `face-swap-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      window.open(imageUrl, "_blank")
    }
  }

  const canProcess = sourceImage && targetImage && !isProcessing

  return (
    <>
      <section id="face-swap" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wide flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Face Swap
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">AI Face Swap</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload a source face and a target photo — get a realistic face swap in seconds.
            </p>
          </div>

          {/* Credits / Guest Notice Display */}
          <div className="flex justify-center mb-6">
            {!loading && user && credits !== null ? (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                credits >= 1
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}>
                <Coins className="w-4 h-4" />
                <span>{credits} {t("credits_available")}</span>
              </div>
            ) : !loading && !user ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                <span>👋 Guest Mode — <button onClick={() => setShowSignIn(true)} className="underline hover:text-purple-200">{t("login")}</button> to use credits</span>
              </div>
            ) : null}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-center py-3 px-4 rounded-lg mb-6 max-w-2xl mx-auto">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Source Image (Face) */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Source Face</h3>
                  <p className="text-xs text-muted-foreground">The face you want to use</p>
                </div>
              </div>

              <div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors cursor-pointer bg-muted/30">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleImageUpload(e, "source")}
                    className="hidden"
                    id="source-image-upload"
                  />
                  <label htmlFor="source-image-upload" className="cursor-pointer">
                    {sourceImage ? (
                      <img src={sourceImage} alt="Source" className="w-full h-48 object-contain rounded-lg" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload face image</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — max 10MB</p>
                      </>
                    )}
                  </label>
                </div>
                {sourceImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => { setSourceImage(null); setSourceFile(null) }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </Card>

            {/* Target Image */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Target Photo</h3>
                  <p className="text-xs text-muted-foreground">Face will be swapped onto this image</p>
                </div>
              </div>

              <div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors cursor-pointer bg-muted/30">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleImageUpload(e, "target")}
                    className="hidden"
                    id="target-image-upload"
                  />
                  <label htmlFor="target-image-upload" className="cursor-pointer">
                    {targetImage ? (
                      <img src={targetImage} alt="Target" className="w-full h-48 object-contain rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload target photo</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — max 10MB</p>
                      </>
                    )}
                  </label>
                </div>
                {targetImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => { setTargetImage(null); setTargetFile(null) }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Process Button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleProcess}
              disabled={!canProcess}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-12 py-6 rounded-xl"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Swapping Face...
                </>
              ) : (
                <>
                  <RefreshCw className="w-6 h-6 mr-3" />
                  Swap Face
                </>
              )}
            </Button>
          </div>

          {/* Result */}
          {resultImage && (
            <div className="mt-8 text-center">
              <h3 className="font-bold text-lg mb-4">Result</h3>
              <div className="relative inline-block group">
                <div
                  className="rounded-lg overflow-hidden border inline-block"
                  style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px" }}
                >
                  <img src={resultImage} alt="Face Swap Result" className="max-w-md w-full h-auto" />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(resultImage)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {t("editor_download")}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">1 credit used</p>
            </div>
          )}
        </div>
      </section>

      <SignInDialog isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  )
}