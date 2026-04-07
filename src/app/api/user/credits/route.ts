import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const supabase = await createClient()

    // Check if user exists, if not create
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits, total_credits, is_subscriber, rollover_credits")
      .eq("id", userId)
      .single()

    // If profile doesn't exist, create it
    if (profileError && profileError.code === "PGRST116") {
      const userEmail = session.user.email || ""
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: userEmail,
          credits: 2, // New user bonus: 1 for background removal + 1 for AI editor
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

    // Get total credits including subscription
    const { data: creditsData } = await supabase
      .rpc("get_total_credits", { p_user_id: userId })

    return NextResponse.json({
      credits: creditsData?.total_credits || profile.credits,
      totalCredits: profile.total_credits,
      isSubscriber: profile.is_subscriber || false,
      monthlyCredits: creditsData?.monthly_credits || 0,
      rolloverCredits: profile.rollover_credits || 0,
      oneTimeCredits: profile.credits,
    })
  } catch (error) {
    console.error("Credits API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
