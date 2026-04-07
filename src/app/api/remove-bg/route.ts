import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Get user from Supabase Auth (works for all login methods: Google, GitHub, Email)
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        error: "Please sign in to use this feature",
        code: "UNAUTHORIZED"
      }, { status: 401 })
    }

    const userId = user.id
    const userEmail = user.email || ""

    // Check if user exists in Supabase profiles
    let isSubscriber = false
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
            credits: 2, // New user bonus: 1 for background removal + 1 for AI editor
            total_credits: 0,
          })

        if (insertError) {
          console.error("Failed to create profile:", insertError)
          // Don't fail the request, continue without profile
        }
      }
    } catch (e) {
      console.error("Profile check exception:", e)
      // Continue without profile check
    }

    // Check credits
    const { data: creditsData, error: creditsError } = await supabase
      .rpc("get_total_credits", { p_user_id: userId })

    if (creditsError) {
      console.error("Failed to check credits:", creditsError)
      return NextResponse.json({ 
        error: "Failed to check credits", 
        details: creditsError.message,
        hint: "Check if RPC function exists and user has permission"
      }, { status: 500 })
    }

    if (!creditsData?.success || creditsData.total_credits < 1) {
      return NextResponse.json({
        error: "Insufficient credits. Please purchase more credits.",
        code: "INSUFFICIENT_CREDITS",
        available: creditsData?.total_credits || 0
      }, { status: 402 })
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

    const removeBgFormData = new FormData()
    removeBgFormData.append("image_file", imageFile)
    removeBgFormData.append("size", "auto")

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: removeBgFormData,
    })

    if (!response.ok) {
      // Log failed usage
      await supabase.from("usage_history").insert({
        user_id: userId,
        credits_used: 1,
        image_size: imageFile.size,
        source: isSubscriber ? "subscription" : "one-time",
        status: "failed",
        error_message: "Remove.bg API error",
      })

      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({
        error: errorData.errors?.[0]?.title || "Failed to process image",
        code: "API_ERROR"
      }, { status: response.status })
    }

    // Deduct credits
    const { data: deductResult, error: deductError } = await supabase
      .rpc("deduct_credits", {
        p_user_id: userId,
        p_credits: 1,
        p_source: isSubscriber ? "subscription" : "one-time"
      })

    if (deductError || !deductResult?.success) {
      console.error("Failed to deduct credits:", deductError, deductResult)
    }

    // Log usage
    await supabase.from("usage_history").insert({
      user_id: userId,
      credits_used: 1,
      image_size: imageFile.size,
      source: isSubscriber ? "subscription" : "one-time",
      status: "success",
    })

    // Return the processed image
    const blob = await response.blob()

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "X-Credits-Remaining": deductResult?.total_credits || "unknown",
      },
    })
  } catch (error) {
    console.error("Remove.bg API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
