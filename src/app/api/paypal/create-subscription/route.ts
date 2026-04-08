import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/supabase/auth-helpers"

const PLAN_IDS: Record<string, string> = {
  Basic: process.env.PAYPAL_PLAN_BASIC || "P-8A321606Y3031753VNHHKA2A",
  Pro: process.env.PAYPAL_PLAN_PRO || "P-1E622203E00202506NHHKA5Q",
}

export async function POST(request: NextRequest) {
  try {
    const { planName } = await request.json()

    if (!planName || !PLAN_IDS[planName]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const user = await getCurrentUser()
    if (!user?.id || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
      return NextResponse.json({ error: "PayPal auth failed" }, { status: 500 })
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // Create subscription
    const subscriptionResponse = await fetch("https://api-m.paypal.com/v1/billing/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "PayPal-Request-Id": `${user.id}-${Date.now()}`,
      },
      body: JSON.stringify({
        plan_id: PLAN_IDS[planName],
        subscriber: {
          email_address: user.email,
        },
        custom_id: user.id,
        application_context: {
          return_url: "https://imagetoolss.com/profile?subscription=success",
          cancel_url: "https://imagetoolss.com/pricing?subscription=cancelled",
        },
      }),
    })

    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.json()
      console.error("PayPal subscription error:", errorData)
      return NextResponse.json({ error: errorData.message || "Failed to create subscription" }, { status: 500 })
    }

    const subscriptionData = await subscriptionResponse.json()
    return NextResponse.json({
      subscriptionId: subscriptionData.id,
      status: subscriptionData.status,
      approvalUrl: subscriptionData.links.find((l: any) => l.rel === "approve")?.href,
    })

  } catch (error) {
    console.error("Create subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
