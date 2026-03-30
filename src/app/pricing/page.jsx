'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const CREDIT_PACKAGES = [
  { id: '10-credits', credits: 10, price: 0.99, label: '10 Credits', desc: 'Perfect for occasional use' },
  { id: '50-credits', credits: 50, price: 3.99, label: '50 Credits', desc: 'Best value for regular users', popular: true },
  { id: '100-credits', credits: 100, price: 6.99, label: '100 Credits', desc: 'For heavy users' },
]

const SUBSCRIPTION_PLANS = [
  { id: 'pro-monthly', name: 'Pro Monthly', credits: 100, price: 9.9, desc: '100 credits daily, unlimited monthly' },
]

export default function Pricing() {
  const [credits, setCredits] = useState(0)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const paypalRef = useRef(null)

  useEffect(() => {
    loadUserData()
    loadPayPalSDK()
  }, [])

  async function loadUserData() {
    const userId = localStorage.getItem('userId')
    const userData = localStorage.getItem('user')
    if (userId) {
      setUser(userData ? JSON.parse(userData) : { id: userId })
      try {
        const res = await fetch(`/api/user?userId=${userId}&action=check`)
        const data = await res.json()
        if (data.credits !== undefined) setCredits(data.credits)
      } catch (e) {
        console.error('Failed to load credits')
      }
    }
  }

  function loadPayPalSDK() {
    if (window.paypal) return
    const script = document.createElement('script')
    script.src = `https://www.sandbox.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&intent=capture`
    script.async = true
    script.onload = () => initPayPalButtons()
    document.body.appendChild(script)
  }

  async function initPayPalButtons() {
    if (!window.paypal || !paypalRef.current) return
    paypalRef.current.innerHTML = ''

    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' },
      createOrder: async (data, actions) => {
        const userId = localStorage.getItem('userId') || 'guest'
        const res = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packageId: '10-credits', userId })
        })
        const { orderId } = await res.json()
        return orderId
      },
      onApprove: async (data, actions) => {
        setLoading(true)
        try {
          const res = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID })
          })
          const result = await res.json()
          if (result.success) {
            setCredits(prev => prev + result.credits)
            setMessage({ type: 'success', text: `Successfully purchased ${result.credits} credits!` })
          }
        } catch (e) {
          setMessage({ type: 'error', text: 'Payment capture failed' })
        }
        setLoading(false)
      },
      onError: () => setMessage({ type: 'error', text: 'Payment error occurred' })
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

        {user && (
          <div className="bg-gray-800 rounded-xl p-4 mb-8 max-w-md mx-auto text-center">
            <p className="text-gray-400">Your Credits</p>
            <p className="text-4xl font-bold text-green-400">{credits}</p>
          </div>
        )}

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
                  onClick={() => handleBuyPackage(pkg.id)}
                  disabled={loading}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 py-3 rounded-lg font-semibold transition"
                >
                  {loading ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Subscription Plans</h2>
          <div className="max-w-md mx-auto">
            {SUBSCRIPTION_PLANS.map(plan => (
              <div key={plan.id} className="bg-gray-800 rounded-xl p-6 ring-2 ring-purple-500">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-4xl font-bold text-green-400 mt-4">${plan.price}<span className="text-lg text-gray-400">/mo</span></p>
                <p className="text-gray-400 mt-2">{plan.desc}</p>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 py-3 rounded-lg font-semibold transition"
                >
                  Subscribe
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

  async function handleBuyPackage(packageId) {
    if (!user) {
      alert('Please login first')
      return
    }
    setLoading(true)
    const userId = user.id
    
    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, userId })
      })
      const { orderId, approveUrl } = await res.json()
      if (approveUrl) {
        window.location.href = approveUrl
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to create order' })
      setLoading(false)
    }
  }

  async function handleSubscribe(planId) {
    if (!user) {
      alert('Please login first')
      return
    }
    setLoading(true)
    const userId = user.id
    
    try {
      const res = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId })
      })
      const { subscriptionId, approveUrl } = await res.json()
      if (approveUrl) {
        window.location.href = approveUrl
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to create subscription' })
      setLoading(false)
    }
  }
}
