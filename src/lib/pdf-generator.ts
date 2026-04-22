/**
 * PDF Generator - Pure client-side PDF creation from images
 * Uses jsPDF for PDF generation
 */

import { jsPDF } from "jspdf"

export type PageSize = "a4" | "letter" | "legal"
export type Orientation = "portrait" | "landscape"
export type ImageFit = "fit" | "fill" | "center"
export type ImagesPerPage = 1 | 2 | 4 | 6 | 9
export type PageMargin = 0 | 5 | 10 | 15

export interface PDFOptions {
  pageSize: PageSize
  orientation: Orientation
  imagesPerPage: ImagesPerPage
  imageFit: ImageFit
  margin: PageMargin
}

// Page dimensions in mm
const PAGE_DIMENSIONS: Record<PageSize, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
}

function getGridCols(imgsPerPage: ImagesPerPage): number {
  switch (imgsPerPage) {
    case 1: return 1
    case 2: return 2
    case 4: return 2
    case 6: return 2
    case 9: return 3
    default: return 1
  }
}

function getGridRows(imgsPerPage: ImagesPerPage): number {
  switch (imgsPerPage) {
    case 1: return 1
    case 2: return 1
    case 4: return 2
    case 6: return 3
    case 9: return 3
    default: return 1
  }
}

/**
 * Load an image from a data URL or file and return dimensions
 */
function loadImage(src: string): Promise<{ width: number; height: number; src: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height, src })
    }
    img.onerror = reject
    img.src = src
  })
}

/**
 * Convert a File to a data URL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export interface ImageFile {
  file: File
  preview: string // data URL
}

/**
 * Main PDF generation function
 * @param images - Array of image files with preview URLs
 * @param options - PDF layout options
 * @returns Blob of the generated PDF
 */
export async function generatePDF(
  images: ImageFile[],
  options: PDFOptions
): Promise<Blob> {
  const { pageSize, orientation, imagesPerPage, imageFit, margin } = options

  const pageWidth = orientation === "portrait"
    ? PAGE_DIMENSIONS[pageSize].width
    : PAGE_DIMENSIONS[pageSize].height
  const pageHeight = orientation === "portrait"
    ? PAGE_DIMENSIONS[pageSize].height
    : PAGE_DIMENSIONS[pageSize].width

  const contentWidth = pageWidth - margin * 2
  const contentHeight = pageHeight - margin * 2

  const cols = getGridCols(imagesPerPage)
  const rows = getGridRows(imagesPerPage)
  const cellWidth = contentWidth / cols
  const cellHeight = contentHeight / rows

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: pageSize,
  })

  // Load all images
  const loadedImages = await Promise.all(
    images.map(img => fileToDataUrl(img.file).then(src => loadImage(src)))
  )

  const totalPages = Math.ceil(loadedImages.length / imagesPerPage)

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      pdf.addPage()
    }

    // Add images for this page
    for (let i = 0; i < imagesPerPage; i++) {
      const imgIndex = page * imagesPerPage + i
      if (imgIndex >= loadedImages.length) break

      const img = loadedImages[imgIndex]
      const col = i % cols
      const row = Math.floor(i / cols)

      const x = margin + col * cellWidth
      const y = margin + row * cellHeight

      // Calculate image placement based on fit mode
      let drawWidth: number, drawHeight: number, drawX: number, drawY: number

      const imgAspect = img.width / img.height
      const cellAspect = cellWidth / cellHeight

      if (imageFit === "fill") {
        // Fill cell (may crop)
        drawWidth = cellWidth
        drawHeight = cellHeight
        drawX = x
        drawY = y
      } else if (imageFit === "center") {
        // Center with original aspect ratio
        if (imgAspect > cellAspect) {
          drawWidth = cellWidth
          drawHeight = cellWidth / imgAspect
        } else {
          drawHeight = cellHeight
          drawWidth = cellHeight * imgAspect
        }
        drawX = x + (cellWidth - drawWidth) / 2
        drawY = y + (cellHeight - drawHeight) / 2
      } else {
        // "fit" - fit within cell (no crop, may have whitespace)
        if (imgAspect > cellAspect) {
          drawWidth = cellWidth
          drawHeight = cellWidth / imgAspect
        } else {
          drawHeight = cellHeight
          drawWidth = cellHeight * imgAspect
        }
        drawX = x + (cellWidth - drawWidth) / 2
        drawY = y + (cellHeight - drawHeight) / 2
      }

      try {
        // Add image with calculated dimensions
        pdf.addImage(
          img.src,
          "JPEG",
          drawX,
          drawY,
          drawWidth,
          drawHeight
        )
      } catch (err) {
        console.error(`Failed to add image ${imgIndex}:`, err)
      }
    }
  }

  return pdf.output("blob")
}

/**
 * Download a PDF blob with a filename
 */
export function downloadPDF(blob: Blob, filename = "imagetools-export.pdf") {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
