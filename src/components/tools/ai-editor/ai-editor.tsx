"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, ImageIcon, Download, Loader2, Coins, LogIn, X, Plus, Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"
import { SignInDialog } from "@/components/sign-in-dialog"
import { useLanguage } from "@/lib/i18n"

interface GeneratedImage {
  url: string
  prompt: string
  timestamp: number
}

export function AIEditor() {
  const { data: session, status } = useSession()
  const [showSignIn, setShowSignIn] = useState(false)
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [referenceFiles, setReferenceFiles] = useState<File[]>([])
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [credits, setCredits] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (session) {
      fetch("/api/user/credits")
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data) setCredits(data.credits)
        })
        .catch(() => {})
    } else {
      setCredits(null)
    }
  }, [session])

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setMainImageFile(selectedFile)

    const reader = new FileReader()
    reader.onloadend = () => {
      setMainImage(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (referenceImages.length >= 9) {
      setError("Maximum 9 reference images allowed")
      return
    }

    if (!selectedFile.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError(t("error_invalid_type"))
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(t("error_file_too_large"))
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setReferenceImages([...referenceImages, reader.result as string])
      setReferenceFiles([...referenceFiles, selectedFile])
    }
    reader.readAsDataURL(selectedFile)
  }

  const removeReferenceImage = (index: number) => {
    const newImages = [...referenceImages]
    const newFiles = [...referenceFiles]
    newImages.splice(index, 1)
    newFiles.splice(index, 1)
    setReferenceImages(newImages)
    setReferenceFiles(newFiles)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    if (status === "loading") {
      return
    }

    if (!session) {
      setShowSignIn(true)
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mainImage: mainImage,
          referenceImages: referenceImages,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (data.code === "UNAUTHORIZED") {
          setShowSignIn(true)
          setIsGenerating(false)
          return
        }
        if (data.code === "INSUFFICIENT_CREDITS") {
          setError(`${t("error_insufficient")} (Required: 2 credits)`)
          setIsGenerating(false)
          return
        }
        throw new Error(data.error || t("error_processing"))
      }

      // Add generated image to gallery
      setGeneratedImages([
        { url: data.imageUrl, prompt: prompt.trim(), timestamp: Date.now() },
        ...generatedImages
      ])

      // Update credits
      if (data.creditsRemaining) {
        setCredits(data.creditsRemaining)
      } else {
        const creditsRes = await fetch("/api/user/credits")
        if (creditsRes.ok) {
          const creditsData = await creditsRes.json()
          setCredits(creditsData.credits)
        }
      }

      // Clear prompt after successful generation
      setPrompt("")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error_processing"))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (imageUrl: string, filename?: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename || `ai-generated-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      // Fallback: open in new tab
      window.open(imageUrl, "_blank")
    }
  }

  return (
    <>
      <section id="ai-editor" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wide flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t("editor_section_start")}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">{t("editor_main_title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("editor_subtitle")}
            </p>
          </div>

          {/* Credits Display */}
          <div className="flex justify-center mb-6">
            {status === "authenticated" && credits !== null ? (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                credits >= 2
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}>
                <Coins className="w-4 h-4" />
                <span>{credits} credits available (2 credits/generation)</span>
              </div>
            ) : !session || status === "unauthenticated" ? (
              <button
                onClick={() => setShowSignIn(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition"
              >
                <LogIn className="w-4 h-4" />
                {t("login")} to use
              </button>
            ) : null}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-center py-3 px-4 rounded-lg mb-6 max-w-2xl mx-auto">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column: Input */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image Card */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="font-bold text-lg">{t("upload_image")}</h3>
                </div>

                <div className="space-y-4">
                  {/* Main Image Upload */}
                  <div>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors cursor-pointer bg-muted/30">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleMainImageUpload}
                        className="hidden"
                        id="main-image-upload"
                      />
                      <label htmlFor="main-image-upload" className="cursor-pointer">
                        {mainImage ? (
                          <img src={mainImage} alt="Main" className="w-full h-48 object-contain rounded-lg" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{t("click_or_drag")}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t("max_image_size")}</p>
                          </>
                        )}
                      </label>
                    </div>
                    {mainImage && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => { setMainImage(null); setMainImageFile(null) }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Reference Images */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t("editor_ref_image")} ({referenceImages.length}/9)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {referenceImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt={`Ref ${index + 1}`} className="w-16 h-16 object-cover rounded-lg border" />
                          <button
                            onClick={() => removeReferenceImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {referenceImages.length < 9 && (
                        <label className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition-colors">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleReferenceImageUpload}
                            className="hidden"
                          />
                          <Plus className="w-5 h-5 text-muted-foreground" />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{t("editor_batch_desc")}</p>
                  </div>

                  {/* Prompt Input */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("editor_main_prompt")}</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={t("editor_prompt_placeholder")}
                      className="w-full h-32 px-4 py-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      maxLength={2000}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{prompt.length}/2000</span>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating || status === "unauthenticated" || credits < 2}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6 rounded-xl"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        {t("editor_generating")}
                      </>
                    ) : status === "unauthenticated" ? (
                      <>
                        <LogIn className="w-6 h-6 mr-3" />
                        {t("login")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 mr-3" />
                        {t("editor_generate_btn")}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column: Output Gallery */}
            <div className="lg:col-span-1">
              <Card className="p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="font-bold text-lg">{t("editor_output_gallery")}</h3>
                </div>

                <div className="space-y-4">
                  {generatedImages.length === 0 ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">{t("editor_click_gen")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {generatedImages.map((img, index) => (
                        <div key={img.timestamp} className="relative group">
                          <div className="rounded-lg overflow-hidden border" style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px" }}>
                            <img src={img.url} alt={`Generated ${index + 1}`} className="w-full h-auto" />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDownload(img.url)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              {t("editor_download")}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <SignInDialog isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  )
}
