"use client"

export interface MergeImage {
  file: File
  preview: string
}

export type LayoutDirection = "grid" | "horizontal" | "vertical"
export type BackgroundColor = "white" | "black" | "transparent" | "blur"

export interface MergeOptions {
  direction: LayoutDirection
  gap: number // pixels
  bgColor: BackgroundColor
  maxWidth: number
  maxHeight: number
}

const LAYOUT_PRESETS: Record<number, { cols: number; rows: number }> = {
  1: { cols: 1, rows: 1 },
  2: { cols: 2, rows: 1 },
  3: { cols: 3, rows: 1 },
  4: { cols: 2, rows: 2 },
  5: { cols: 3, rows: 2 },
  6: { cols: 3, rows: 2 },
  7: { cols: 3, rows: 3 },
  8: { cols: 3, rows: 3 },
  9: { cols: 3, rows: 3 },
}

function getGridDims(count: number) {
  return LAYOUT_PRESETS[Math.min(count, 9)] || { cols: 3, rows: 3 }
}

export async function mergeImages(
  images: { preview: string }[],
  options: MergeOptions,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const { direction, gap, bgColor, maxWidth, maxHeight } = options
  const count = images.length
  if (count === 0) throw new Error("No images")

  onProgress?.(10)

  // Load all images
  const loadedImages: HTMLImageElement[] = await Promise.all(
    images.map((img) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image()
        el.onload = () => resolve(el)
        el.onerror = reject
        el.src = img.preview
      })
    )
  )

  onProgress?.(40)

  let canvasWidth: number
  let canvasHeight: number
  let cols: number
  let rows: number

  if (direction === "horizontal") {
    cols = count
    rows = 1
    const maxH = Math.min(...loadedImages.map((img) => img.naturalHeight))
    const totalW = loadedImages.reduce((sum, img) => sum + img.naturalWidth, 0)
    const scale = Math.min(1, maxWidth / totalW, maxHeight / maxH)
    canvasWidth = Math.round(totalW * scale)
    canvasHeight = Math.round(maxH * scale)
  } else if (direction === "vertical") {
    cols = 1
    rows = count
    const maxW = Math.min(...loadedImages.map((img) => img.naturalWidth))
    const totalH = loadedImages.reduce((sum, img) => sum + img.naturalHeight, 0)
    const scale = Math.min(1, maxWidth / maxW, maxHeight / totalH)
    canvasWidth = Math.round(maxW * scale)
    canvasHeight = Math.round(totalH * scale)
  } else {
    // grid
    const dims = getGridDims(count)
    cols = dims.cols
    rows = dims.rows

    // Scale each image to fit within a cell
    const cellW = maxWidth / cols
    const cellH = maxHeight / rows
    const scale = Math.min(1, ...loadedImages.map((img) => Math.min(cellW / img.naturalWidth, cellH / img.naturalHeight)))
    canvasWidth = Math.round(cols * (loadedImages[0].naturalWidth * scale) + (cols - 1) * gap)
    canvasHeight = Math.round(rows * (loadedImages[0].naturalHeight * scale) + (rows - 1) * gap)
  }

  // Clamp output dimensions
  canvasWidth = Math.min(canvasWidth, maxWidth)
  canvasHeight = Math.min(canvasHeight, maxHeight)

  const canvas = document.createElement("canvas")
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext("2d")!

  // Background
  if (bgColor === "transparent") {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  } else if (bgColor === "blur") {
    ctx.fillStyle = "rgba(128,128,128,0.5)"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  } else {
    ctx.fillStyle = bgColor === "white" ? "#ffffff" : "#000000"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  onProgress?.(60)

  // Draw each image
  const cellWidth = canvasWidth / cols
  const cellHeight = canvasHeight / rows

  for (let i = 0; i < count; i++) {
    const img = loadedImages[i]
    const col = direction === "horizontal" ? i : direction === "vertical" ? 0 : i % cols
    const row = direction === "horizontal" ? 0 : direction === "vertical" ? i : Math.floor(i / cols)

    const x = col * cellWidth + gap / 2
    const y = row * cellHeight + gap / 2
    const cw = cellWidth - gap
    const ch = cellHeight - gap

    // Scale to fit within cell while preserving aspect ratio
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    const dx = x + (cw - dw) / 2
    const dy = y + (ch - dh) / 2

    ctx.drawImage(img, dx, dy, dw, dh)
    onProgress?.(60 + Math.round((i / count) * 30))
  }

  onProgress?.(95)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Failed to create blob"))
      },
      "image/png",
      1.0
    )
  })
}

export function downloadMerge(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
