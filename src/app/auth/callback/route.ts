import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/profile"
  return value
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = safeNextPath(requestUrl.searchParams.get("next"))
  const origin = requestUrl.origin

  if (!code) {
    const error = requestUrl.searchParams.get("error_description") || requestUrl.searchParams.get("error") || "Missing OAuth code"
    const redirectUrl = new URL("/login", origin)
    redirectUrl.searchParams.set("error", error)
    redirectUrl.searchParams.set("next", next)
    return NextResponse.redirect(redirectUrl)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("OAuth callback exchange failed:", error)
    const redirectUrl = new URL("/login", origin)
    redirectUrl.searchParams.set("error", error.message)
    redirectUrl.searchParams.set("next", next)
    return NextResponse.redirect(redirectUrl)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email || "", credits: 2, total_credits: 0 }, { onConflict: "id", ignoreDuplicates: true })
    if (profileError) console.error("OAuth callback profile upsert failed:", profileError)
  }

  return NextResponse.redirect(new URL(next, origin))
}
