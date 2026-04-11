import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/supabase/auth-helpers"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { orderID, credits, packageName } = await request.json()

    if (!orderID || !credits) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized - please log in" }, { status: 401 })
    }

    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "PayPal not configured" }, { status: 500 })
    }

    // Get access token
    const authResponse = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
      body: "grant_type=client_credentials",
    })

    if (!authResponse.ok) {
      return NextResponse.json({ error: "Failed to authenticate with PayPal" }, { status: 500 })
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // Capture the order (complete the payment)
    const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    })

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json()
      return NextResponse.json({ error: errorData.message || "Failed to capture payment" }, { status: 500 })
    }

    const captureData = await captureResponse.json()

    if (captureData.status !== "COMPLETED") {
      return NextResponse.json({ error: `Payment status: ${captureData.status}` }, { status: 400 })
    }

    // Security: verify custom_id matches current user
    const customId = captureData.purchase_units?.[0]?.custom_id
    if (customId && customId !== user.id) {
      console.error(`[verify-order] custom_id mismatch: order=${customId}, user=${user.id}`)
      return NextResponse.json({ error: "Order does not belong to current user" }, { status: 403 })
    }

    const supabase = await createClient()
    const userId = user.id

    // Get current credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits, total_credits")
      .eq("id", userId)
      .maybeSingle()

    const currentCredits = profile?.credits || 0
    const currentTotal = profile?.total_credits || 0

    // Update credits
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        credits: currentCredits + credits,
        total_credits: currentTotal + credits,
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Failed to update credits:", updateError)
      return NextResponse.json({ error: "Failed to add credits to account" }, { status: 500 })
    }

    // Record purchase in purchases table
    const purchaseName = packageName || `${credits} credits`
    await supabase.from("purchases").insert({
      user_id: userId,
      package_name: purchaseName,
      credits,
      amount_paid: captureData.purchase_units?.[0]?.amount?.value || "0",
      status: "completed",
    }).catch(err => {
      // Non-fatal: log but don't fail the request
      console.error("Failed to record purchase:", err)
    })

    console.log(`✅ Credits added! Order ID: ${orderID}, User: ${userId}, Credits: ${credits}`)

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${credits} credits`,
      orderID: orderID,
      newBalance: currentCredits + credits,
    })

  } catch (error) {
    console.error("PayPal verify order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
