import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderID, credits } = await request.json()

    if (!orderID || !credits) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "PayPal not configured" }, { status: 500 })
    }

    // Get access token
    const authResponse = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
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
    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
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
    
    // Check if the order is already captured (idempotency)
    if (captureData.status !== "COMPLETED") {
      return NextResponse.json({ error: `Payment status: ${captureData.status}` }, { status: 400 })
    }

    // TODO: Add credits to user's account here
    // You would typically:
    // 1. Get user ID from session/auth
    // 2. Update user's credits in database (Supabase)
    
    console.log(`Payment captured! Order ID: ${orderID}, Credits: ${credits}`)

    return NextResponse.json({ 
      success: true, 
      message: `Successfully purchased ${credits} credits`,
      orderID: orderID,
    })

  } catch (error) {
    console.error("PayPal verify order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
