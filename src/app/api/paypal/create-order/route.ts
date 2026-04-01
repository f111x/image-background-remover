import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { packageName, price, credits } = await request.json()

    if (!packageName || !price || !credits) {
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

    // Create order
    const orderResponse = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: `${packageName} - ${credits} credits`,
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
      }),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      return NextResponse.json({ error: errorData.message || "Failed to create order" }, { status: 500 })
    }

    const orderData = await orderResponse.json()
    return NextResponse.json({ orderID: orderData.id })

  } catch (error) {
    console.error("PayPal create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
