"use client"

import Link from "next/link"
import { Upload, LogIn, LogOut, Coins, UserCircle, Globe, Wand2, Scissors } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { SignInDialog } from "./sign-in-dialog"
import { useLanguage } from "@/lib/i18n"

type Tool = "remove-bg" | "ai-editor"

export function Header() {
  const { data: session, status } = useSession()
  const [showSignIn, setShowSignIn] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [activeTool, setActiveTool] = useState<Tool>("remove-bg")
  const [showToolMenu, setShowToolMenu] = useState(false)
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

  // Determine active tool from current path
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      if (path.includes("ai-editor") || path.includes("generate")) {
        setActiveTool("ai-editor")
      } else {
        setActiveTool("remove-bg")
      }
    }
  }, [])

  const tools = [
    {
      id: "remove-bg" as Tool,
      name: t("nav_remove_bg") || "Remove Background",
      icon: Scissors,
      href: "/#editor",
      description: "Remove image backgrounds instantly",
    },
    {
      id: "ai-editor" as Tool,
      name: t("nav_ai_editor") || "AI Editor",
      icon: Wand2,
      href: "/#ai-editor",
      description: "Edit images with AI prompts",
    },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setShowToolMenu(false)
  }

  const currentTool = tools.find((tool) => tool.id === activeTool) || tools[0]

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span className="font-bold">ImageTools</span>
            </Link>

            {/* Tool Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowToolMenu(!showToolMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {currentTool.icon && <currentTool.icon className="w-4 h-4" />}
                <span>{currentTool.name}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showToolMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowToolMenu(false)}
                  />
                  <div className="absolute left-0 top-full mt-1 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 min-w-[200px]">
                    {tools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => scrollToSection(tool.href)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                          activeTool === tool.id ? "bg-purple-50 dark:bg-purple-900/20" : ""
                        }`}
                      >
                        <tool.icon className={`w-5 h-5 ${activeTool === tool.id ? "text-purple-500" : "text-gray-500"}`} />
                        <div>
                          <div className={`text-sm font-medium ${activeTool === tool.id ? "text-purple-600 dark:text-purple-400" : ""}`}>
                            {tool.name}
                          </div>
                          <div className="text-xs text-muted-foreground">{tool.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <nav className="flex items-center gap-4">
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
