"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Coins, History, LogOut, CreditCard, Zap, Calendar, RefreshCw, Crown } from "lucide-react"

interface CreditInfo {
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
  source: string
  status: string
  created_at: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null)
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
          setCreditInfo(data)
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
        <header className="p-6 border-b border-gray-800 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ImageTools
          </Link>
        </header>
        <main className="max-w-md mx-auto p-6 mt-20 text-center">
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-gray-400 mb-6">Please sign in to view your profile and credits.</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const user = session?.user

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
      <header className="p-6 border-b border-gray-800/50 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ImageTools
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-gray-800/30 backdrop-blur rounded-2xl p-8 mb-6 border border-gray-700/50">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-purple-500/20">
              {user?.image ? (
                <img src={user.image} alt={user.name || ""} className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
              <p className="text-gray-400">{user?.email}</p>
              {creditInfo?.isSubscriber && (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-sm rounded-full border border-yellow-500/30">
                  <Crown className="w-3 h-3" />
                  Subscriber
                </span>
              )}
            </div>
          </div>

          {/* Credits Display */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Total Credits - Main */}
            <div className="md:col-span-2 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Coins className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Available Credits</p>
                  <p className="text-5xl font-bold text-yellow-400">{creditInfo?.credits ?? 0}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                {creditInfo?.oneTimeCredits !== undefined && creditInfo.oneTimeCredits > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 rounded-lg text-sm">
                    <Zap className="w-3 h-3 text-blue-400" />
                    <span className="text-gray-400">One-time:</span>
                    <span className="text-white font-medium">{creditInfo.oneTimeCredits}</span>
                  </span>
                )}
                {creditInfo?.isSubscriber && (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 rounded-lg text-sm">
                      <Calendar className="w-3 h-3 text-green-400" />
                      <span className="text-gray-400">Monthly:</span>
                      <span className="text-white font-medium">{creditInfo.monthlyCredits}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 rounded-lg text-sm">
                      <RefreshCw className="w-3 h-3 text-purple-400" />
                      <span className="text-gray-400">Rollover:</span>
                      <span className="text-white font-medium">{creditInfo.rolloverCredits}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 flex flex-col justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Need more credits?</p>
                <p className="text-gray-300 mb-4">Purchase packages or subscribe for monthly allocation.</p>
              </div>
              <Link
                href="/pricing"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                <CreditCard className="w-4 h-4" />
                View Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Low/No Credits Alert */}
        {(creditInfo?.credits ?? 0) === 0 && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-200 flex items-center gap-2">
              <span className="text-xl">❌</span>
              You have no credits remaining. <Link href="/pricing" className="underline font-semibold">Purchase credits</Link> to continue using ImageTools.
            </p>
          </div>
        )}
        {(creditInfo?.credits ?? 0) > 0 && (creditInfo?.credits ?? 0) < 5 && (
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 mb-6">
            <p className="text-yellow-200 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Your credits are running low ({creditInfo?.credits} left). <Link href="/pricing" className="underline">Purchase more credits</Link> to avoid interruption.
            </p>
          </div>
        )}

        {/* History Tabs */}
        <div className="bg-gray-800/30 backdrop-blur rounded-2xl overflow-hidden border border-gray-700/50">
          <div className="flex border-b border-gray-700/50">
            <button
              onClick={() => setActiveTab("usage")}
              className={`flex-1 px-6 py-4 text-center font-medium transition flex items-center justify-center gap-2 ${
                activeTab === "usage"
                  ? "bg-purple-600/20 text-purple-300 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              <Zap className="w-4 h-4" />
              Usage History
            </button>
            <button
              onClick={() => setActiveTab("purchases")}
              className={`flex-1 px-6 py-4 text-center font-medium transition flex items-center justify-center gap-2 ${
                activeTab === "purchases"
                  ? "bg-purple-600/20 text-purple-300 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Purchase History
            </button>
          </div>

          <div className="p-6">
            {activeTab === "usage" && (
              <div>
                {usage.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400">No usage history yet.</p>
                    <p className="text-gray-500 text-sm mt-1">Start using ImageTools to see your history here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {usage.map((record) => (
                      <div
                        key={record.id}
                        className={`flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30 ${
                          record.status === "failed" ? "opacity-60 border-red-500/20" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            record.status === "failed" 
                              ? "bg-red-500/20" 
                              : "bg-green-500/20"
                          }`}>
                            {record.status === "failed" ? (
                              <span className="text-red-400 text-lg">✗</span>
                            ) : (
                              <span className="text-green-400 text-lg">✓</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {record.status === "failed" ? "Processing Failed" : "Image Processed"}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(record.created_at).toLocaleString()}
                              {record.source === "subscription" && (
                                <span className="ml-2 text-purple-400">• Subscription</span>
                              )}
                              {record.source === "one-time" && (
                                <span className="ml-2 text-blue-400">• One-time</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${record.status === "failed" ? "text-red-400" : "text-red-400"}`}>
                            -{record.credits_used} credit
                          </p>
                          {record.image_size && (
                            <p className="text-sm text-gray-500">
                              {(record.image_size / 1024).toFixed(0)} KB
                            </p>
                          )}
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
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400">No purchase history yet.</p>
                    <Link
                      href="/pricing"
                      className="inline-block mt-3 text-purple-400 hover:text-purple-300 underline"
                    >
                      View Pricing Plans
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-green-400" />
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
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
