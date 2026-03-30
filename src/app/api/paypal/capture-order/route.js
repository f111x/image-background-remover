import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function getSupabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
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
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get PayPal access token: ${error}`)
  }
  
  const data = await response.json()
  return data.access_token
}

// POST /api/paypal/capture-order
export async function POST(request) {
  try {
    const { orderId } = await request.json()
    
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }
    
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    const supabase = getSupabaseAdmin()
    
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
    
    await supabase
      .from('orders')
      .update({ 
        status: 'captured',
        captured_at: new Date().toISOString()
      })
      .eq('id', orderId)
    
    const { data: orderInfo } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (orderInfo && orderInfo.user_id && orderInfo.user_id !== 'guest') {
      const { data: existingCredits } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', orderInfo.user_id)
        .single()
      
      const currentBalance = existingCredits?.balance || 0
      await supabase
        .from('credits')
        .upsert({
          user_id: orderInfo.user_id,
          balance: currentBalance + orderInfo.credits
        })
      
      await supabase
        .from('purchases')
        .insert({
          user_id: orderInfo.user_id,
          type: 'credits',
          package_id: orderInfo.package_id,
          credits: orderInfo.credits,
          price: orderInfo.price,
          order_id: orderId,
        })
    }
    
    return NextResponse.json({
      success: true,
      status: captureData.status,
      credits: orderInfo?.credits || 0,
      message: 'Payment captured successfully!'
    })
    
  } catch (error) {
    console.error('PayPal capture-order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
