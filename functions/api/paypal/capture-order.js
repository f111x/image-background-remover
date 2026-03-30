export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const SUPABASE_URL = context.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = context.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const PAYPAL_CLIENT_ID = context.env.PAYPAL_CLIENT_ID
  const PAYPAL_CLIENT_SECRET = context.env.PAYPAL_CLIENT_SECRET

  const headers = { 'Content-Type': 'application/json' }

  try {
    const { orderId } = await context.request.json()
    
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Missing orderId' }), { status: 400, headers })
    }
    
    // Get PayPal access token
    const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })
    const { access_token } = await tokenRes.json()
    
    // Capture the order
    const captureRes = await fetch(`https://api-m.sandbox.paypal.com/v1/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!captureRes.ok) {
      throw new Error('Failed to capture order')
    }
    
    const captureData = await captureRes.json()
    
    // Get order info from Supabase
    const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })
    const orders = await orderRes.json()
    const order = orders?.[0]
    
    if (order) {
      // Update order status
      await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ status: 'captured' }),
      })
      
      // Add credits to user
      if (order.user_id && order.user_id !== 'guest') {
        // Get current credits
        const creditsRes = await fetch(`${SUPABASE_URL}/rest/v1/credits?user_id=eq.${order.user_id}`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        })
        const creditsData = await creditsRes.json()
        const currentBalance = creditsData?.[0]?.balance || 0
        
        // Upsert new balance
        await fetch(`${SUPABASE_URL}/rest/v1/credits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            user_id: order.user_id,
            balance: currentBalance + order.credits,
          }),
        })
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      status: captureData.status,
      credits: order?.credits || 0,
    }), { headers })
    
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers })
  }
}
