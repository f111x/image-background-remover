"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, ImageIcon, Download, Loader2 } from "lucide-react"

export function EditorSection() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Please upload a JPG, PNG, or WEBP image")
      return
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setError(null)
    setFile(selectedFile)
    setResultImage(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleRemoveBackground = async () => {
    if (!file) {
      setError("Please upload an image first")
      return
    }

    setIsProcessing(true)
    setError(null)
    setResultImage(null)

    try {
      const formData = new FormData()
      formData.append('image_file', file)
      formData.append('size', 'auto')

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to process image')
      }

      const blob = await response.blob()
      const resultUrl = URL.createObjectURL(blob)
      setResultImage(resultUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultImage) return
    const link = document.createElement('a')
    link.href = resultImage
    link.download = `background-removed-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setUploadedImage(null)
    setResultImage(null)
    setFile(null)
    setError(null)
  }

  return (
    <section id="editor" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">AI Powered</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Remove Image Background</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your image and get a transparent background in seconds. No signup required.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-center py-3 px-4 rounded-lg mb-6 max-w-xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Upload Image</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP up to 5MB</p>
                  </label>
                </div>
              </div>

              {uploadedImage && (
                <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 p-4">
                  <img src={uploadedImage} alt="Uploaded" className="w-full h-auto max-h-64 object-contain rounded-lg" />
                </div>
              )}

              <Button
                onClick={handleRemoveBackground}
                disabled={!file || isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6 rounded-xl"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "✨ Remove Background"
                )}
              </Button>

              {uploadedImage && (
                <Button onClick={handleReset} variant="outline" className="w-full">
                  Reset
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
              <h3 className="font-bold text-lg">Result</h3>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg aspect-square flex items-center justify-center bg-muted/30 overflow-hidden">
              {isProcessing ? (
                <div className="text-center">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground font-medium">Removing background...</p>
                  <p className="text-xs text-muted-foreground mt-1">This usually takes a few seconds</p>
                </div>
              ) : resultImage ? (
                <div className="w-full h-full flex flex-col">
                  <div className="flex-1 p-4" style={{ background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 16px 16px' }}>
                    <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
                  </div>
                </div>
              ) : uploadedImage ? (
                <div className="text-center p-8">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground font-medium">Ready to process</p>
                  <p className="text-xs text-muted-foreground mt-1">Click &quot;Remove Background&quot; to continue</p>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground font-medium">No image yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Upload an image to get started</p>
                </div>
              )}
            </div>

            {resultImage && (
              <Button onClick={handleDownload} className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg">
                <Download className="w-5 h-5 mr-2" />
                Download Result
              </Button>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
