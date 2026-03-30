export const runtime = 'edge'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const QUOTAS = {
  guest: { daily: 3, description: '游客' },
  registered: { daily: 10, description: '注册用户' },
  paid: { daily: Infinity, description: '付费用户' }
}

async function supabaseFetch(table, options = {}) {
  const { select = '*', eq } = options
  let url = `${SUPABASE_URL}/rest/v1/${table}`
  const params = []
  
  if (select) params.push(`select=${select}`)
  if (eq) params.push(`${eq[0]}=eq.${eq[1]}`)
  
  if (params.length > 0) url += `?${params.join('&')}`
  
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
  
  const res = await fetch(url, { headers })
  return res.json()
}

async function supabaseUpdate(table, data, eq) {
  let url = `${SUPABASE_URL}/rest/v1/${table}`
  const params = [`${eq[0]}=eq.${eq[1]}`]
  url += `?${params.join('&')}`
  
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
  
  return fetch(url, { method: 'PATCH', headers, body: JSON.stringify(data) })
}

async function supabaseInsert(table, data) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
  return fetch(url, { method: 'POST', headers, body: JSON.stringify(data) })
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const action = searchParams.get('action')
  
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0]

  if (action === 'check') {
    const usageData = await supabaseFetch('usage', { select: 'count', eq: ['user_id', userId] })
    const count = usageData?.[0]?.count || 0
    
    const userData = await supabaseFetch('users', { select: 'plan', eq: ['id', userId] })
    const user = userData?.[0]
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
    const userData = await supabaseFetch('users', { select: '*', eq: ['id', userId] })
    const user = userData?.[0]
    const usageData = await supabaseFetch('usage', { select: 'count', eq: ['user_id', userId] })
    
    let profile = {
      isGuest: true,
      plan: 'guest',
      todayUsage: usageData?.[0]?.count || 0,
      quota: QUOTAS.guest.daily
    }
    
    if (user) {
      profile = {
        isGuest: false,
        email: user.email,
        name: user.name,
        plan: user.plan,
        todayUsage: usageData?.[0]?.count || 0,
        quota: QUOTAS[user.plan || 'registered'].daily,
        createdAt: user.created_at
      }
    }
    
    return NextResponse.json(profile)
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function POST(request) {
  let body = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  const { userId, email, name, plan = 'registered' } = body
  const today = new Date().toISOString().split('T')[0]

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  if (action === 'use') {
    const existingData = await supabaseFetch('usage', { select: 'count', eq: ['user_id', userId] })
    const existing = existingData?.[0]
    let count = existing?.count || 0
    
    const userData = await supabaseFetch('users', { select: 'plan', eq: ['id', userId] })
    const planType = userData?.[0]?.plan || 'guest'
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
      await supabaseUpdate('usage', { count }, ['user_id', userId])
    } else {
      await supabaseInsert('usage', { user_id: userId, date: today, count })
    }
    
    return NextResponse.json({
      success: true,
      used: count,
      remaining: quota.daily === Infinity ? -1 : Math.max(0, quota.daily - count)
    })
  }

  if (action === 'register') {
    await supabaseUpdate('users', { email, name, plan }, ['id', userId])
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
