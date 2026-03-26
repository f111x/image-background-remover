// User API - check and update usage quotas
// KV binding: USER_DATA with keys:
// - usage:{userId}:{date} -> count
// - user:{userId} -> {email, name, plan, createdAt}

const QUOTAS = {
  guest: { daily: 3, description: '游客' },
  registered: { daily: 10, description: '注册用户' },
  paid: { daily: Infinity, description: '付费用户' }
}

export async function onRequest(context) {
  const url = new URL(context.request.url)
  const userId = url.searchParams.get('userId')
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const kv = context.env.USER_DATA
  const today = new Date().toISOString().split('T')[0]
  
  if (url.pathname.endsWith('/check')) {
    // Check current usage
    const key = `usage:${userId}:${today}`
    const usage = await kv.get(key)
    const count = usage ? parseInt(usage) : 0
    
    // Determine user plan
    const userData = await kv.get(`user:${userId}`)
    let plan = 'guest'
    if (userData) {
      const user = JSON.parse(userData)
      plan = user.plan || 'registered'
    }
    
    const quota = QUOTAS[plan]
    const remaining = quota.daily === Infinity ? -1 : Math.max(0, quota.daily - count)
    
    return new Response(JSON.stringify({
      used: count,
      remaining,
      quota: quota.daily,
      plan,
      isPaid: plan === 'paid'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (url.pathname.endsWith('/use')) {
    // Increment usage
    const key = `usage:${userId}:${today}`
    const usage = await kv.get(key)
    let count = usage ? parseInt(usage) : 0
    
    // Check user plan
    const userData = await kv.get(`user:${userId}`)
    let plan = 'guest'
    if (userData) {
      const user = JSON.parse(userData)
      plan = user.plan || 'registered'
    }
    
    const quota = QUOTAS[plan]
    
    // Check if limit exceeded
    if (count >= quota.daily && quota.daily !== Infinity) {
      return new Response(JSON.stringify({ 
        error: 'Quota exceeded',
        used: count,
        quota: quota.daily
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    count++
    await kv.put(key, count.toString(), { expirationTtl: 86400 * 2 }) // Keep for 2 days
    
    return new Response(JSON.stringify({
      success: true,
      used: count,
      remaining: quota.daily === Infinity ? -1 : Math.max(0, quota.daily - count)
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (url.pathname.endsWith('/register')) {
    // Register user
    const body = await context.request.json()
    const { email, name, plan = 'registered' } = body
    
    const userData = JSON.stringify({
      email,
      name,
      plan,
      createdAt: new Date().toISOString()
    })
    
    await kv.put(`user:${userId}`, userData)
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (url.pathname.endsWith('/profile')) {
    // Get user profile
    const userData = await kv.get(`user:${userId}`)
    const key = `usage:${userId}:${today}`
    const usage = await kv.get(key)
    
    let profile = {
      isGuest: true,
      plan: 'guest',
      todayUsage: usage ? parseInt(usage) : 0,
      quota: QUOTAS.guest.daily
    }
    
    if (userData) {
      const user = JSON.parse(userData)
      profile = {
        isGuest: false,
        email: user.email,
        name: user.name,
        plan: user.plan,
        todayUsage: usage ? parseInt(usage) : 0,
        quota: QUOTAS[user.plan || 'registered'].daily,
        createdAt: user.createdAt
      }
    }
    
    return new Response(JSON.stringify(profile), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  })
}
