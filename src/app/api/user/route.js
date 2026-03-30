import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const QUOTAS = {
  guest: { daily: 3, description: '游客' },
  registered: { daily: 10, description: '注册用户' },
  paid: { daily: Infinity, description: '付费用户' }
}

function getSupabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// GET /api/user?userId=xxx&action=check|profile
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const action = searchParams.get('action')
  
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const today = new Date().toISOString().split('T')[0]

  if (action === 'check') {
    const { data: usage } = await supabase
      .from('usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .single()
    
    const count = usage?.count || 0
    
    const { data: user } = await supabase
      .from('users')
      .select('plan')
      .eq('id', userId)
      .single()
    
    const plan = user?.plan || 'guest'
    const quota = QUOTAS[plan]
    const remaining = quota.daily === Infinity ? -1 : Math.max(0, quota.daily - count)
    
    return NextResponse.json({
      used: count,
      remaining,
      quota: quota.daily,
      plan,
      isPaid: plan === 'paid'
    })
  }

  if (action === 'profile') {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    const { data: usage } = await supabase
      .from('usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .single()
    
    let profile = {
      isGuest: true,
      plan: 'guest',
      todayUsage: usage?.count || 0,
      quota: QUOTAS.guest.daily
    }
    
    if (user) {
      profile = {
        isGuest: false,
        email: user.email,
        name: user.name,
        plan: user.plan,
        todayUsage: usage?.count || 0,
        quota: QUOTAS[user.plan || 'registered'].daily,
        createdAt: user.created_at
      }
    }
    
    return NextResponse.json(profile)
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// POST /api/user?action=use|register
export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  let body = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { userId, email, name, plan = 'registered' } = body
  const today = new Date().toISOString().split('T')[0]

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  if (action === 'use') {
    const { data: existing } = await supabase
      .from('usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .single()
    
    let count = existing?.count || 0
    
    const { data: user } = await supabase
      .from('users')
      .select('plan')
      .eq('id', userId)
      .single()
    
    const planType = user?.plan || 'guest'
    const quota = QUOTAS[planType]
    
    if (count >= quota.daily && quota.daily !== Infinity) {
      return NextResponse.json({ 
        error: 'Quota exceeded',
        used: count,
        quota: quota.daily
      }, { status: 429 })
    }
    
    count++
    
    if (existing) {
      await supabase
        .from('usage')
        .update({ count })
        .eq('user_id', userId)
        .eq('date', today)
    } else {
      await supabase
        .from('usage')
        .insert({ user_id: userId, date: today, count })
    }
    
    return NextResponse.json({
      success: true,
      used: count,
      remaining: quota.daily === Infinity ? -1 : Math.max(0, quota.daily - count)
    })
  }

  if (action === 'register') {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (existing) {
      await supabase
        .from('users')
        .update({ email, name, plan })
        .eq('id', userId)
    } else {
      await supabase
        .from('users')
        .insert({ id: userId, email, name, plan })
    }
    
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
