import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY
const MODEL_NAME = "stability-ai/sdxl-image-inpainting"

async function pollPrediction(predictionUrl: string, maxAttempts = 60): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(predictionUrl, {
      headers: {
        "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get prediction status: ${response.statusText}`)
    }
    
    const prediction = await response.json()
    
    if (prediction.status === "succeeded") {
      return prediction
    }
    
    if (prediction.status === "failed") {
      throw new Error(prediction.error || "Prediction failed")
    }
    
    // Wait 1 second before next poll
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  throw new Error("Prediction timed out")
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check for guest user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const userId = user?.id || null
    const userEmail = user?.email || ""
    const isGuest = !user || !!authError

    let isSubscriber = false
    let creditsInfo: Record<string, any> | null = null

    // Only check credits for logged-in users
    if (!isGuest && userId) {
      // Check if user exists in Supabase profiles
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, is_subscriber")
          .eq("id", userId)
          .maybeSingle()

        if (profileError) {
          console.error("Profile check error:", profileError)
        } else if (profile) {
          isSubscriber = profile.is_subscriber || false
        }

        // If user doesn't exist in profiles, create one
        if (!profile) {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              email: userEmail,
              credits: 2,
              total_credits: 0,
            })

          if (insertError) {
            console.error("Failed to create profile:", insertError)
          }
        }
      } catch (e) {
        console.error("Profile check exception:", e)
      }

      // Check credits via RPC
      const { data: creditsData, error: creditsError } = await supabase
        .rpc("get_total_credits", { p_user_id: userId })

      if (creditsError) {
        console.error("Credit check RPC error:", creditsError)
        // Fallback: directly query profiles table
        const { data: profileData } = await supabase
          .from("profiles")
          .select("credits, rollover_credits, is_subscriber")
          .eq("id", userId)
          .maybeSingle()

        if (profileData) {
          const totalCredits = (profileData.credits || 0) + (profileData.rollover_credits || 0)
          if (totalCredits < 1) {
            return NextResponse.json({
              error: "Insufficient credits. Please purchase more credits.",
              code: "INSUFFICIENT_CREDITS",
              available: totalCredits
            }, { status: 402 })
          }
          creditsInfo = {
            success: true,
            total_credits: totalCredits,
            one_time_credits: profileData.credits || 0,
            rollover_credits: profileData.rollover_credits || 0,
            is_subscriber: profileData.is_subscriber || false
          }
          isSubscriber = profileData.is_subscriber || false
        }
      } else {
        const raw = Array.isArray(creditsData) ? creditsData[0] : creditsData
        if (!raw || !raw.success || raw.total_credits < 1) {
          return NextResponse.json({
            error: "Insufficient credits. Please purchase more credits.",
            code: "INSUFFICIENT_CREDITS",
            available: raw?.total_credits || 0
          }, { status: 402 })
        }
        creditsInfo = raw
      }
    }

    // Get form data
    const formData = await request.formData()
    const imageFile = formData.get("image_file") as File | null
    const maskFile = formData.get("mask_file") as File | null

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    if (!maskFile) {
      return NextResponse.json({ error: "No mask file provided" }, { status: 400 })
    }

    // Validate file type
    if (!imageFile.type.match(/^image\/(jpeg|png|webp)$/)) {
      return NextResponse.json({ error: "Invalid image file type. Use JPG, PNG, or WEBP." }, { status: 400 })
    }

    if (!maskFile.type.match(/^image\/(jpeg|png|webp)$/)) {
      return NextResponse.json({ error: "Invalid mask file type. Use JPG, PNG, or WEBP." }, { status: 400 })
    }

    // Validate file size (10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image file too large. Max 10MB." }, { status: 400 })
    }

    if (maskFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Mask file too large. Max 10MB." }, { status: 400 })
    }

    // Check Replicate API token
    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    // Convert files to base64
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
    const maskBuffer = Buffer.from(await maskFile.arrayBuffer())
    const imageBase64 = imageBuffer.toString("base64")
    const maskBase64 = maskBuffer.toString("base64")

    // Create data URL for Replicate
    const imageUrl = `data:${imageFile.type};base64,${imageBase64}`
    const maskUrl = `data:${maskFile.type};base64,${maskBase64}`

    // Upload images to Supabase Storage for Replicate to fetch
    const timestamp = Date.now()
    const safeFileName = (name: string) => name.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    const imagePath = userId 
      ? `${userId}/${timestamp}-image-${safeFileName(imageFile.name)}`
      : `guest/${timestamp}-image-${safeFileName(imageFile.name)}`
    const maskPath = userId 
      ? `${userId}/${timestamp}-mask-${safeFileName(maskFile.name)}`
      : `guest/${timestamp}-mask-${safeFileName(maskFile.name)}`
    
    const { error: imageUploadError } = await supabase.storage
      .from('reference-images')
      .upload(imagePath, imageBuffer, {
        contentType: imageFile.type,
        upsert: false
      })

    if (imageUploadError) {
      console.error("Failed to upload image to Supabase Storage:", imageUploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    const { error: maskUploadError } = await supabase.storage
      .from('reference-images')
      .upload(maskPath, maskBuffer, {
        contentType: maskFile.type,
        upsert: false
      })

    if (maskUploadError) {
      console.error("Failed to upload mask to Supabase Storage:", maskUploadError)
      // Clean up uploaded image
      await supabase.storage.from('reference-images').remove([imagePath]).catch(() => {})
      return NextResponse.json({ error: "Failed to upload mask" }, { status: 500 })
    }

    // Get public URLs
    const { data: imageUrlData } = supabase.storage
      .from('reference-images')
      .getPublicUrl(imagePath)
    const { data: maskUrlData } = supabase.storage
      .from('reference-images')
      .getPublicUrl(maskPath)

    const imagePublicUrl = imageUrlData.publicUrl
    const maskPublicUrl = maskUrlData.publicUrl

    // Create prediction on Replicate
    const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "stability-ai/sdxl-image-inpainting",
        input: {
          image: imagePublicUrl,
          mask: maskPublicUrl,
          prompt: "high quality, clean image without watermark or text, natural looking inpainting",
          negative_prompt: "watermark, text, logo, signature, blurry, low quality",
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
      }),
    })

    // Clean up uploaded files
    await supabase.storage.from('reference-images').remove([imagePath, maskPath]).catch(() => {})

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}))
      console.error("Replicate API error:", errorData)

      if (userId) {
        try {
          await supabase.from("usage_history").insert({
            user_id: userId,
            credits_used: 0,
            source: isSubscriber ? "subscription" : "one-time",
            status: "failed",
            error_message: errorData.error || "Replicate API error",
          })
        } catch {}
      }

      return NextResponse.json({
        error: errorData.error || "Failed to start image inpainting",
        code: "API_ERROR"
      }, { status: createResponse.status })
    }

    const prediction = await createResponse.json()
    
    // Poll for completion
    let completedPrediction: any
    try {
      completedPrediction = await pollPrediction(prediction.urls.next)
    } catch (pollError: any) {
      console.error("Polling error:", pollError)

      if (userId) {
        try {
          await supabase.from("usage_history").insert({
            user_id: userId,
            credits_used: 0,
            source: isSubscriber ? "subscription" : "one-time",
            status: "failed",
            error_message: pollError.message || "Polling failed",
          })
        } catch {}
      }

      return NextResponse.json({
        error: pollError.message || "Image inpainting timed out",
        code: "TIMEOUT"
      }, { status: 500 })
    }

    // Get the result image URL
    const resultImageUrl = completedPrediction.output?.image || completedPrediction.output?.[0]
    
    if (!resultImageUrl) {
      if (userId) {
        try {
          await supabase.from("usage_history").insert({
            user_id: userId,
            credits_used: 0,
            source: isSubscriber ? "subscription" : "one-time",
            status: "failed",
            error_message: "No image in response",
          })
        } catch {}
      }
      return NextResponse.json({ error: "No image generated" }, { status: 500 })
    }

    // Deduct credits for logged-in users only
    let deductResult: any = null
    
    if (userId && !isGuest) {
      const { data: deductData, error: deductError } = await supabase
        .rpc("deduct_credits", {
          p_user_id: userId,
          p_credits: 1,
          p_source: isSubscriber ? "subscription" : "one-time"
        })

      deductResult = deductData
      if (deductError) {
        console.error("Failed to deduct credits via RPC:", deductError)
        // Fallback: direct update
        const { data: profileUpdate } = await supabase
          .from("profiles")
          .update({ credits: Math.max((creditsInfo?.one_time_credits || 1) - 1, 0) })
          .eq("id", userId)
          .select("credits")
          .single()
        if (profileUpdate) {
          deductResult = { success: true, total_credits: profileUpdate.credits }
        }
      } else if (!deductResult?.success) {
        console.error("Deduct credits returned failure:", deductResult)
      }
    }

    // Log success
    if (userId) {
      try {
        await supabase.from("usage_history").insert({
          user_id: userId,
          credits_used: isGuest ? 0 : 1,
          source: isSubscriber ? "subscription" : (isGuest ? "guest" : "one-time"),
          status: "success",
        })
      } catch {}
    }

    return NextResponse.json({
      success: true,
      imageUrl: resultImageUrl,
      creditsRemaining: deductResult?.total_credits || creditsInfo?.total_credits || (isGuest ? "guest" : "unknown"),
      isGuest: isGuest,
    })

  } catch (error) {
    console.error("Watermark remove API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
