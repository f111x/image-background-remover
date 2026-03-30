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

export async function POST(request) {
  try {
    const payload = await request.text()
    const webhookId = process.env.PAYPAL_WEBHOOK_ID
    const event = JSON.parse(payload)

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        const orderId = event.resource?.supplementary_data?.related_ids?.order_id
        if (orderId) {
          const order = await supabaseFetch('orders', ['id', orderId])
          
          if (order?.[0]) {
            await supabaseUpdate('orders', { 
              status: 'completed',
              completed_at: new Date().toISOString()
            }, ['id', orderId])

            if (order[0].user_id && order[0].user_id !== 'guest') {
              const existingCredits = await supabaseFetch('credits', ['user_id', order[0].user_id])
              const currentBalance = existingCredits?.[0]?.balance || 0
              
              await supabaseUpsert('credits', {
                user_id: order[0].user_id,
                balance: currentBalance + order[0].credits
              })

              await supabaseUpsert('purchases', {
                user_id: order[0].user_id,
                type: 'credits',
                package_id: order[0].package_id,
                credits: order[0].credits,
                price: order[0].price,
                order_id: orderId,
              })
            }
          }
        }
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
