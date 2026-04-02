/**
 * Unified Credits System
 * 
 * All tools deduct credits through this module.
 * Transaction history is recorded in credit_transactions table.
 */

import { createClient } from "@/lib/supabase/server"

export const TOOL_COSTS: Record<string, number> = {
  "background-remover": 1,
  "ai-editor": 3,
}

export const TOOL_NAMES: Record<string, string> = {
  "background-remover": "Background Remover",
  "ai-editor": "AI Editor",
}

export interface DeductResult {
  success: boolean
  error?: string
  code?: "INSUFFICIENT_CREDITS" | "UNAUTHORIZED" | "DB_ERROR"
  remainingCredits?: number
}

/**
 * Check if user has enough credits for a given tool
 */
export async function checkCredits(userId: string, tool: string): Promise<{
  hasEnough: boolean
  currentCredits: number
  cost: number
}> {
  const cost = TOOL_COSTS[tool] || 1
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single()

  const currentCredits = profile?.credits ?? 0
  return {
    hasEnough: currentCredits >= cost,
    currentCredits,
    cost,
  }
}

/**
 * Deduct credits for a user. Returns error if insufficient.
 * Also records the transaction in credit_transactions.
 */
export async function deductCredits(
  userId: string,
  tool: string,
  description?: string
): Promise<DeductResult> {
  const cost = TOOL_COSTS[tool] || 1
  const toolName = TOOL_NAMES[tool] || tool
  const supabase = await createClient()

  // Get current balance
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, error: "Failed to fetch profile", code: "DB_ERROR" }
  }

  const currentCredits = profile.credits ?? 0

  if (currentCredits < cost) {
    return {
      success: false,
      error: `Insufficient credits. Need ${cost}, have ${currentCredits}`,
      code: "INSUFFICIENT_CREDITS",
      remainingCredits: currentCredits,
    }
  }

  // Deduct credits
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ credits: currentCredits - cost })
    .eq("id", userId)

  if (updateError) {
    return { success: false, error: "Failed to deduct credits", code: "DB_ERROR" }
  }

  // Record transaction
  await supabase.from("credit_transactions").insert({
    user_id: userId,
    type: "consume",
    amount: -cost,
    tool,
    description: description || `Used ${toolName}`,
    balance_after: currentCredits - cost,
  })

  return {
    success: true,
    remainingCredits: currentCredits - cost,
  }
}

/**
 * Add credits to a user account (for purchases and refunds)
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: "purchase" | "subscription" | "refund" | "bonus",
  tool: string,
  description: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Get current balance
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, total_credits")
    .eq("id", userId)
    .single()

  const currentCredits = profile?.credits ?? 0
  const currentTotal = profile?.total_credits ?? 0

  // Update credits
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      credits: currentCredits + amount,
      total_credits: type === "purchase" ? currentTotal + amount : currentTotal,
    })
    .eq("id", userId)

  if (updateError) {
    return { success: false, error: "Failed to add credits" }
  }

  // Record transaction
  await supabase.from("credit_transactions").insert({
    user_id: userId,
    type,
    amount,
    tool,
    description,
    balance_after: currentCredits + amount,
  })

  return { success: true }
}

/**
 * Record usage of a tool (for analytics)
 */
export async function recordUsage(
  userId: string,
  tool: string,
  action: string,
  creditsUsed: number,
  metadata?: Record<string, any>
) {
  const supabase = await createClient()
  await supabase.from("usage_logs").insert({
    user_id: userId,
    tool,
    action,
    credits_used: creditsUsed,
    metadata,
  })
}
