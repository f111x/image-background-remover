export const runtime = 'edge'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const SUBSCRIPTION_PLANS = {
  'pro-monthly': { name: 'Pro Monthly', credits: 100, price: 9.9 }
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

async function getPayPalAccessToken(clientId, clientSecret) {
  const auth = btoa(`${clientId}:${clientSecret}`)
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await response.json()
  return data.access_token
}

export async function POST(request) {
  try {
    const { planId = 'pro-monthly', userId } = await request.json()
    
    if (!SUBSCRIPTION_PLANS[planId]) {
      return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 })
    }
    
    const plan = SUBSCRIPTION_PLANS[planId]
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://imagetoolss.com'
    
    const accessToken = await getPayPalAccessToken(clientId, clientSecret)
    
    const planPayload = {
      name: plan.name,
      description: `Pro Plan - ${plan.credits} credits daily`,
      type: 'INFINITE',
      payment_definitions: [{
        name: 'Pro Monthly',
        type: 'REGULAR',
        frequency: 'MONTH',
        frequency_interval: '1',
        amount: { currency: 'USD', value: plan.price.toFixed(2) },
        cycles: '0',
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
        'PayPal-Request-Id': `plan_${planId}_${userId}_${Date.now()}`,
      },
      body: JSON.stringify(planPayload),
    })
    
    if (!billingPlanResponse.ok) {
      throw new Error('Failed to create billing plan')
    }
    
    const billingPlan = await billingPlanResponse.json()
    
    await fetch(`https://api-m.sandbox.paypal.com/v1/billing/plans/${billingPlan.id}/activate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    })
    
    const subscriptionResponse = await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `sub_${userId}_${Date.now()}`,
      },
      body: JSON.stringify({
        plan_id: billingPlan.id,
        subscriber: { email_address: 'user@example.com' },
        application_context: {
          brand_name: 'ImageTools',
          user_action: 'SUBSCRIBE_NOW',
          return_url: `${siteUrl}/pricing?subscription=success`,
          cancel_url: `${siteUrl}/pricing?subscription=cancelled`,
        },
        custom_id: `${userId}_${planId}`,
      }),
    })
    
    if (!subscriptionResponse.ok) {
      throw new Error('Failed to create subscription')
    }
    
    const subscription = await subscriptionResponse.json()
    
    await supabaseInsert('subscriptions', {
      id: subscription.id,
      user_id: userId || 'guest',
      plan_id: planId,
      paypal_plan_id: billingPlan.id,
      status: 'pending',
    })
    
    const approvalUrl = subscription.links?.find(link => link.rel === 'approve')?.href
    
    return NextResponse.json({
      subscriptionId: subscription.id,
      approveUrl: approvalUrl,
      planId: billingPlan.id
    })
    
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
