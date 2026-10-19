const MAX_EDGE = 2000
const QUALITY = 0.82
const SKIP_UNDER_BYTES = 900_000

function outputName(name: string) {
  const base = name.replace(/\.[^.]+$/, '') || 'photo'
  return `${base}.jpg`
}

async function drawJpeg(file: File, maxEdge: number, quality: number) {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return null
    context.drawImage(bitmap, 0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality)
    })
    return blob
  } finally {
    bitmap.close()
  }
}

/** Shrinks oversized photos before they are posted. Leaves small files untouched. */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file
  }
  if (file.size < SKIP_UNDER_BYTES) return file

  try {
    let blob = await drawJpeg(file, MAX_EDGE, QUALITY)
    if (blob && blob.size > 2_500_000) {
      blob = (await drawJpeg(file, 1600, 0.72)) ?? blob
    }
    if (!blob || blob.size >= file.size) return file
    return new File([blob], outputName(file.name), { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    return file
  }
}

export async function compressImages(files: File[]) {
  return Promise.all(files.map((file) => compressImage(file)))
}
