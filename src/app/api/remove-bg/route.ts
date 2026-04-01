import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image_file') as File | null
    
    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    // Validate file type
    if (!imageFile.type.match(/^image\/(jpeg|png|webp)$/)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Validate file size (5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Create form data for Remove.bg API
    const removeBgFormData = new FormData()
    removeBgFormData.append('image_file', imageFile)
    removeBgFormData.append('size', 'auto')

    // Call Remove.bg API
    const apiKey = process.env.REMOVE_BG_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Remove.bg API key not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.errors?.[0]?.title || 'Failed to process image'
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    // Return the processed image as binary
    const blob = await response.blob()
    
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    })
  } catch (error) {
    console.error('Remove.bg API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
