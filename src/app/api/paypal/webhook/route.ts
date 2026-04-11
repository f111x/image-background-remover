import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const PLAN_CREDITS: Record<string, number> = {
  [process.env.PAYPAL_PLAN_BASIC || "P-8A321606Y3031753VNHHKA2A"]: 50,  // Basic
  [process.env.PAYPAL_PLAN_PRO || "P-1E622203E00202506NHHKA5Q"]: 200, // Pro
}

const PLAN_NAMES: Record<string, string> = {
  [process.env.PAYPAL_PLAN_BASIC || "P-8A321606Y3031753VNHHKA2A"]: "Basic",
  [process.env.PAYPAL_PLAN_PRO || "P-1E622203E00202506NHHKA5Q"]: "Pro",
}

export async function POST(request: NextRequest) {
  try {
    const webhookEvent = await request.json()
    const eventType = webhookEvent.event_type

    console.log(`📌 PayPal Webhook: ${eventType}`)

    const supabase = await createClient()

    switch (eventType) {
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const subscription = webhookEvent.resource
        const userId = subscription.custom_id
        const planId = subscription.plan_id
        const subscriptionId = subscription.id

        if (!userId) {
          console.error("Missing userId in ACTIVATED event")
          break
        }

        const monthlyCredits = PLAN_CREDITS[planId] || 50
        const planName = PLAN_NAMES[planId] || "Basic"

        // Upsert subscription record (for deduct_credits RPC to read monthly_credits)
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          plan: planName,
          status: "active",
          subscription_id: subscriptionId,
          subscription_plan: planId,
          subscription_status: "active",
          monthly_credits: monthlyCredits,
          next_billing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          last_subscription_credit: monthlyCredits,
        }, {
          onConflict: "user_id",
        }).catch(err => console.error("subscriptions upsert error:", err))

        // Update profile (no longer stores credits directly — only subscriptions table does)
        await supabase
          .from("profiles")
          .update({
            is_subscriber: true,
            subscription_status: "active",
          })
          .eq("id", userId)
          .catch(err => console.error("profiles update error:", err))

        console.log(`✅ Subscription activated: user=${userId}, plan=${planName}, monthly=${monthlyCredits}`)
        break
      }

      case "PAYMENT.SALE.COMPLETED": {
        // Monthly renewal — add monthly_credits to subscriptions table
        const payment = webhookEvent.resource
        const subscriptionId = payment.billing_agreement_id

        if (!subscriptionId) break

        const { data: sub } = await supabase
          .from("subscriptions")
          .select("id, user_id, plan, monthly_credits")
          .eq("subscription_id", subscriptionId)
          .single()

        if (!sub) {
          console.error("Subscription not found for:", subscriptionId)
          break
        }

        const planCredits = PLAN_CREDITS[sub.plan] || 50

        await supabase
          .from("subscriptions")
          .update({
            monthly_credits: planCredits,
            last_subscription_credit: planCredits,
            next_billing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("id", sub.id)
          .catch(err => console.error("subscriptions update error:", err))

        console.log(`✅ Renewal payment completed: user=${sub.user_id}, monthly_credits reset to=${planCredits}`)
        break
      }

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        const subscription = webhookEvent.resource
        const subscriptionId = subscription.id

        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", subscription_status: "cancelled" })
          .eq("subscription_id", subscriptionId)
          .catch(err => console.error("subscriptions cancel error:", err))

        await supabase
          .from("profiles")
          .update({ is_subscriber: false, subscription_status: "cancelled" })
          .eq("subscription_id", subscriptionId)
          .catch(err => console.error("profiles cancel error:", err))

        console.log(`❌ Subscription cancelled/expired: ${subscriptionId}`)
        break
      }

      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        const subscription = webhookEvent.resource
        const subscriptionId = subscription.id

        await supabase
          .from("subscriptions")
          .update({ subscription_status: "suspended" })
          .eq("subscription_id", subscriptionId)
          .catch(err => console.error("subscriptions suspend error:", err))

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
