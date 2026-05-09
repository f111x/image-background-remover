"use client"

export interface CropSlice {
  blob: Blob
  url: string
  index: number
  label: string
}

export type CropMode = 3 | 6 | 9
export type CropDirection = "horizontal" | "vertical"

export interface CropResult {
  slices: CropSlice[]
}

export async function cropImage(
  file: File,
  mode: CropMode,
  direction: CropDirection,
  onProgress?: (p: number) => void
): Promise<CropResult> {
  const arrayBuffer = await file.arrayBuffer()
  onProgress?.(20)

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const blob = new Blob([arrayBuffer])
    const url = URL.createObjectURL(blob)
    const imgEl = new Image()
    imgEl.onload = () => { URL.revokeObjectURL(url); resolve(imgEl) }
    imgEl.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")) }
    imgEl.src = url
  })
  onProgress?.(40)

  const total = mode
  const slices: CropSlice[] = []

  if (direction === "horizontal") {
    const sliceH = Math.floor(img.naturalHeight / total)
    for (let i = 0; i < total; i++) {
      const y = i * sliceH
      const h = i === total - 1 ? img.naturalHeight - y : sliceH
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = h
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, y, img.naturalWidth, h, 0, 0, img.naturalWidth, h)
      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob(b => b ? res(b) : rej(new Error("toBlob failed")), "image/png", 1.0)
      )
      slices.push({ blob, url: URL.createObjectURL(blob), index: i, label: `${i + 1}H` })
      onProgress?.(40 + Math.round((i / total) * 55))
    }
  } else {
    const sliceW = Math.floor(img.naturalWidth / total)
    for (let i = 0; i < total; i++) {
      const x = i * sliceW
      const w = i === total - 1 ? img.naturalWidth - x : sliceW
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, x, 0, w, img.naturalHeight, 0, 0, w, img.naturalHeight)
      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob(b => b ? res(b) : rej(new Error("toBlob failed")), "image/png", 1.0)
      )
      slices.push({ blob, url: URL.createObjectURL(blob), index: i, label: `${i + 1}V` })
      onProgress?.(40 + Math.round((i / total) * 55))
    }
  }

  onProgress?.(98)
  return { slices }
}

export function downloadSlice(slice: CropSlice, filename?: string) {
  const url = URL.createObjectURL(slice.blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename || `crop-${slice.label}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadAllAsZip(slices: CropSlice[]): Promise<void> {
  // Dynamically import JSZip
  const JSZip = (await import("jszip")).default
  const zip = new JSZip()
  for (const slice of slices) {
    zip.file(`crop-${slice.label}.png`, slice.blob)
  }
  const zipBlob = await zip.generateAsync({ type: "blob" })
  const url = URL.createObjectURL(zipBlob)
  const a = document.createElement("a")
  a.href = url
  a.download = `crop-${Date.now()}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
