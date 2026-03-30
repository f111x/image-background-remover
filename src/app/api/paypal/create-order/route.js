import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const CREDIT_PACKAGES = {
  '10-credits': { credits: 10, price: 0.99 },
  '50-credits': { credits: 50, price: 3.99 },
  '100-credits': { credits: 100, price: 6.99 },
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

// POST /api/paypal/create-order
export async function POST(request) {
  try {
    const { packageId, userId } = await request.json()
    
    if (!packageId || !CREDIT_PACKAGES[packageId]) {
      return NextResponse.json({ error: 'Invalid package ID' }, { status: 400 })
    }
    
    const pkg = CREDIT_PACKAGES[packageId]
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://imagetoolss.com'
    
    const accessToken = await getPayPalAccessToken(clientId, clientSecret)
    
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
        return_url: `${siteUrl}/pricing?payment=success`,
        cancel_url: `${siteUrl}/pricing?payment=cancelled`,
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
    
    // Store order mapping in Supabase for later verification
    const supabase = getSupabaseAdmin()
    await supabase
      .from('orders')
      .insert({
        id: order.id,
        user_id: userId || 'guest',
        package_id: packageId,
        credits: pkg.credits,
        price: pkg.price,
        status: 'pending',
      })
    
    return NextResponse.json({
      orderId: order.id,
      approveUrl: order.links.find(link => link.rel === 'approve').href
    })
    
  } catch (error) {
    console.error('PayPal create-order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
