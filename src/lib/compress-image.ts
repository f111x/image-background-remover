"use client"

export interface CompressResult {
  originalSize: number
  compressedSize: number
  compressedUrl: string
  quality: number
}

export async function compressImage(
  file: File,
  quality: number, // 0.0 - 1.0
  format: "image/jpeg" | "image/png" | "image/webp" = "image/jpeg"
): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"))
              return
            }
            const compressedUrl = URL.createObjectURL(blob)
            resolve({
              originalSize: file.size,
              compressedSize: blob.size,
              compressedUrl,
              quality: Math.round(quality * 100),
            })
          },
          format,
          quality
        )
      }
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function downloadCompressed(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
