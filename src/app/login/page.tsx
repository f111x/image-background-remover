"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [mode, setMode] = useState<"select" | "email">("select")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { t } = useLanguage()
  const router = useRouter()
  const supabase = createClient()

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push("/profile")
      }
    }
    checkUser()
  }, [supabase.auth, router])

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/profile")}`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async () => {
    setIsLoading(true)
    setError("")

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setIsLoading(false)
      return
    }

    router.push("/profile")
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Signup failed")
        setIsLoading(false)
        return
      }

      if (data.needsEmailConfirmation) {
        setError("")
        setSuccessMessage(t("email_confirmation_sent") || "Account created! Please check your email (and spam folder) for a verification link, then sign in.")
        setEmail("")
        setPassword("")
        setMode("select")
        setIsLoading(false)
        return
      }

      router.push("/profile")
    } catch {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload h-8 w-8 text-purple-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
            ImageTools
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          {mode === "select" ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2 text-gray-900">{t("signin")}</h1>
                <p className="text-gray-600">{t("choose_sign_in")}</p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={isLoading}
                  className="w-full bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t("continue_with_google")}
                </Button>

                <Button
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={isLoading}
                  className="w-full bg-[#24292e] text-white hover:bg-[#2f363d]"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  {t("continue_with_github")}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">{t("or")}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setMode("email")}
                  variant="outline"
                  className="w-full"
                >
                  {t("signin_email")}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                {t("no_account")}{" "}
                <Link href="/signup" className="text-purple-500 hover:text-purple-600 font-medium">
                  {t("sign_up")}
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2 text-gray-900">{t("signin_email")}</h1>
                <p className="text-gray-600">{t("enter_email_password")}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">{t("email")}</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("email_placeholder")}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">{t("password")}</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("password_placeholder")}
                    className="w-full"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm text-center">
                    {successMessage}
                  </div>
                )}

                <Button
                  onClick={handleEmailSignIn}
                  disabled={isLoading || !email || !password}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? t("signing_in") : t("login")}
                </Button>

                <Button
                  onClick={handleSignUp}
                  disabled={isLoading || !email || !password}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? t("creating_account") : t("create_account")}
                </Button>
              </div>

              <Button variant="ghost" onClick={() => { setMode("select"); setSuccessMessage(""); setError(""); }} className="w-full mt-4">
                {t("back_to_signin")}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                {t("no_account")}{" "}
                <Link href="/signup" className="text-purple-500 hover:text-purple-600 font-medium">
                  {t("sign_up")}
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:text-purple-500">
            ← {t("back_to_home")}
          </Link>
        </p>
      </div>
    </div>
  )
}
