"use client"

import { useState } from "react"

interface SubscriptionPayPalProps {
  planName: string
  credits: number
  price: string
}

export function SubscriptionPayPal({ planName, credits, price }: SubscriptionPayPalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription")
      }

      // Redirect to PayPal approval URL
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl
      }
    } catch (err: any) {
      console.error("Subscription error:", err)
      setError(err.message || "Failed to start subscription. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            跳转 PayPal...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c1.16 2.05.174 4.406-2.166 5.328-2.352.932-5.564.696-7.015-.737a.827.827 0 0 1-.173-.126c-1.676-1.52-1.761-4.158-.384-5.895.275-.348.587-.672.936-.972-.24-.262-.378-.393-.44-.44a2.44 2.44 0 0 1-.437-.567 3.64 3.64 0 0 0-.566-.872c-1.284-1.52-3.1-2.13-5.006-1.3a3.97 3.97 0 0 0-1.676 1.39c-1.174 1.836-.89 4.545.94 6.085.28.235.564.426.844.598 1.26.77 2.715 1.07 4.19.79 2.1-.4 3.6-1.53 4.2-3.03.36-.873.18-1.79-.51-2.58a3.26 3.26 0 0 0-.566-.564c-.023-.013-.033-.03-.046-.046 0 0-.011-.011-.011-.011a3.35 3.35 0 0 0-.607-.541c1.16 2.05.174 4.406-2.166 5.328-2.352.932-5.564.696-7.015-.737a.827.827 0 0 1-.173-.126c-1.676-1.52-1.761-4.158-.384-5.895.275-.348.587-.672.936-.972-.24-.262-.378-.393-.44-.44a2.44 2.44 0 0 1-.437-.567 3.64 3.64 0 0 0-.566-.872c-1.284-1.52-3.1-2.13-5.006-1.3a3.97 3.97 0 0 0-1.676 1.39c-1.174 1.836-.89 4.545.94 6.085.28.235.564.426.844.598 1.26.77 2.715 1.07 4.19.79 2.1-.4 3.6-1.53 4.2-3.03.36-.873.18-1.79-.51-2.58a3.26 3.26 0 0 0-.566-.564c-.023-.013-.033-.03-.046-.046 0 0-.011-.011-.011-.011a3.35 3.35 0 0 0-.607-.541c1.16 2.05.174 4.406-2.166 5.328-2.352.932-5.564.696-7.015-.737a.827.827 0 0 1-.173-.126c-1.676-1.52-1.761-4.158-.384-5.895.275-.348.587-.672.936-.972-.24-.262-.378-.393-.44-.44a2.44 2.44 0 0 1-.437-.567 3.64 3.64 0 0 0-.566-.872c-1.284-1.52-3.1-2.13-5.006-1.3a3.97 3.97 0 0 0-1.676 1.39c-1.174 1.836-.89 4.545.94 6.085.28.235.564.426.844.598 1.26.77 2.715 1.07 4.19.79 2.1-.4 3.6-1.53 4.2-3.03.36-.873.18-1.79-.51-2.58a3.26 3.26 0 0 0-.566-.564c-.023-.013-.033-.03-.046-.046 0 0-.011-.011-.011-.011a3.35 3.35 0 0 0-.607-.541c1.16 2.05.174 4.406-2.166 5.328-2.352.932-5.564.696-7.015-.737a.827.827 0 0 1-.173-.126c-1.676-1.52-1.761-4.158-.384-5.895.275-.348.587-.672.936-.972-.24-.262-.378-.393-.44-.44a2.44 2.44 0 0 1-.437-.567 3.64 3.64 0 0 0-.566-.872c-1.284-1.52-3.1-2.13-5.006-1.3a3.97 3.97 0 0 0-1.676 1.39c-1.174 1.836-.89 4.545.94 6.085.28.235.564.426.844.598 1.26.77 2.715 1.07 4.19.79 2.1-.4 3.6-1.53 4.2-3.03.36-.873.18-1.79-.51-2.58z"/>
            </svg>
            订阅 $${price}/月
          </>
        )}
      </button>

      {error && (
        <div className="text-sm text-center p-3 rounded-lg bg-red-50 text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}
