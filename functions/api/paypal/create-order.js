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
    const { packageId, userId } = await context.request.json()
    
    const PACKAGES = {
      '10-credits': { credits: 10, price: 0.99 },
      '50-credits': { credits: 50, price: 3.99 },
      '100-credits': { credits: 100, price: 6.99 },
    }
    
    if (!PACKAGES[packageId]) {
      return new Response(JSON.stringify({ error: 'Invalid package' }), { status: 400, headers })
    }
    
    const pkg = PACKAGES[packageId]
    
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
    
    // Create PayPal order
    const siteUrl = context.env.NEXT_PUBLIC_SITE_URL || 'https://imagetoolss.com'
    const orderRes = await fetch('https://api-m.sandbox.paypal.com/v1/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: `${userId}_${packageId}_${Date.now()}`,
          description: `ImageTools - ${pkg.credits} Credits`,
          amount: { currency_code: 'USD', value: pkg.price.toFixed(2) },
        }],
        application_context: {
          brand_name: 'ImageTools',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${siteUrl}/pricing?payment=success`,
          cancel_url: `${siteUrl}/pricing?payment=cancelled`,
        },
      }),
    })
    
    const order = await orderRes.json()
    
    // Save order to Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        id: order.id,
        user_id: userId || 'guest',
        package_id: packageId,
        credits: pkg.credits,
        price: pkg.price,
        status: 'pending',
      }),
    })
    
    const approveUrl = order.links?.find(l => l.rel === 'approve')?.href
    
    return new Response(JSON.stringify({ orderId: order.id, approveUrl }), { headers })
    
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers })
  }
}
