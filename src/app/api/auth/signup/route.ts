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
      
      // Provide clearer error messages
      if (error.message.includes("already registered") || error.message.includes("already exists")) {
        return NextResponse.json(
          { error: "This email is already registered. Try signing in instead." },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Check if user was created
    if (!data.user) {
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 400 }
      )
    }

    // Check if email confirmation is required
    if (!data.session) {
      // Email confirmation is enabled - verification email should be sent
      return NextResponse.json({
        success: true,
        needsEmailConfirmation: true,
        message: "A verification email has been sent. Please check your inbox (and spam folder) and click the link to activate your account.",
      })
    }

    // Email confirmation is disabled - user is directly logged in
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
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
