// PayPal Webhook Handler
// POST /api/paypal/webhook

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

/**
 * Verify PayPal webhook signature.
 * Returns { valid: true } if verified, or { valid: false, error: string } if not.
 */
async function verifyPayPalWebhook(request, payload, webhookId, env) {
  const transmissionId = request.headers.get('paypal-transmission-id');
  const transmissionTime = request.headers.get('paypal-transmission-time');
  const transmissionSig = request.headers.get('paypal-transmission-sig');
  const certUrl = request.headers.get('paypal-cert-url');
  const authAlgo = request.headers.get('paypal-auth-algo') || 'SHA256withRSA';

  // Validate required headers
  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl) {
    return { valid: false, error: 'Missing required PayPal webhook headers' };
  }

  // Verify cert URL is from PayPal domain (security check)
  try {
    const certUrlObj = new URL(certUrl);
    if (!certUrlObj.hostname.endsWith('.paypal.com') && !certUrlObj.hostname.endsWith('.paypal.cn')) {
      return { valid: false, error: `Invalid cert URL domain: ${certUrl}` };
    }
  } catch {
    return { valid: false, error: 'Invalid cert URL format' };
  }

  // Build the signed message
  // Format: transmission_id|transmission_time|webhook_id|crc32(body)
  const crc = crc32(payload);
  const signedMessage = `${transmissionId}|${transmissionTime}|${webhookId}|${crc}`;

  try {
    // Fetch the certificate from PayPal
    const certResponse = await fetch(certUrl);
    if (!certResponse.ok) {
      return { valid: false, error: `Failed to fetch certificate: ${certResponse.status}` };
    }
    const certPem = await certResponse.text();

    // Extract certificate body (PEM format)
    const certBody = certPem
      .replace(/-----BEGIN CERTIFICATE-----/, '')
      .replace(/-----END CERTIFICATE-----/, '')
      .replace(/\s/g, '');

    // Import the certificate
    const certDer = Uint8Array.from(atob(certBody), c => c.charCodeAt(0));
    const certificate = await crypto.subtle.importCert(
      'spki',
      certDer.buffer,
      { name: 'RSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode the signature from base64
    const signatureBinary = atob(transmissionSig);
    const signature = Uint8Array.from(signatureBinary, c => c.charCodeAt(0));

    // Verify the signature
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

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const payload = await context.request.text()
    const webhookId = context.env.PAYPAL_WEBHOOK_ID;

    // --- Signature Verification ---
    if (webhookId) {
      const verification = await verifyPayPalWebhook(context.request, payload, webhookId, context.env);
      if (!verification.valid) {
        console.error('PayPal webhook signature verification failed:', verification.error);
        return new Response(JSON.stringify({ error: 'Signature verification failed' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      console.log('PayPal webhook signature verified successfully');
    } else {
      console.warn('PAYPAL_WEBHOOK_ID not configured, skipping signature verification');
    }

    const event = JSON.parse(payload)
    console.log('PayPal Webhook received:', JSON.stringify(event))

    // Handle different event types
    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        console.log('Order approved:', event.resource?.id)
        break

      case 'PAYMENT.CAPTURE.COMPLETED':
        const orderId = event.resource?.supplementary_data?.related_ids?.order_id
        if (orderId) {
          const kv = context.env.USER_DATA
          const orderData = await kv.get(`paypal_order:${orderId}`)
          if (orderData) {
            const order = JSON.parse(orderData)
            await kv.put(`paypal_order:${orderId}`, JSON.stringify({
              ...order,
              status: 'completed',
              completedAt: new Date().toISOString()
            }), { expirationTtl: 86400 * 7 })

            // Add credits to user
            if (order.userId && order.userId !== 'guest') {
              const creditsKey = `credits:${order.userId}`
              const currentCredits = await kv.get(creditsKey)
              const credits = currentCredits ? parseInt(currentCredits) : 0
              await kv.put(creditsKey, (credits + order.credits).toString(), { expirationTtl: 86400 * 365 })

              // Update purchase history
              const purchaseHistoryKey = `purchases:${order.userId}`
              const history = await kv.get(purchaseHistoryKey)
              const purchases = history ? JSON.parse(history) : []
              purchases.push({
                type: 'credits',
                packageId: order.packageId,
                credits: order.credits,
                price: order.price,
                orderId,
                purchasedAt: new Date().toISOString()
              })
              await kv.put(purchaseHistoryKey, JSON.stringify(purchases), { expirationTtl: 86400 * 365 })
              console.log(`Credits added: +${order.credits} for user ${order.userId}`)
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

    // Return 200 to acknowledge receipt
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('PayPal webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
