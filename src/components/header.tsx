"use client"

import Link from "next/link"
import { Upload, LogIn, LogOut, User as UserIcon } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { SignInDialog } from "./sign-in-dialog"

export function Header() {
  const { data: session, status } = useSession()
  const [showSignIn, setShowSignIn] = useState(false)

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
          <div className="flex items-center gap-4 ml-auto">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-muted-foreground hidden sm:inline">{session.user?.name || session.user?.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
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
