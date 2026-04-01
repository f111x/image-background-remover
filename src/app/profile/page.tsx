"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Coins, History, LogOut, CreditCard, Zap, Calendar, TrendingUp, AlertCircle } from "lucide-react"

interface CreditsInfo {
  credits: number
  totalCredits: number
  isSubscriber: boolean
  monthlyCredits: number
  rolloverCredits: number
  oneTimeCredits: number
}

interface Purchase {
  id: string
  package_name: string
  credits: number
  amount_paid: string
  status: string
  created_at: string
}

interface UsageRecord {
  id: string
  credits_used: number
  image_size: number
  status: string
  source: string
  created_at: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [creditsInfo, setCreditsInfo] = useState<CreditsInfo | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [usage, setUsage] = useState<UsageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"purchases" | "usage">("usage")

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [creditsRes, historyRes] = await Promise.all([
          fetch("/api/user/credits"),
          fetch("/api/user/history"),
        ])

        if (creditsRes.ok) {
          const data = await creditsRes.json()
          setCreditsInfo({
            credits: data.credits || 0,
            totalCredits: data.totalCredits || 0,
            isSubscriber: data.isSubscriber || false,
            monthlyCredits: data.monthlyCredits || 0,
            rolloverCredits: data.rolloverCredits || 0,
            oneTimeCredits: data.oneTimeCredits || data.credits || 0,
          })
        }

        if (historyRes.ok) {
          const historyData = await historyRes.json()
          setPurchases(historyData.purchases || [])
          setUsage(historyData.usage || [])
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchData()
    }
  }, [status])

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="p-6 border-b border-gray-800 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ImageTools
          </Link>
        </header>
        <main className="max-w-md mx-auto p-6 mt-20 text-center">
          <div className="bg-gray-800 rounded-xl p-8">
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-gray-400 mb-6">Please sign in to view your profile and credits.</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Go to Home
            </Link>
          </div>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const user = session?.user
  const totalCredits = creditsInfo?.credits ?? 0

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-6 border-b border-gray-800 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ImageTools
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt={user.name || ""} className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Main Credits Display */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Total Credits - Large */}
            <div className="md:col-span-2 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-8 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Coins className="w-8 h-8 text-yellow-400" />
                <span className="text-gray-300 text-lg">Available Credits</span>
              </div>
              <p className="text-6xl font-bold text-yellow-400 mb-2">{totalCredits}</p>
              
              {/* Credits Breakdown */}
              {creditsInfo?.isSubscriber && (
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-purple-500/30">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{creditsInfo.monthlyCredits}</p>
                    <p className="text-xs text-gray-400">Monthly</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-400">{creditsInfo.rolloverCredits}</p>
                    <p className="text-xs text-gray-400">Rollover</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{creditsInfo.oneTimeCredits}</p>
                    <p className="text-xs text-gray-400">One-time</p>
                  </div>
                </div>
              )}

              {!creditsInfo?.isSubscriber && (
                <p className="text-sm text-gray-400 mt-4">
                  Purchased credits: {creditsInfo?.totalCredits || 0}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-700/50 rounded-xl p-6 flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-6 h-6 text-green-400" />
                  <span className="text-gray-300 font-medium">Need more?</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">Purchase credits or subscribe for monthly allocation.</p>
              </div>
              <Link
                href="/pricing"
                className="mt-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
              >
                <Zap className="w-4 h-4" />
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Subscription Status (if subscriber) */}
        {creditsInfo?.isSubscriber && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-400">Active Subscription</h3>
                <p className="text-gray-400 text-sm">Your monthly credits refresh automatically</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Next refresh</p>
                <p className="text-blue-400 font-medium">~30 days</p>
              </div>
            </div>
          </div>
        )}

        {/* Free Credits Notice */}
        {totalCredits > 0 && totalCredits < 5 && (
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">
              Your credits are running low. <Link href="/pricing" className="underline font-medium">Purchase more credits</Link> to continue using ImageTools.
            </p>
          </div>
        )}

        {/* Zero Credits */}
        {totalCredits === 0 && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200 text-sm">
              You have no credits remaining. <Link href="/pricing" className="underline font-semibold">Purchase credits</Link> to continue using ImageTools.
            </p>
          </div>
        )}

        {/* History Tabs */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("usage")}
              className={`flex-1 px-6 py-4 text-center font-medium transition ${
                activeTab === "usage"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Usage History
            </button>
            <button
              onClick={() => setActiveTab("purchases")}
              className={`flex-1 px-6 py-4 text-center font-medium transition ${
                activeTab === "purchases"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <History className="w-4 h-4 inline mr-2" />
              Purchase History
            </button>
          </div>

          <div className="p-6">
            {activeTab === "usage" && (
              <div>
                {usage.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 mb-2">No usage history yet</p>
                    <p className="text-gray-500 text-sm">Start removing backgrounds to see your history here</p>
                    <Link
                      href="/#editor"
                      className="inline-block mt-4 text-purple-400 hover:text-purple-300 underline"
                    >
                      Go to Editor
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {usage.map((record) => (
                      <div
                        key={record.id}
                        className={`flex items-center justify-between p-4 bg-gray-700/50 rounded-lg ${
                          record.status === "failed" ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            record.status === "success" ? "bg-green-500/20" : "bg-red-500/20"
                          }`}>
                            {record.status === "success" ? (
                              <span className="text-green-400">✓</span>
                            ) : (
                              <span className="text-red-400">✗</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {record.status === "success" ? "Background Removed" : "Failed"}
                              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-600 text-gray-300">
                                {record.source === "subscription" ? "Subscription" : record.source === "one-time" ? "One-time" : "Free"}
                              </span>
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(record.created_at).toLocaleString()} • {(record.image_size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${record.status === "success" ? "text-red-400" : "text-gray-400"}`}>
                            {record.status === "success" ? "-" : ""}{record.credits_used} credit
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "purchases" && (
              <div>
                {purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <History className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 mb-2">No purchase history yet</p>
                    <p className="text-gray-500 text-sm mb-4">Buy credits to unlock unlimited background removal</p>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                    >
                      <Zap className="w-4 h-4" />
                      View Pricing
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <span className="text-green-400">+</span>
                          </div>
                          <div>
                            <p className="font-medium">{purchase.package_name}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(purchase.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-400">+{purchase.credits} credits</p>
                          <p className="text-sm text-gray-400">${purchase.amount_paid}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
