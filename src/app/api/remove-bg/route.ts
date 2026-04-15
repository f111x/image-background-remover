import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
              credits: 2, // New user bonus
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

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Validate file type
    if (!imageFile.type.match(/^image\/(jpeg|png|webp)$/)) {
      return NextResponse.json({ error: "Invalid file type. Use JPG, PNG, or WEBP." }, { status: 400 })
    }

    // Validate file size (10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 })
    }

    // Call Remove.bg API
    const apiKey = process.env.REMOVE_BG_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Service not configured" }, { status: 500 })
    }

    // Upload to Supabase Storage
    // For guests, use a temporary path that will be cleaned up
    const timestamp = Date.now()
    const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = userId 
      ? `${userId}/${timestamp}-${safeFileName}`
      : `guest/${timestamp}-${safeFileName}`
    
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    
    const { error: uploadError } = await supabase.storage
      .from('reference-images')
      .upload(fileName, buffer, {
        contentType: imageFile.type,
        upsert: false
      })

    if (uploadError) {
      console.error("Failed to upload to Supabase Storage:", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('reference-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    // Call Remove.bg
    const removeBgFormData = new FormData()
    removeBgFormData.append("image_url", imageUrl)
    removeBgFormData.append("size", "auto")

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: removeBgFormData,
    })

    // Clean up uploaded file
    await supabase.storage.from('reference-images').remove([fileName]).catch(() => {})

    let imageBlob: Blob
    let errorMessage = "Failed to process image"
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Remove.bg API error:", errorText.slice(0, 200))
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.errors?.[0]?.title || errorMessage
      } catch {}
      
      // Log failed attempt
      if (userId) {
        try {
          await supabase.from("usage_history").insert({
            user_id: userId,
            credits_used: 0,
            image_size: imageFile.size,
            source: isSubscriber ? "subscription" : "one-time",
            status: "failed",
            error_message: errorMessage,
          })
        } catch {}
      }

      return NextResponse.json({
        error: errorMessage,
        code: "API_ERROR"
      }, { status: response.status })
    }

    // Read the image blob
    try {
      imageBlob = await response.blob()
    } catch (blobErr) {
      console.error("Failed to read response blob:", blobErr)
      
      if (userId) {
        try {
          await supabase.from("usage_history").insert({
            user_id: userId,
            credits_used: 0,
            image_size: imageFile.size,
            source: isSubscriber ? "subscription" : "one-time",
            status: "failed",
            error_message: "Failed to read processed image",
          })
        } catch {}
      }

      return NextResponse.json({
        error: "Failed to read processed image",
        code: "BLOB_READ_ERROR"
      }, { status: 500 })
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
          image_size: imageFile.size,
          source: isSubscriber ? "subscription" : (isGuest ? "guest" : "one-time"),
          status: "success",
        })
      } catch {}
    }

    // Return the processed image
    const headers: Record<string, string> = {
      "Content-Type": "image/png",
      "X-Credits-Remaining": deductResult?.total_credits?.toString() || creditsInfo?.total_credits?.toString() || (isGuest ? "guest" : "unknown"),
      "X-Is-Guest": isGuest ? "true" : "false",
    }

    return new NextResponse(imageBlob, { status: 200, headers })
  } catch (error) {
    console.error("Remove.bg API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
