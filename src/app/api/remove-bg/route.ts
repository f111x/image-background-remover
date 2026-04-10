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

    // Check credits via RPC
    console.log("Checking credits for user:", userId)
    let creditsInfo: Record<string, any> | null = null
    let usingFallback = false

    const { data: creditsData, error: creditsError } = await supabase
      .rpc("get_total_credits", { p_user_id: userId })

    console.log("Credits response:", { creditsData, creditsError })

    if (creditsError) {
      // Handle PGRST204: RPC returned multiple rows (data inconsistency)
      if (creditsError.code === 'PGRST204') {
        console.error("Credit check: PGRST204 multiple rows, using fallback direct query")
      } else {
        // Other RPC errors (including 22P02 invalid UUID)
        console.error("Credit check RPC error:", creditsError)
        return NextResponse.json({ 
          error: "Failed to check credits", 
          details: creditsError.message
        }, { status: 500 })
      }

      // Fallback: directly query profiles table when RPC fails
      const { data: profileData, error: profileQueryError } = await supabase
        .from("profiles")
        .select("credits, rollover_credits, is_subscriber")
        .eq("id", userId)
        .maybeSingle()

      if (profileQueryError) {
        console.error("Fallback profile query failed:", profileQueryError)
        return NextResponse.json({ error: "Failed to check credits" }, { status: 500 })
      }

      if (!profileData) {
        return NextResponse.json({ error: "User profile not found" }, { status: 404 })
      }

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
      usingFallback = true
    } else {
      // Normal path: RPC succeeded
      // Handle array response (multiple rows returned without error)
      const raw = Array.isArray(creditsData) ? creditsData[0] : creditsData
      creditsInfo = raw

      if (!raw || !raw.success || raw.total_credits < 1) {
        return NextResponse.json({
          error: "Insufficient credits. Please purchase more credits.",
          code: "INSUFFICIENT_CREDITS",
          available: raw?.total_credits || 0
        }, { status: 402 })
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

    // Deduct credits (skip if using fallback to avoid RPC errors)
    let deductResult: any = null
    if (!usingFallback) {
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
          .update({ credits: (creditsInfo?.one_time_credits || 1) - 1 })
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
        "X-Credits-Remaining": deductResult?.total_credits || creditsInfo?.total_credits || "unknown",
      },
    })
  } catch (error) {
    console.error("Remove.bg API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
