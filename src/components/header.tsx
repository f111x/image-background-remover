"use client"

import Link from "next/link"
import { Upload, LogIn, LogOut, Coins, User as UserIcon, UserCircle } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { SignInDialog } from "./sign-in-dialog"

export function Header() {
  const { data: session, status } = useSession()
  const [showSignIn, setShowSignIn] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)

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
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Pricing
              </Link>
              <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-primary">
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 ml-auto">
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
                  <span className="hidden sm:inline">Profile</span>
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
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <SignInDialog isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  )
}
