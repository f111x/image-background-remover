// PayPal Create Subscription API - Monthly Pro Plan
// POST /api/paypal/create-subscription

const SUBSCRIPTION_PLANS = {
  'pro-monthly': {
    name: 'Pro Monthly',
    credits: 100, // daily credits
    price: 9.9, // USD
    interval: 'MONTH',
    description: 'Pro Plan - 100 credits daily, unlimited monthly'
  }
}

// Get PayPal access token
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

// Create product (only once, but we'll create on-the-fly for simplicity)
async function ensureProduct(accessToken, clientId) {
  const productPayload = {
    name: 'ImageTools Pro Subscription',
    type: 'SERVICE',
    description: 'AI Image Background Remover - Pro Plan',
    category: 'SOFTWARE',
    image_url: 'https://image-background-remover.fx9038.workers.dev/icon.png',
    home_url: 'https://image-background-remover.fx9038.workers.dev',
  }
  
  const productResponse = await fetch('https://api-m.sandbox.paypal.com/v1/catalogs/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `product_${clientId}`,
    },
    body: JSON.stringify(productPayload),
  })
  
  if (productResponse.ok) {
    return await productResponse.json()
  }
  // If product already exists, try to get it
  const productsList = await fetch('https://api-m.sandbox.paypal.com/v1/catalogs/products', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })
  const products = await productsList.json()
  return products.products?.[0] || null
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { planId = 'pro-monthly', userId } = await context.request.json()
    
    if (!SUBSCRIPTION_PLANS[planId]) {
      return new Response(JSON.stringify({ error: 'Invalid subscription plan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const plan = SUBSCRIPTION_PLANS[planId]
    const clientId = context.env.PAYPAL_CLIENT_ID
    const clientSecret = context.env.PAYPAL_CLIENT_SECRET
    const kv = context.env.USER_DATA
    const siteUrl = context.env.NEXT_PUBLIC_SITE_URL || 'https://image-background-remover.fx9038.workers.dev'
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(clientId, clientSecret)
    
    // Create product
    const product = await ensureProduct(accessToken, clientId)
    if (!product) {
      throw new Error('Failed to create/get PayPal product')
    }
    
    // Create billing plan
    const planPayload = {
      name: plan.name,
      description: plan.description,
      type: 'INFINITE',
      payment_definitions: [{
        name: 'Pro Monthly Subscription',
        type: 'REGULAR',
        frequency: 'MONTH',
        frequency_interval: '1',
        amount: {
          currency: 'USD',
          value: plan.price.toFixed(2)
        },
        cycles: '0', // Infinite
        charge_models: [{
          type: 'TAX',
          amount: {
            currency: 'USD',
            value: '0.00'
          }
        }]
      }],
      merchant_preferences: {
        setup_fee: {
          currency: 'USD',
          value: plan.price.toFixed(2)
        },
        return_url: `${siteUrl}/pricing?subscription=success`,
        cancel_url: `${siteUrl}/pricing?subscription=cancelled`,
        auto_bill_amount: 'YES',
        initial_fail_amount_action: 'CONTINUE',
        max_fail_attempts: '3'
      }
    }
    
    const billingPlanResponse = await fetch('https://api-m.sandbox.paypal.com/v1/billing/plans', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `plan_pro_monthly_${userId || 'guest'}_${Date.now()}`,
      },
      body: JSON.stringify(planPayload),
    })
    
    if (!billingPlanResponse.ok) {
      const error = await billingPlanResponse.text()
      throw new Error(`Failed to create billing plan: ${error}`)
    }
    
    const billingPlan = await billingPlanResponse.json()
    
    // Activate the plan
    await fetch(`https://api-m.sandbox.paypal.com/v1/billing/plans/${billingPlan.id}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    
    // Create subscription
    const subscriptionPayload = {
      plan_id: billingPlan.id,
      subscriber: {
        email_address: 'user@example.com', // Will be overridden by PayPal account
      },
      application_context: {
        brand_name: 'ImageTools',
        user_action: 'SUBSCRIBE_NOW',
        return_url: `${siteUrl}/pricing?subscription=success`,
        cancel_url: `${siteUrl}/pricing?subscription=cancelled`,
      },
      custom_id: `${userId || 'guest'}_${planId}`,
    }
    
    const subscriptionResponse = await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `sub_${userId || 'guest'}_${Date.now()}`,
      },
      body: JSON.stringify(subscriptionPayload),
    })
    
    if (!subscriptionResponse.ok) {
      const error = await subscriptionResponse.text()
      throw new Error(`Failed to create subscription: ${error}`)
    }
    
    const subscription = await subscriptionResponse.json()
    
    // Store subscription mapping in KV
    await kv.put(`paypal_subscription:${subscription.id}`, JSON.stringify({
      planId,
      userId: userId || 'guest',
      status: 'pending',
      plan: billingPlan.id,
      createdAt: new Date().toISOString()
    }), { expirationTtl: 86400 * 30 })
    
    // Find approval URL
    const approvalUrl = subscription.links.find(link => link.rel === 'approve')?.href
    
    return new Response(JSON.stringify({
      subscriptionId: subscription.id,
      approveUrl: approvalUrl,
      planId: billingPlan.id
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('PayPal create-subscription error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
