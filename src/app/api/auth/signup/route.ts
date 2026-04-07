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

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered. Try signing in instead." },
        { status: 400 }
      )
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error("Signup error:", error)
      
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

    if (!data.user) {
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 400 }
      )
    }

    // Check if user has a session (email confirmation disabled) or needs confirmation
    if (!data.session) {
      // Email confirmation is required - user was created but not logged in
      return NextResponse.json({
        success: true,
        accountCreated: true,
        needsEmailConfirmation: true,
        message: "Account created! Please check your email (and spam folder) for a verification link, then sign in with your email and password.",
      })
    }

    // No email confirmation needed - session is available
    // Create profile for new user
    await supabase.from("profiles").insert({
      id: data.user.id,
      email: email,
      credits: 2, // New user bonus: 1 for background removal + 1 for AI editor
      total_credits: 0,
    })

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
