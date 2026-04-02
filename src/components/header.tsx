"use client"

import Link from "next/link"
import { Upload, LogIn, LogOut, Coins, UserCircle, Globe, ChevronDown, Scissors, Sparkles } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { SignInDialog } from "./sign-in-dialog"
import { useLanguage } from "@/lib/i18n"

export function Header() {
  const { data: session, status } = useSession()
  const [showSignIn, setShowSignIn] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showToolsMenu, setShowToolsMenu] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    if (session) {
      fetch("/api/user/credits")
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data) setCredits(data.credits)
        })
        .catch(() => {})
    } else {
      setCredits(null)
    }
  }, [session])

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span className="font-bold">ImageTools</span>
            </Link>
            <nav className="flex items-center gap-4">
              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowToolsMenu(!showToolsMenu)}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition"
                >
                  Tools
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showToolsMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowToolsMenu(false)} />
                    <div className="absolute left-0 top-full mt-2 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 min-w-[220px]">
                      <Link
                        href="/tools/background-remover"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        onClick={() => setShowToolsMenu(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Scissors className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Background Remover</div>
                          <div className="text-xs text-muted-foreground">AI-powered background removal</div>
                        </div>
                      </Link>
                      <div className="flex items-center gap-3 px-4 py-3 opacity-60 cursor-not-allowed">
                        <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">AI Image Editor</div>
                          <div className="text-xs text-muted-foreground">Coming Soon</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">
                {t("nav_pricing")}
              </Link>
              <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-primary">
                {t("nav_faq")}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
              </button>
              {showLangMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowLangMenu(false)} 
                  />
                  <div className="absolute right-0 top-full mt-1 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 min-w-[100px]">
                    <button
                      onClick={() => { setLanguage("zh"); setShowLangMenu(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${language === "zh" ? "text-primary font-medium" : "text-gray-600 dark:text-gray-300"}`}
                    >
                      中文
                    </button>
                    <button
                      onClick={() => { setLanguage("en"); setShowLangMenu(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${language === "en" ? "text-primary font-medium" : "text-gray-600 dark:text-gray-300"}`}
                    >
                      English
                    </button>
                  </div>
                </>
              )}
            </div>

            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <>
                {/* Credits badge */}
                {credits !== null && (
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium hover:bg-yellow-500/30 transition"
                  >
                    <Coins className="w-4 h-4" />
                    {credits}
                  </Link>
                )}
                {/* Profile link */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">{t("profile")}</span>
                </Link>
                {/* User name */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hidden md:inline">{session.user?.name || session.user?.email}</span>
                </div>
                {/* Logout */}
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setShowSignIn(true)}>
                <LogIn className="w-4 h-4 mr-2" />
                {t("login")}
              </Button>
            )}
          </div>
        </div>
      </header>

      <SignInDialog isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  )
}
