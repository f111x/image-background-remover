export async function onRequest(context) {
  const url = new URL(context.request.url)
  const userId = url.searchParams.get('userId')
  const action = url.searchParams.get('action')
  
  const SUPABASE_URL = context.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = context.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  }

  if (url.pathname.endsWith('/api/user') && context.request.method === 'GET') {
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400, headers })
    }
    
    const today = new Date().toISOString().split('T')[0]
    
    if (action === 'check') {
      const usageRes = await fetch(`${SUPABASE_URL}/rest/v1/usage?user_id=eq.${userId}&date=eq.${today}`, { headers })
      const usage = await usageRes.json()
      const count = usage?.[0]?.count || 0
      
      const userRes = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=plan`, { headers })
      const user = await userRes.json()
      const plan = user?.[0]?.plan || 'guest'
      
      return new Response(JSON.stringify({
        used: count,
        credits: user?.[0]?.credits || 0,
        plan
      }), { headers })
    }
    
    if (action === 'profile') {
      const userRes = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, { headers })
      const user = await userRes.json()
      
      const usageRes = await fetch(`${SUPABASE_URL}/rest/v1/usage?user_id=eq.${userId}&date=eq.${today}`, { headers })
      const usage = await usageRes.json()
      
      return new Response(JSON.stringify({
        user: user?.[0] || null,
        todayUsage: usage?.[0]?.count || 0
      }), { headers })
    }
  }

  return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers })
}
