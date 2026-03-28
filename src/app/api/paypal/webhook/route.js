// PayPal Webhook Handler
// POST /api/paypal/webhook

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const payload = await context.request.text()
    const headers = {
      'paypal-transmission-id': context.request.headers.get('paypal-transmission-id'),
      'paypal-transmission-time': context.request.headers.get('paypal-transmission-time'),
      'paypal-transmission-sig': context.request.headers.get('paypal-transmission-sig'),
      'paypal-cert-url': context.request.headers.get('paypal-cert-url'),
      'paypal-auth-algo': context.request.headers.get('paypal-auth-algo') || 'SHA256withRSA'
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
          // Credit the user
          const kv = context.env.USER_DATA
          const orderData = await kv.get(`paypal_order:${orderId}`)
          if (orderData) {
            const order = JSON.parse(orderData)
            // Update order status
            await kv.put(`paypal_order:${orderId}`, JSON.stringify({
              ...order,
              status: 'completed',
              completedAt: new Date().toISOString()
            }), { expirationTtl: 86400 * 7 })
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
