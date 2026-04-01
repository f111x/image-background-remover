import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
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
