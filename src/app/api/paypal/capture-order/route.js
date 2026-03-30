export const runtime = 'edge'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function supabaseFetch(table, eq) {
  let url = `${SUPABASE_URL}/rest/v1/${table}?${eq[0]}=eq.${eq[1]}`
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  }
  const res = await fetch(url, { headers })
  return res.json()
}

async function supabaseUpdate(table, data, eq) {
  let url = `${SUPABASE_URL}/rest/v1/${table}?${eq[0]}=eq.${eq[1]}`
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
  return fetch(url, { method: 'PATCH', headers, body: JSON.stringify(data) })
}

async function supabaseUpsert(table, data) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates',
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
    const { orderId } = await request.json()
    
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }
    
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    
    const accessToken = await getPayPalAccessToken(clientId, clientSecret)
    
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
    
    await supabaseUpdate('orders', { 
      status: 'captured',
      captured_at: new Date().toISOString()
    }, ['id', orderId])
    
    const orderInfo = await supabaseFetch('orders', ['id', orderId])
    const order = orderInfo?.[0]
    
    if (order && order.user_id && order.user_id !== 'guest') {
      const existingCredits = await supabaseFetch('credits', ['user_id', order.user_id])
      const currentBalance = existingCredits?.[0]?.balance || 0
      await supabaseUpsert('credits', {
        user_id: order.user_id,
        balance: currentBalance + order.credits
      })
      
      await supabaseUpsert('purchases', {
        user_id: order.user_id,
        type: 'credits',
        package_id: order.package_id,
        credits: order.credits,
        price: order.price,
        order_id: orderId,
      })
    }
    
    return NextResponse.json({
      success: true,
      status: captureData.status,
      credits: order?.credits || 0,
      message: 'Payment captured successfully!'
    })
    
  } catch (error) {
    console.error('PayPal capture-order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
