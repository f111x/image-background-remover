import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/supabase/auth-helpers"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const supabase = await createClient()

    const { data: purchases, error: purchasesError } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)

    if (purchasesError) {
      console.error("Purchases fetch error:", purchasesError)
    }

    const { data: usage, error: usageError } = await supabase
      .from("usage_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (usageError) {
      console.error("Usage fetch error:", usageError)
    }

    return NextResponse.json({
      purchases: purchases || [],
      usage: usage || [],
    })
  } catch (error) {
    console.error("History API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
