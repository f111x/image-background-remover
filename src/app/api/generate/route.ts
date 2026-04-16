import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Allow guest users to try the tool
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const userId = user?.id || null
    const userEmail = user?.email || ""
    const isGuest = !user || !!authError

    let isSubscriber = false
    let creditsInfo: Record<string, any> | null = null

    // Only check/deduct credits for logged-in users
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

      // Check credits
      const { data: creditsData, error: creditsError } = await supabase
        .rpc("get_total_credits", { p_user_id: userId })

      if (creditsError) {
        console.error("Failed to check credits:", creditsError)
        // Fallback to direct query
        const { data: profileData } = await supabase
          .from("profiles")
          .select("credits, rollover_credits, is_subscriber")
          .eq("id", userId)
          .maybeSingle()

        if (profileData) {
          const totalCredits = (profileData.credits || 0) + (profileData.rollover_credits || 0)
          if (totalCredits < 2) {
            return NextResponse.json({
              error: "Insufficient credits. Please purchase more credits.",
              code: "INSUFFICIENT_CREDITS",
              available: totalCredits,
              required: 2
            }, { status: 402 })
          }
          creditsInfo = {
            success: true,
            total_credits: totalCredits,
            is_subscriber: profileData.is_subscriber || false
          }
          isSubscriber = profileData.is_subscriber || false
        }
      } else {
        if (!creditsData?.success || creditsData.total_credits < 2) {
          return NextResponse.json({
            error: "Insufficient credits. Please purchase more credits.",
            code: "INSUFFICIENT_CREDITS",
            available: creditsData?.total_credits || 0,
            required: 2
          }, { status: 402 })
        }
        creditsInfo = creditsData
      }
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

      if (userId) {
        try {
          await supabase.from("usage_history").insert({
            user_id: userId,
            credits_used: 0,
            source: isSubscriber ? "subscription" : "one-time",
            status: "failed",
            error_message: errorData.error?.message || "OpenRouter API error",
          })
        } catch {}
      }

      return NextResponse.json({
        error: errorData.error?.message || "Failed to generate image",
        code: "API_ERROR"
      }, { status: response.status })
    }

    const data = await response.json()

    if (!data.data || !data.data[0]?.url) {
      if (userId) {
        try {
          await supabase.from("usage_history").insert({
            user_id: userId,
            credits_used: 0,
            source: isSubscriber ? "subscription" : "one-time",
            status: "failed",
            error_message: "No image URL in response",
          })
        } catch {}
      }
      return NextResponse.json({ error: "No image generated" }, { status: 500 })
    }

    const imageUrl = data.data[0].url

    // Deduct credits for logged-in users only
    let deductResult: any = null
    
    if (userId && !isGuest) {
      const { data: deductData, error: deductError } = await supabase
        .rpc("deduct_credits", {
          p_user_id: userId,
          p_credits: 2,
          p_source: isSubscriber ? "subscription" : "one-time"
        })

      deductResult = deductData
      if (deductError || !deductResult?.success) {
        console.error("Failed to deduct credits:", deductError, deductResult)
      }
    }

    // Log usage
    if (userId) {
      try {
        await supabase.from("usage_history").insert({
          user_id: userId,
          credits_used: isGuest ? 0 : 2,
          source: isSubscriber ? "subscription" : (isGuest ? "guest" : "one-time"),
          status: "success",
        })
      } catch {}
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      creditsRemaining: deductResult?.total_credits || creditsInfo?.total_credits || (isGuest ? "guest" : "unknown"),
      isGuest: isGuest,
    })

  } catch (error) {
    console.error("Generate API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
