import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const next = requestUrl.searchParams.get("next") || "/"

  // 校验 next 参数，防止开放重定向
  if (next && !next.startsWith("/")) {
    console.warn("[Auth Callback] Invalid next param, defaulting to /")
  }
  const safeNext = next.startsWith("/") ? next : "/"

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
    // 直接显示错误，不再盲目重试 OAuth
    return NextResponse.redirect(
      new URL("/?auth_error=" + encodeURIComponent(sessionError.message), requestUrl.origin)
    )
  }

  if (data.session) {
    console.log("[Auth Callback] Session established for user:", data.session.user.email)

    // 确保 profiles 表有记录（新 OAuth 用户首次登录时创建）
    const userId = data.session.user.id
    const userEmail = data.session.user.email || ""

    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle()

      if (!existingProfile) {
        console.log("[Auth Callback] Creating profile for new user:", userId)
        await supabase.from("profiles").insert({
          id: userId,
          email: userEmail,
          credits: 2, // 新用户初始积分
          total_credits: 0,
        })
        console.log("[Auth Callback] Profile created successfully")
      }
    } catch (e) {
      // profile 创建失败不影响登录流程
      console.error("[Auth Callback] Profile creation error (non-fatal):", e)
    }
  }

  // 重定向到目标页面
  return NextResponse.redirect(new URL(safeNext, requestUrl.origin))
}
