"use client"

import { useState } from "react"
import { PayPalButtons } from "@paypal/react-paypal-js"

interface PayPalButtonsProps {
  packageName: string
  price: string
  credits: number
  onSuccess?: (credits: number) => void
}

export function PayPalCheckout({ packageName, price, credits, onSuccess }: PayPalButtonsProps) {
  const [message, setMessage] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay",
        }}
        createOrder={async () => {
          try {
            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ packageName, price, credits }),
            })
            
            const data = await response.json()
            
            if (data.error) {
              throw new Error(data.error)
            }
            
            return data.orderID
          } catch (err) {
            console.error("createOrder error:", err)
            throw err
          }
        }}
        onApprove={async (data) => {
          // Verify the order on the backend
          try {
            const verifyResponse = await fetch("/api/paypal/verify-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID, credits }),
            })
            
            const verifyData = await verifyResponse.json()
            
            if (verifyData.success) {
              onSuccess?.(credits)
            } else {
              setMessage(verifyData.error || "Payment verification failed")
            }
          } catch {
            setMessage("Payment verification failed. Please contact support.")
          }
        }}
        onError={(err) => {
          console.error("PayPal onError:", err)
          setMessage("Payment failed. Please try again.")
        }}
        onCancel={() => {
          setMessage("Payment cancelled.")
        }}
      />

      <p className="text-xs text-center text-muted-foreground">
        Secure payment powered by PayPal
      </p>

      {message && (
        <div className="text-sm text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          {message}
        </div>
      )}
    </div>
  )
}
