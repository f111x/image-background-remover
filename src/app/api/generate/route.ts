import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Check NextAuth session
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({
        error: "Please sign in to use this feature",
        code: "UNAUTHORIZED"
      }, { status: 401 })
    }

    const userId = session.user.id
    const supabase = await createClient()

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
      if (!profile && !profileError) {
        const userEmail = session.user.email || ""
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

    // AI Editor costs 2 credits per generation
    const generationCost = 2

    if (!creditsData?.success || creditsData.total_credits < generationCost) {
      return NextResponse.json({
        error: "Insufficient credits. Please purchase more credits.",
        code: "INSUFFICIENT_CREDITS",
        available: creditsData?.total_credits || 0,
        required: generationCost
      }, { status: 402 })
    }

    // Parse request body
    const body = await request.json()
    const { prompt, referenceImages = [] } = body

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Prompt too long (max 2000 characters)" }, { status: 400 })
    }

    // Call OpenRouter API for image generation
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    // Use Stability AI through OpenRouter for image generation
    // OpenRouter supports various image generation models
    const response = await fetch("https://openrouter.ai/api/v1/images/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://imagetoolss.com",
        "X-Title": "ImageTools AI Editor",
      },
      body: JSON.stringify({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        prompt: prompt.trim(),
        n: 1,
        size: "1024x1024",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      // Log failed usage
      await supabase.from("usage_history").insert({
        user_id: userId,
        credits_used: generationCost,
        source: isSubscriber ? "subscription" : "one-time",
        status: "failed",
        error_message: errorData.error?.message || "OpenRouter API error",
      })

      return NextResponse.json({
        error: errorData.error?.message || "Failed to generate image",
        code: "API_ERROR"
      }, { status: response.status })
    }

    const data = await response.json()

    if (!data.data || !data.data[0]?.url) {
      return NextResponse.json({ error: "No image generated" }, { status: 500 })
    }

    const imageUrl = data.data[0].url

    // Deduct credits
    const { data: deductResult, error: deductError } = await supabase
      .rpc("deduct_credits", {
        p_user_id: userId,
        p_credits: generationCost,
        p_source: isSubscriber ? "subscription" : "one-time"
      })

    if (deductError || !deductResult?.success) {
      console.error("Failed to deduct credits:", deductError, deductResult)
    }

    // Log usage
    await supabase.from("usage_history").insert({
      user_id: userId,
      credits_used: generationCost,
      source: isSubscriber ? "subscription" : "one-time",
      status: "success",
    })

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      creditsRemaining: deductResult?.total_credits || "unknown",
    })

  } catch (error) {
    console.error("Generate API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
