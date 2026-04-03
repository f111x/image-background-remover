import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error("Signup error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Check if user was created or if email confirmation is required
    if (data.user && data.session) {
      // User was created and has a session (email confirmation disabled)
      // Create profile for new user
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: email,
        credits: 3, // New user bonus
        total_credits: 0,
      })

      return NextResponse.json({
        success: true,
        needsEmailConfirmation: false,
        user: data.user,
      })
    } else if (data.user && !data.session) {
      // User was created but needs email confirmation
      return NextResponse.json({
        success: true,
        needsEmailConfirmation: true,
        message: "Please check your email to verify your account before signing in.",
      })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
