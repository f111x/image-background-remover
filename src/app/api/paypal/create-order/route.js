// PayPal Create Order API - One-time credit package purchase
// POST /api/paypal/create-order

const CREDIT_PACKAGES = {
  '10-credits': { credits: 10, price: 0.99 },
  '50-credits': { credits: 50, price: 3.99 },
  '100-credits': { credits: 100, price: 6.99 },
}

async function getPayPalAccessToken(clientId, clientSecret) {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get PayPal access token: ${error}`)
  }
  
  const data = await response.json()
  return data.access_token
}

export async function onRequest(context) {
  // Only allow POST
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { packageId, userId } = await context.request.json()
    
    if (!packageId || !CREDIT_PACKAGES[packageId]) {
      return new Response(JSON.stringify({ error: 'Invalid package ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const pkg = CREDIT_PACKAGES[packageId]
    const clientId = context.env.PAYPAL_CLIENT_ID
    const clientSecret = context.env.PAYPAL_CLIENT_SECRET
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(clientId, clientSecret)
    
    // Create PayPal order
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: `${userId || 'guest'}_${packageId}_${Date.now()}`,
        description: `Image Background Remover - ${pkg.credits} Credits`,
        amount: {
          currency_code: 'USD',
          value: pkg.price.toFixed(2),
        }
      }],
      application_context: {
        brand_name: 'ImageTools',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${context.env.NEXT_PUBLIC_SITE_URL || 'https://image-background-remover.fx9038.workers.dev'}/pricing?payment=success`,
        cancel_url: `${context.env.NEXT_PUBLIC_SITE_URL || 'https://image-background-remover.fx9038.workers.dev'}/pricing?payment=cancelled`,
      }
    }
    
    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v1/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `order_${userId || 'guest'}_${Date.now()}`,
      },
      body: JSON.stringify(orderPayload),
    })
    
    if (!orderResponse.ok) {
      const error = await orderResponse.text()
      throw new Error(`Failed to create PayPal order: ${error}`)
    }
    
    const order = await orderResponse.json()
    
    // Store order mapping in KV for later verification
    const kv = context.env.USER_DATA
    await kv.put(`paypal_order:${order.id}`, JSON.stringify({
      packageId,
      credits: pkg.credits,
      price: pkg.price,
      userId: userId || 'guest',
      status: 'pending',
      createdAt: new Date().toISOString()
    }), { expirationTtl: 86400 * 2 })
    
    return new Response(JSON.stringify({
      orderId: order.id,
      approveUrl: order.links.find(link => link.rel === 'approve').href
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('PayPal create-order error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
