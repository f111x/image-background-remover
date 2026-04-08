import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/supabase/auth-helpers"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const supabase = await import("@/lib/supabase/server").then(m => m.createClient())

    // Check if user profile exists, if not create with 2 free credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits, total_credits, is_subscriber, rollover_credits")
      .eq("id", userId)
      .maybeSingle()

    // If profile doesn't exist, create it
    if (!profile) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          credits: 2,
          total_credits: 0,
        })

      if (insertError) {
        return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
      }

      return NextResponse.json({
        credits: 2,
        totalCredits: 0,
        isSubscriber: false,
        monthlyCredits: 0,
        rolloverCredits: 0,
        oneTimeCredits: 2,
      })
    }

    if (profileError) {
      return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 })
    }

    // Get total credits including subscription via RPC
    const { data: creditsData } = await supabase
      .rpc("get_total_credits", { p_user_id: userId })

    return NextResponse.json({
      credits: creditsData?.total_credits ?? profile.credits ?? 0,
      totalCredits: profile.total_credits ?? 0,
      isSubscriber: profile.is_subscriber ?? false,
      monthlyCredits: creditsData?.monthly_credits ?? 0,
      rolloverCredits: profile.rollover_credits ?? 0,
      oneTimeCredits: profile.credits ?? 0,
    })
  } catch (error) {
    console.error("Credits API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
