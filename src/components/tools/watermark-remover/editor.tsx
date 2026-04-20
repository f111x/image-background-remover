"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, ImageIcon, Download, Loader2, Coins, Eraser, Undo, Trash2, ZoomIn, ZoomOut } from "lucide-react"
import { SignInDialog } from "@/components/sign-in-dialog"
import { useLanguage } from "@/lib/i18n"
import { useSupabaseUser } from "@/hooks/use-supabase-user"

export function WatermarkRemoverEditor() {
  const { user, loading } = useSupabaseUser()
  const [showSignIn, setShowSignIn] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [isSubscriber, setIsSubscriber] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(30)
  const [maskHistory, setMaskHistory] = useState<ImageData[]>([])
  const [brushMode, setBrushMode] = useState<"draw" | "erase">("draw")
  // Track if image has been uploaded and canvas is ready
  const [canvasReady, setCanvasReady] = useState(false)
  const { t } = useLanguage()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const imageCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (user) {
      fetch("/api/user/credits")
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data) {
            setCredits(data.credits)
            setIsSubscriber(data.isSubscriber ?? false)
          }
        })
        .catch(() => {})
    } else {
      setCredits(null)
      setIsSubscriber(false)
    }
  }, [user])

  // Load image onto canvas when uploaded
  useEffect(() => {
    if (uploadedImage && canvasRef.current && imageCanvasRef.current) {
      const img = new window.Image()
      img.onload = () => {
        const container = containerRef.current
        const maxWidth = container ? container.clientWidth - 48 : 600
        const maxHeight = 500
        
        let width = img.width
        let height = img.height
        
        // Scale to fit
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
        
        setCanvasSize({ width, height })
        setScale(1)
        
        // Draw on image canvas
        const imageCanvas = imageCanvasRef.current
        imageCanvas.width = width
        imageCanvas.height = height
        const imageCtx = imageCanvas.getContext("2d")
        if (imageCtx) {
          imageCtx.drawImage(img, 0, 0, width, height)
        }
        
        // Draw on main canvas (with image)
        const canvas = canvasRef.current
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
        }
        
        // Clear mask canvas
        const maskCanvas = maskCanvasRef.current
        maskCanvas.width = width
        maskCanvas.height = height
        const maskCtx = maskCanvas.getContext("2d")
        if (maskCtx) {
          maskCtx.clearRect(0, 0, width, height)
        }
        
        // Reset mask history
        setMaskHistory([])
        setCanvasReady(true)
      }
      img.src = uploadedImage
    }
  }, [uploadedImage])

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    
    const rect = canvas.getBoundingClientRect()
    let clientX: number, clientY: number
    
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    const x = (clientX - rect.left) / scale
    const y = (clientY - rect.top) / scale
    
    return { x, y }
  }, [scale])

  // Simplified draw function - handles both draw and erase modes
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, isStart: boolean) => {
    const canvas = canvasRef.current
    const maskCanvas = maskCanvasRef.current
    const imageCanvas = imageCanvasRef.current
    if (!canvas || !maskCanvas || !imageCanvas || !canvasReady) return
    
    const ctx = canvas.getContext("2d")
    const maskCtx = maskCanvas.getContext("2d")
    if (!ctx || !maskCtx) return
    
    // Get canvas coordinates with proper scaling
    const rect = canvas.getBoundingClientRect()
    const displayWidth = rect.width
    const displayHeight = rect.height
    const scaleX = canvas.width / displayWidth
    const scaleY = canvas.height / displayHeight
    
    let clientX: number, clientY: number
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    // Convert to canvas coordinates
    const canvasX = (clientX - rect.left) * scaleX
    const canvasY = (clientY - rect.top) * scaleY
    
    // Save state for undo on start
    if (isStart) {
      const currentMask = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
      setMaskHistory(prev => {
        const newHistory = [...prev, currentMask]
        return newHistory.slice(-20) // Keep max 20 states
      })
    }
    
    // Draw or erase on mask
    if (brushMode === "draw") {
      maskCtx.fillStyle = "rgba(255, 255, 255, 1)"
      maskCtx.beginPath()
      maskCtx.arc(canvasX, canvasY, brushSize, 0, Math.PI * 2)
      maskCtx.fill()
    } else {
      maskCtx.clearRect(canvasX - brushSize, canvasY - brushSize, brushSize * 2, brushSize * 2)
    }
    
    // Redraw main canvas: image + red mask overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(imageCanvas, 0, 0)
    
    // Draw semi-transparent red mask overlay
    ctx.globalCompositeOperation = "source-over"
    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    for (let i = 0; i < maskData.data.length; i += 4) {
      if (maskData.data[i + 3] > 128) { // Painted area - add red tint
        imageData.data[i] = Math.min(255, imageData.data[i] + 80)
        imageData.data[i + 1] = Math.max(0, imageData.data[i + 1] - 40)
        imageData.data[i + 2] = Math.max(0, imageData.data[i + 2] - 40)
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }, [brushMode, brushSize, canvasReady])

  const handleUndo = () => {
    const maskCanvas = maskCanvasRef.current
    const canvas = canvasRef.current
    const imageCanvas = imageCanvasRef.current
    if (!maskCanvas || !canvas || !imageCanvas) return
    
    const maskCtx = maskCanvas.getContext("2d")
    const ctx = canvas.getContext("2d")
    const imageCtx = imageCanvas.getContext("2d")
    if (!maskCtx || !ctx || !imageCtx) return
    
    if (maskHistory.length > 0) {
      const lastState = maskHistory[maskHistory.length - 1]
      maskCtx.putImageData(lastState, 0, 0)
      setMaskHistory(prev => prev.slice(0, -1))
      
      // Redraw main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(imageCanvas, 0, 0)
    }
  }

  const handleClearMask = () => {
    const maskCanvas = maskCanvasRef.current
    const canvas = canvasRef.current
    const imageCanvas = imageCanvasRef.current
    if (!maskCanvas || !canvas || !imageCanvas) return
    
    const maskCtx = maskCanvas.getContext("2d")
    const ctx = canvas.getContext("2d")
    if (!maskCtx || !ctx) return
    
    // Save for undo
    setMaskHistory(prev => [...prev, maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)])
    
    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(imageCanvas, 0, 0)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setImageFile(selectedFile)
    setResultImage(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const generateMaskFile = (): File | null => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return null
    
    // Create a clean white mask (white = areas to remove)
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = maskCanvas.width
    tempCanvas.height = maskCanvas.height
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return null
    
    // Fill with black
    tempCtx.fillStyle = "black"
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
    
    // Draw white where user painted
    tempCtx.drawImage(maskCanvas, 0, 0)
    
    return new File([tempCanvas.toBlob("image/png") as Blob], "mask.png", { type: "image/png" })
  }

  const hasMask = (): boolean => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return false
    
    const maskCtx = maskCanvas.getContext("2d")
    if (!maskCtx) return false
    
    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) return true
    }
    return false
  }

  const handleRemoveWatermark = async () => {
    if (!imageFile) {
      setError(t("error_no_image"))
      return
    }

    if (!hasMask()) {
      setError("Please paint over the watermark area first")
      return
    }

    if (loading) {
      return
    }

    if (!user) {
      setShowSignIn(true)
    }

    setIsProcessing(true)
    setError(null)
    setResultImage(null)

    try {
      const maskFile = generateMaskFile()
      if (!maskFile) {
        throw new Error("Failed to generate mask")
      }

      const formData = new FormData()
      formData.append("image_file", imageFile)
      formData.append("mask_file", maskFile)

      const response = await fetch("/api/watermark-remove", {
        method: "POST",
        body: formData,
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
          setError(t("error_insufficient"))
          setIsProcessing(false)
          return
        }
        throw new Error(data.error || t("error_processing"))
      }

      data = await response.json()
      
      if (data.success && data.imageUrl) {
        setResultImage(data.imageUrl)
        
        if (data.creditsRemaining !== "guest") {
          setCredits(data.creditsRemaining)
        }
      } else {
        throw new Error(data.error || "Failed to process image")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error_processing"))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultImage) return
    const link = document.createElement("a")
    link.href = resultImage
    link.download = `watermark-removed-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setUploadedImage(null)
    setResultImage(null)
    setImageFile(null)
    setError(null)
    setMaskHistory([])
  }

  return (
    <>
      <section id="editor" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">Watermark Remover</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">AI Watermark Removal</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload your image and paint over the watermark area to remove it with AI
            </p>
          </div>

          {/* Credits / Guest Notice Display */}
          <div className="flex justify-center mb-6">
            {!loading && user && credits !== null ? (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                credits > 0 
                  ? "bg-yellow-500/20 text-yellow-400" 
                  : "bg-red-500/20 text-red-400"
              }`}>
                <Coins className="w-4 h-4" />
                <span>{credits} credits available (1 credit/use)</span>
              </div>
            ) : !loading && !user ? (
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                <span>👋 Guest Mode — <button onClick={() => setShowSignIn(true)} className="underline hover:text-purple-200">{t("login")} to save your work</button></span>
              </div>
            ) : null}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-center py-3 px-4 rounded-lg mb-6 max-w-xl mx-auto">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload & Editor Card */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{t("upload_image")}</h3>
              </div>

              <div className="space-y-4">
                {/* Hidden canvases for image and mask storage */}
                <canvas ref={imageCanvasRef} className="hidden" />
                <canvas ref={maskCanvasRef} className="hidden" />

                {/* Upload area */}
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="watermark-image-upload"
                    />
                    <label htmlFor="watermark-image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{t("click_or_drag")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("supported_formats")}</p>
                    </label>
                  </div>
                ) : (
                  <div ref={containerRef} className="relative">
                    {/* Canvas for drawing */}
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 16px 16px" }}>
                      <canvas
                        ref={canvasRef}
                        className="max-w-full cursor-crosshair"
                        style={{ 
                          transform: `scale(${scale})`,
                          transformOrigin: 'top left',
                          width: canvasSize.width,
                          height: canvasSize.height
                        }}
                        onMouseDown={(e) => { setIsDrawing(true); draw(e, true) }}
                        onMouseMove={(e) => { if (isDrawing) draw(e, false) }}
                        onMouseUp={() => setIsDrawing(false)}
                        onMouseLeave={() => setIsDrawing(false)}
                        onTouchStart={(e) => { setIsDrawing(true); draw(e, true) }}
                        onTouchMove={(e) => { if (isDrawing) draw(e, false) }}
                        onTouchEnd={() => setIsDrawing(false)}
                      />
                    </div>
                    
                    {/* Drawing controls */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Button
                        size="sm"
                        variant={brushMode === "draw" ? "default" : "outline"}
                        onClick={() => setBrushMode("draw")}
                        className={brushMode === "draw" ? "bg-red-500 hover:bg-red-600" : ""}
                      >
                        <Eraser className="w-4 h-4 mr-1" />
                        Paint
                      </Button>
                      <Button
                        size="sm"
                        variant={brushMode === "erase" ? "default" : "outline"}
                        onClick={() => setBrushMode("erase")}
                      >
                        <Undo className="w-4 h-4 mr-1" />
                        Erase
                      </Button>
                      
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs text-muted-foreground">Size:</span>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          value={brushSize}
                          onChange={(e) => setBrushSize(parseInt(e.target.value))}
                          className="w-20"
                        />
                        <span className="text-xs text-muted-foreground w-8">{brushSize}</span>
                      </div>
                      
                      <Button size="sm" variant="outline" onClick={handleUndo} disabled={maskHistory.length === 0}>
                        <Undo className="w-4 h-4 mr-1" />
                        Undo
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleClearMask}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      🎨 Paint over the watermark or text area (red = selected for removal)
                    </p>
                  </div>
                )}

                {uploadedImage && (
                  <Button onClick={handleReset} variant="outline" className="w-full">
                    {t("reset")}
                  </Button>
                )}
              </div>
            </Card>

            {/* Result Card */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{t("result")}</h3>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg aspect-square flex items-center justify-center bg-muted/30 overflow-hidden">
                {isProcessing ? (
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground font-medium">Removing watermark...</p>
                    <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
                  </div>
                ) : resultImage ? (
                  <div className="w-full h-full flex flex-col">
                    <div className="flex-1 p-4" style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 16px 16px" }}>
                      <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
                    </div>
                  </div>
                ) : uploadedImage ? (
                  <div className="text-center p-8">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground font-medium">{t("ready_to_process")}</p>
                    <p className="text-xs text-muted-foreground mt-1">Paint over watermark and click process</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground font-medium">{t("no_image")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("upload_to_start")}</p>
                  </div>
                )}
              </div>

              {resultImage && (
                <Button onClick={handleDownload} className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg">
                  <Download className="w-5 h-5 mr-2" />
                  {t("download_result")}
                </Button>
              )}

              {/* Process button */}
              {uploadedImage && !resultImage && (
                <Button
                  onClick={handleRemoveWatermark}
                  disabled={!hasMask() || isProcessing || loading}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6 rounded-xl"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>✨ Remove Watermark (1 credit)</>
                  )}
                </Button>
              )}

              {/* Watermark status */}
              {resultImage && (
                <div className={`mt-3 text-center text-xs px-3 py-2 rounded-lg ${
                  !user
                    ? "bg-yellow-500/10 text-yellow-400"
                    : isSubscriber
                    ? "bg-green-500/10 text-green-400"
                    : "bg-blue-500/10 text-blue-400"
                }`}>
                  {t(!user ? "watermark_free" : isSubscriber ? "watermark_paid" : "watermark_logged_in")}
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      <SignInDialog isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  )
}
