import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY
const MODEL_NAME = "codeplugtech/face-swap"
const MODEL_VERSION = "278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34"

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

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  throw new Error("Prediction timed out")
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const userId = user?.id || null
    const userEmail = user?.email || ""
    const isGuest = !user || !!authError

    let isSubscriber = false

    // Only check/deduct credits for logged-in users
    if (!isGuest && userId) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, is_subscriber")
          .eq("id", userId)
          .maybeSingle()

        if (profile) {
          isSubscriber = profile.is_subscriber || false
        } else {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({ id: userId, email: userEmail, credits: 2, total_credits: 0 })
          if (insertError) console.error("Failed to create profile:", insertError)
        }
      } catch (e) {
        console.error("Profile check exception:", e)
      }

      // Check credits (1 credit for face swap)
      const { data: creditsData } = await supabase
        .rpc("get_total_credits", { p_user_id: userId })

      const totalCredits = creditsData?.success ? creditsData.total_credits : 0
      if (totalCredits < 1) {
        return NextResponse.json({
          error: "Insufficient credits. Please purchase more credits.",
          code: "INSUFFICIENT_CREDITS",
          available: totalCredits,
          required: 1
        }, { status: 402 })
      }
    }

    // Parse request body
    const body = await request.json()
    const { sourceImage, targetImage } = body

    if (!sourceImage || !targetImage) {
      return NextResponse.json({ error: "sourceImage and targetImage are required" }, { status: 400 })
    }

    // Check Replicate API token
    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    // Create prediction on Replicate with explicit version
    let createResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          source_image: sourceImage,
          target_image: targetImage,
        },
      }),
    })

    // Fallback: try Replicate's model endpoint if the pinned version is not available
    if (!createResponse.ok) {
      createResponse = await fetch(`https://api.replicate.com/v1/models/${MODEL_NAME}/predictions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            source_image: sourceImage,
            target_image: targetImage,
          },
        }),
      })
    }

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
        error: errorData.error || "Failed to start face swap",
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
        error: pollError.message || "Face swap timed out",
        code: "TIMEOUT"
      }, { status: 500 })
    }

    const imageUrl = Array.isArray(completedPrediction.output)
      ? completedPrediction.output[0]
      : completedPrediction.output

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

    // Deduct 1 credit for logged-in users
    let deductResult: any = null

    if (userId && !isGuest) {
      const { data: deductData } = await supabase
        .rpc("deduct_credits", {
          p_user_id: userId,
          p_credits: 1,
          p_source: isSubscriber ? "subscription" : "one-time"
        })

      deductResult = deductData
      if (deductData?.success) {
        const { data: newCredits } = await supabase
          .rpc("get_total_credits", { p_user_id: userId })
        deductResult = newCredits
      }
    }

    // Log usage
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
      imageUrl: imageUrl,
      creditsRemaining: deductResult?.total_credits ?? null,
      isGuest: isGuest,
    })

  } catch (error) {
    console.error("Face Swap API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}