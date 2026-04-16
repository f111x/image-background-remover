import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY
const MODEL_NAME = "black-forest-labs/flux-schnell"

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
    const { prompt } = body

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Prompt too long (max 2000 characters)" }, { status: 400 })
    }

    // Check Replicate API token
    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    // Create prediction on Replicate
    const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "ae7d2c5b9a8c9e7d6b5c4a3f2e1d0c9b",
        input: {
          prompt: prompt.trim(),
          go_fast: true,
          guidance_scale: 3.5,
          num_inference_steps: 4,
          negative_prompt: "blurry, low quality, watermark, signature",
        },
      }),
    })

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
        error: errorData.error || "Failed to start image generation",
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
        error: pollError.message || "Image generation timed out",
        code: "TIMEOUT"
      }, { status: 500 })
    }

    // Get the generated image URL
    const imageUrl = completedPrediction.output?.[0]
    
    if (!imageUrl) {
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
