'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'

interface ProcessingResult {
  originalUrl: string
  resultUrl: string
}

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<ProcessingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError('Please upload a JPG, PNG, or WEBP image')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }
    setFile(file)
    setError(null)
    setResult(null)
    
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const processImage = async () => {
    if (!file) return
    
    setLoading(true)
    setError(null)
    
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
      
      setResult({
        originalUrl: preview!,
        resultUrl,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image')
    } finally {
      setLoading(false)
    }
  }

  const downloadResult = () => {
    if (!result) return
    const link = document.createElement('a')
    link.href = result.resultUrl
    link.download = `background-removed-${Date.now()}.png`
    link.click()
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-gray-700">
      {/* Upload Zone */}
      {!preview && !result && (
        <div
          className={`border-2 border-dashed rounded-xl p-12 mb-6 transition cursor-pointer ${
            dragOver ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />
          <div className="text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg">Drag and drop an image here, or click to select</p>
            <p className="text-sm mt-2">Supports JPG, PNG, WEBP • Max 10MB</p>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && !result && (
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img src={preview} alt="Preview" className="max-w-full h-auto mx-auto" />
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={processImage}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              {loading ? 'Processing...' : 'Remove Background'}
            </button>
            <button
              onClick={reset}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mb-6">
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-2 text-center">Original</p>
              <div className="relative rounded-xl overflow-hidden bg-gray-700 p-4">
                <img src={result.originalUrl} alt="Original" className="max-w-full h-auto mx-auto" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2 text-center">Result</p>
              <div className="relative rounded-xl overflow-hidden bg-gray-700 p-4" style={{ background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px' }}>
                <img src={result.resultUrl} alt="Result" className="max-w-full h-auto mx-auto" />
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={downloadResult}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Download Result
            </button>
            <button
              onClick={reset}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Process Another
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Removing background...</p>
        </div>
      )}
    </div>
  )
}
