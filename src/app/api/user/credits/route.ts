import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use the new get_total_credits function
    const { data, error: fnError } = await supabase
      .rpc("get_total_credits", { p_user_id: user.id })

    if (fnError) {
      // Fallback to simple profile query if function doesn't exist yet
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("credits, total_credits, is_subscriber, rollover_credits")
        .eq("id", user.id)
        .single()

      if (profileError) {
        return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 })
      }

      return NextResponse.json({
        credits: profile.credits,
        totalCredits: profile.total_credits,
        isSubscriber: profile.is_subscriber,
        rolloverCredits: profile.rollover_credits || 0,
        monthlyCredits: 0,
      })
    }

    return NextResponse.json({
      credits: data.total_credits,
      totalCredits: data.one_time_credits,
      isSubscriber: data.is_subscriber,
      monthlyCredits: data.monthly_credits,
      rolloverCredits: data.rollover_credits,
      oneTimeCredits: data.one_time_credits,
    })
  } catch (error) {
    console.error("Credits API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
