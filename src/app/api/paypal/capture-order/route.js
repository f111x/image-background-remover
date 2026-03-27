// PayPal Capture Order API - Complete payment after user approval
// POST /api/paypal/capture-order

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
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { orderId, userId } = await context.request.json()
    
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Missing orderId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const clientId = context.env.PAYPAL_CLIENT_ID
    const clientSecret = context.env.PAYPAL_CLIENT_SECRET
    const kv = context.env.USER_DATA
    
    // Get access token
    const accessToken = await getPayPalAccessToken(clientId, clientSecret)
    
    // Capture the order
    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v1/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `capture_${orderId}_${Date.now()}`,
      },
    })
    
    if (!captureResponse.ok) {
      const error = await captureResponse.text()
      throw new Error(`Failed to capture PayPal order: ${error}`)
    }
    
    const captureData = await captureResponse.json()
    
    // Update KV with captured status
    const orderData = await kv.get(`paypal_order:${orderId}`)
    if (orderData) {
      const orderInfo = JSON.parse(orderData)
      orderInfo.status = 'captured'
      orderInfo.capturedAt = new Date().toISOString()
      await kv.put(`paypal_order:${orderId}`, JSON.stringify(orderInfo))
      
      // Add credits to user
      if (orderInfo.userId && orderInfo.userId !== 'guest') {
        const creditsKey = `credits:${orderInfo.userId}`
        const currentCredits = await kv.get(creditsKey)
        const credits = currentCredits ? parseInt(currentCredits) : 0
        await kv.put(creditsKey, (credits + orderInfo.credits).toString(), { expirationTtl: 86400 * 365 })
        
        // Also update user's purchase history
        const purchaseHistoryKey = `purchases:${orderInfo.userId}`
        const history = await kv.get(purchaseHistoryKey)
        const purchases = history ? JSON.parse(history) : []
        purchases.push({
          type: 'credits',
          packageId: orderInfo.packageId,
          credits: orderInfo.credits,
          price: orderInfo.price,
          orderId,
          purchasedAt: new Date().toISOString()
        })
        await kv.put(purchaseHistoryKey, JSON.stringify(purchases), { expirationTtl: 86400 * 365 })
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      status: captureData.status,
      credits: orderData ? JSON.parse(orderData).credits : 0,
      message: 'Payment captured successfully!'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('PayPal capture-order error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
