'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

const CREDIT_PACKAGES = [
  { id: '10-credits', credits: 10, price: 0.99, label: '10 Credits', desc: 'Perfect for occasional use' },
  { id: '50-credits', credits: 50, price: 3.99, label: '50 Credits', desc: 'Best value for regular users', popular: true },
  { id: '100-credits', credits: 100, price: 6.99, label: '100 Credits', desc: 'For heavy users' },
]

export default function Pricing() {
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const paypalRef = useRef(null)

  useEffect(() => {
    loadUserCredits()
    loadPayPalSDK()
  }, [])

  async function loadUserCredits() {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/credits?user_id=eq.${userId}`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
      })
      const data = await res.json()
      setCredits(data?.[0]?.balance || 0)
    } catch (e) {
      console.error('Failed to load credits')
    }
  }

  function loadPayPalSDK() {
    if (window.paypal) return
    const script = document.createElement('script')
    script.src = `https://www.sandbox.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`
    script.async = true
    script.onload = () => initPayPalButtons()
    document.body.appendChild(script)
  }

  async function initPayPalButtons() {
    if (!window.paypal || !paypalRef.current) return
    paypalRef.current.innerHTML = ''

    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' },
      createOrder: async () => {
        const userId = localStorage.getItem('userId') || 'guest'
        const packageId = '10-credits'
        const pkg = CREDIT_PACKAGES.find(p => p.id === packageId)
        
        const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        })
        const { access_token } = await tokenRes.json()

        const orderRes = await fetch('https://api-m.sandbox.paypal.com/v1/checkout/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
              reference_id: `${userId}_${packageId}_${Date.now()}`,
              description: `ImageTools - ${pkg.credits} Credits`,
              amount: { currency_code: 'USD', value: pkg.price.toFixed(2) },
            }],
          }),
        })
        const order = await orderRes.json()
        return order.id
      },
      onApprove: async (data, actions) => {
        setLoading(true)
        try {
          const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa(`${PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
          })
          const { access_token } = await tokenRes.json()

          await fetch(`https://api-m.sandbox.paypal.com/v1/checkout/orders/${data.orderID}/capture`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          })
          
          const userId = localStorage.getItem('userId')
          if (userId) {
            const pkg = CREDIT_PACKAGES[0]
            const res = await fetch(`${SUPABASE_URL}/rest/v1/credits?user_id=eq.${userId}`, {
              headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
            })
            const existing = await res.json()
            const currentBalance = existing?.[0]?.balance || 0
            
            await fetch(`${SUPABASE_URL}/rest/v1/credits`, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates',
              },
              body: JSON.stringify({ user_id: userId, balance: currentBalance + pkg.credits }),
            })
            
            setCredits(currentBalance + pkg.credits)
          }
          
          setMessage({ type: 'success', text: 'Payment successful! Credits added.' })
        } catch (e) {
          setMessage({ type: 'error', text: 'Payment capture failed' })
        }
        setLoading(false)
      },
      onError: () => setMessage({ type: 'error', text: 'Payment error' })
    }).render(paypalRef.current)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-6 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ImageTools
        </Link>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-2">Simple Pricing</h1>
        <p className="text-gray-400 text-center mb-12">Choose a plan that works for you</p>

        <div className="bg-gray-800 rounded-xl p-4 mb-8 max-w-md mx-auto text-center">
          <p className="text-gray-400">Your Credits</p>
          <p className="text-4xl font-bold text-green-400">{credits}</p>
        </div>

        {message.text && (
          <div className={`max-w-md mx-auto mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900' : 'bg-red-900'}`}>
            {message.text}
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Credit Packages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {CREDIT_PACKAGES.map(pkg => (
              <div key={pkg.id} className={`bg-gray-800 rounded-xl p-6 ${pkg.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {pkg.popular && <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Most Popular</span>}
                <h3 className="text-2xl font-bold mt-2">{pkg.label}</h3>
                <p className="text-4xl font-bold text-green-400 mt-4">${pkg.price}</p>
                <p className="text-gray-400 mt-2">{pkg.desc}</p>
                <button
                  onClick={() => handleBuy(pkg)}
                  disabled={loading}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 py-3 rounded-lg font-semibold transition"
                >
                  {loading ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">PayPal Payment</h2>
          <div ref={paypalRef} className="max-w-xs mx-auto" />
        </section>
      </main>
    </div>
  )

  async function handleBuy(pkg) {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('Please login first')
      return
    }
    setLoading(true)
    
    try {
      const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      })
      const { access_token } = await tokenRes.json()

      const orderRes = await fetch('https://api-m.sandbox.paypal.com/v1/checkout/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            reference_id: `${userId}_${pkg.id}_${Date.now()}`,
            description: `ImageTools - ${pkg.credits} Credits`,
            amount: { currency_code: 'USD', value: pkg.price.toFixed(2) },
          }],
          application_context: {
            brand_name: 'ImageTools',
            return_url: `${window.location.origin}/pricing?payment=success`,
            cancel_url: `${window.location.origin}/pricing?payment=cancelled`,
          },
        }),
      })
      const order = await orderRes.json()
      const approveUrl = order.links?.find(l => l.rel === 'approve')?.href
      
      if (approveUrl) {
        localStorage.setItem('pendingOrder', JSON.stringify({ pkg, orderId: order.id }))
        window.location.href = approveUrl
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to create order' })
      setLoading(false)
    }
  }
}
