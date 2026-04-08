import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")

  console.log("[Auth Callback] code:", !!code, "error:", error)
  console.log("[Auth Callback] full URL:", request.url)

  if (error) {
    console.error("[Auth Callback] OAuth error:", error)
    return NextResponse.redirect(new URL("/?auth_error=" + encodeURIComponent(error), requestUrl.origin))
  }

  if (!code) {
    console.error("[Auth Callback] No code provided")
    return NextResponse.redirect(new URL("/", requestUrl.origin))
  }

  const supabase = await createClient()
  console.log("[Auth Callback] Supabase client created, URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)

  const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
  console.log("[Auth Callback] exchangeCodeForSession result:", !!data.session, "error:", sessionError?.message)

  if (sessionError) {
    console.error("[Auth Callback] Session exchange error:", sessionError.message)
    return NextResponse.redirect(new URL("/?auth_error=" + encodeURIComponent(sessionError.message), requestUrl.origin))
  }

  if (data.session) {
    console.log("[Auth Callback] Session established for user:", data.session.user.email)
  }

  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
