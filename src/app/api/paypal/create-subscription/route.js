import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const SUBSCRIPTION_PLANS = {
  'pro-monthly': {
    name: 'Pro Monthly',
    credits: 100,
    price: 9.9,
    interval: 'MONTH',
    description: 'Pro Plan - 100 credits daily, unlimited monthly'
  }
}

function getSupabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
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

async function ensureProduct(accessToken, clientId) {
  const productPayload = {
    name: 'ImageTools Pro Subscription',
    type: 'SERVICE',
    description: 'AI Image Background Remover - Pro Plan',
    category: 'SOFTWARE',
    image_url: 'https://imagetoolss.com/icon.png',
    home_url: 'https://imagetoolss.com',
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
  const productsList = await fetch('https://api-m.sandbox.paypal.com/v1/catalogs/products', {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  })
  const products = await productsList.json()
  return products.products?.[0] || null
}

// POST /api/paypal/create-subscription
export async function POST(request) {
  try {
    const { planId = 'pro-monthly', userId } = await request.json()
    
    if (!SUBSCRIPTION_PLANS[planId]) {
      return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 })
    }
    
    const plan = SUBSCRIPTION_PLANS[planId]
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    const supabase = getSupabaseAdmin()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://imagetoolss.com'
    
    const accessToken = await getPayPalAccessToken(clientId, clientSecret)
    
    const product = await ensureProduct(accessToken, clientId)
    if (!product) {
      throw new Error('Failed to create/get PayPal product')
    }
    
    const planPayload = {
      name: plan.name,
      description: plan.description,
      type: 'INFINITE',
      payment_definitions: [{
        name: 'Pro Monthly Subscription',
        type: 'REGULAR',
        frequency: 'MONTH',
        frequency_interval: '1',
        amount: { currency: 'USD', value: plan.price.toFixed(2) },
        cycles: '0',
        charge_models: [{
          type: 'TAX',
          amount: { currency: 'USD', value: '0.00' }
        }]
      }],
      merchant_preferences: {
        setup_fee: { currency: 'USD', value: plan.price.toFixed(2) },
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
    
    await fetch(`https://api-m.sandbox.paypal.com/v1/billing/plans/${billingPlan.id}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    
    const subscriptionPayload = {
      plan_id: billingPlan.id,
      subscriber: { email_address: 'user@example.com' },
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
    
    await supabase
      .from('subscriptions')
      .insert({
        id: subscription.id,
        user_id: userId || 'guest',
        plan_id: planId,
        paypal_plan_id: billingPlan.id,
        status: 'pending',
      })
    
    const approvalUrl = subscription.links.find(link => link.rel === 'approve')?.href
    
    return NextResponse.json({
      subscriptionId: subscription.id,
      approveUrl: approvalUrl,
      planId: billingPlan.id
    })
    
  } catch (error) {
    console.error('PayPal create-subscription error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
