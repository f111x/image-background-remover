import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ 
        error: "Please sign in to use this feature",
        code: "UNAUTHORIZED"
      }, { status: 401 })
    }

    // Check credits using the new function
    const { data: creditsData, error: creditsError } = await supabase
      .rpc("get_total_credits", { p_user_id: user.id })

    if (creditsError) {
      console.error("Failed to check credits:", creditsError)
      return NextResponse.json({ error: "Failed to check credits" }, { status: 500 })
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
      // Log failed usage (API was called, credits were spent)
      await supabase.from("usage_history").insert({
        user_id: user.id,
        credits_used: 1,
        image_size: imageFile.size,
        source: creditsData.is_subscriber ? "subscription" : "one-time",
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
        p_user_id: user.id,
        p_credits: 1,
        p_source: creditsData.is_subscriber ? "subscription" : "one-time"
      })

    if (deductError || !deductResult?.success) {
      console.error("Failed to deduct credits:", deductError, deductResult)
      // Image was processed, but credits weren't deducted - we still return success to user
      // The deduction should be retried or reconciled manually
    }

    // Log successful usage
    await supabase.from("usage_history").insert({
      user_id: user.id,
      credits_used: 1,
      image_size: imageFile.size,
      source: creditsData.is_subscriber ? "subscription" : "one-time",
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
