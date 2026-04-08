import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const next = requestUrl.searchParams.get("next") || "/"

  if (error) {
    console.error("[Auth Callback] OAuth error:", error)
    return NextResponse.redirect(new URL("/?auth_error=" + encodeURIComponent(error), requestUrl.origin))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/", requestUrl.origin))
  }

  const supabase = await createClient()
  const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

  if (sessionError) {
    console.error("[Auth Callback] Session exchange error:", sessionError.message)
    // Fallback: try to sign in with the code directly
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        queryParams: { code },
        redirectTo: requestUrl.origin + next,
      },
    })
    if (signInError) {
      return NextResponse.redirect(new URL("/?auth_error=" + encodeURIComponent(sessionError.message), requestUrl.origin))
    }
  }

  if (data.session) {
    console.log("[Auth Callback] Session established for user:", data.session.user.email)
  }

  // Redirect to the next page
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
