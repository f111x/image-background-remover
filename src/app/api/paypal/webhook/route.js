import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function getSupabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Calculate CRC32 of a string (required for PayPal webhook signature)
 */
function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  const bytes = new TextEncoder().encode(data);
  for (let i = 0; i < bytes.length; i++) {
    crc = table[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

async function verifyPayPalWebhook(request, payload, webhookId) {
  const transmissionId = request.headers.get('paypal-transmission-id');
  const transmissionTime = request.headers.get('paypal-transmission-time');
  const transmissionSig = request.headers.get('paypal-transmission-sig');
  const certUrl = request.headers.get('paypal-cert-url');

  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl) {
    return { valid: false, error: 'Missing required PayPal webhook headers' };
  }

  const crc = crc32(payload);
  const signedMessage = `${transmissionId}|${transmissionTime}|${webhookId}|${crc}`;

  try {
    const certResponse = await fetch(certUrl);
    if (!certResponse.ok) {
      return { valid: false, error: `Failed to fetch certificate: ${certResponse.status}` };
    }
    const certPem = await certResponse.text();
    const certBody = certPem
      .replace(/-----BEGIN CERTIFICATE-----/, '')
      .replace(/-----END CERTIFICATE-----/, '')
      .replace(/\s/g, '');

    const certDer = Uint8Array.from(atob(certBody), c => c.charCodeAt(0));
    const certificate = await crypto.subtle.importCert(
      'spki',
      certDer.buffer,
      { name: 'RSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBinary = atob(transmissionSig);
    const signature = Uint8Array.from(signatureBinary, c => c.charCodeAt(0));
    const encoder = new TextEncoder();
    const data = encoder.encode(signedMessage);

    const isValid = await crypto.subtle.verify(
      { name: 'RSA-PKCS1-v1_5', hash: 'SHA-256' },
      certificate,
      signature,
      data
    );

    return { valid: isValid, error: isValid ? null : 'Signature verification failed' };
  } catch (err) {
    return { valid: false, error: `Verification error: ${err.message}` };
  }
}

// POST /api/paypal/webhook
export async function POST(request) {
  try {
    const payload = await request.text()
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const supabase = getSupabaseAdmin()

    // Signature verification
    if (webhookId) {
      const verification = await verifyPayPalWebhook(request, payload, webhookId);
      if (!verification.valid) {
        console.error('PayPal webhook signature verification failed:', verification.error);
        return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
      }
      console.log('PayPal webhook signature verified successfully');
    }

    const event = JSON.parse(payload)
    console.log('PayPal Webhook received:', JSON.stringify(event))

    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        console.log('Order approved:', event.resource?.id)
        break

      case 'PAYMENT.CAPTURE.COMPLETED':
        const orderId = event.resource?.supplementary_data?.related_ids?.order_id
        if (orderId) {
          const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()
          
          if (order) {
            await supabase
              .from('orders')
              .update({ 
                status: 'completed',
                completed_at: new Date().toISOString()
              })
              .eq('id', orderId)

            if (order.user_id && order.user_id !== 'guest') {
              // Add credits
              const { data: existingCredits } = await supabase
                .from('credits')
                .select('balance')
                .eq('user_id', order.user_id)
                .single()
              
              const currentBalance = existingCredits?.balance || 0
              await supabase
                .from('credits')
                .upsert({
                  user_id: order.user_id,
                  balance: currentBalance + order.credits
                })

              // Add to purchase history
              await supabase
                .from('purchases')
                .insert({
                  user_id: order.user_id,
                  type: 'credits',
                  package_id: order.package_id,
                  credits: order.credits,
                  price: order.price,
                  order_id: orderId,
                })
            }
            console.log(`Payment completed for order ${orderId}, credits: ${order.credits}`)
          }
        }
        break

      case 'PAYMENT.CAPTURE.DENIED':
        console.log('Payment denied:', event.resource?.id)
        break

      default:
        console.log('Unhandled event type:', event.event_type)
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
