import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const PLAN_CREDITS: Record<string, number> = {
  [process.env.PAYPAL_PLAN_BASIC || "P-8A321606Y3031753VNHHKA2A"]: 50,  // Basic
  [process.env.PAYPAL_PLAN_PRO || "P-1E622203E00202506NHHKA5Q"]: 200, // Pro
}

export async function POST(request: NextRequest) {
  try {
    const webhookEvent = await request.json()
    const eventType = webhookEvent.event_type
    const webhookId = process.env.PAYPAL_WEBHOOK_ID

    console.log(`📌 PayPal Webhook: ${eventType}`)

    // Verify webhook signature (in production, you should verify this)
    // For now, we'll trust the webhook

    const supabase = await createClient()

    switch (eventType) {
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const subscription = webhookEvent.resource
        const userId = subscription.custom_id
        const planId = subscription.plan_id
        const subscriptionId = subscription.id

        if (!userId || !PLAN_CREDITS[planId]) {
          console.error("Missing userId or planId in ACTIVATED event")
          break
        }

        const credits = PLAN_CREDITS[planId]

        // Get current profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits, is_subscriber, subscription_id, subscription_plan")
          .eq("id", userId)
          .single()

        const currentCredits = profile?.credits || 0

        // Update profile with subscription info
        await supabase
          .from("profiles")
          .update({
            credits: currentCredits + credits,
            is_subscriber: true,
            subscription_id: subscriptionId,
            subscription_plan: planId,
            subscription_status: "active",
            last_subscription_credit: credits,
          })
          .eq("id", userId)

        console.log(`✅ Subscription activated: user=${userId}, plan=${planId}, credits=${credits}`)
        break
      }

      case "PAYMENT.SALE.COMPLETED": {
        // Monthly renewal - add credits
        const payment = webhookEvent.resource
        const subscriptionId = payment.billing_agreement_id

        if (!subscriptionId) break

        // Find user by subscription_id
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, subscription_plan, credits")
          .eq("subscription_id", subscriptionId)
          .single()

        if (!profile || !PLAN_CREDITS[profile.subscription_plan]) {
          console.error("Profile not found for subscription:", subscriptionId)
          break
        }

        const credits = PLAN_CREDITS[profile.subscription_plan]
        const currentCredits = profile.credits || 0

        await supabase
          .from("profiles")
          .update({
            credits: currentCredits + credits,
            last_subscription_credit: credits,
          })
          .eq("id", profile.id)

        console.log(`✅ Renewal payment completed: user=${profile.id}, credits=${credits}`)
        break
      }

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        const subscription = webhookEvent.resource
        const subscriptionId = subscription.id

        await supabase
          .from("profiles")
          .update({
            is_subscriber: false,
            subscription_status: "cancelled",
          })
          .eq("subscription_id", subscriptionId)

        console.log(`❌ Subscription cancelled/expired: ${subscriptionId}`)
        break
      }

      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        const subscription = webhookEvent.resource
        const subscriptionId = subscription.id

        await supabase
          .from("profiles")
          .update({
            subscription_status: "suspended",
          })
          .eq("subscription_id", subscriptionId)

        console.log(`⚠️ Subscription suspended: ${subscriptionId}`)
        break
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
