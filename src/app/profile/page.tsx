"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Coins, History, LogOut, CreditCard } from "lucide-react"

interface Profile {
  credits: number
  totalCredits: number
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
  created_at: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [usage, setUsage] = useState<UsageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"purchases" | "usage">("purchases")

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
          const creditsData = await creditsRes.json()
          setProfile(creditsData)
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

      <main className="max-w-3xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold">
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

          {/* Credits Display */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Coins className="w-6 h-6 text-yellow-400" />
                <span className="text-gray-400">Available Credits</span>
              </div>
              <p className="text-5xl font-bold text-yellow-400">{profile?.credits ?? 0}</p>
              <p className="text-sm text-gray-500 mt-2">
                {profile?.totalCredits ? `Total purchased: ${profile.totalCredits}` : "Use these to process images"}
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-6 h-6 text-green-400" />
                  <span className="text-gray-400">Need more credits?</span>
                </div>
                <p className="text-gray-300 mb-4">Purchase credit packages or subscribe monthly.</p>
              </div>
              <Link
                href="/pricing"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold text-center hover:from-purple-700 hover:to-pink-700 transition"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Free Credits Notice */}
        {(profile?.credits ?? 0) < 5 && (profile?.credits ?? 0) > 0 && (
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 mb-6">
            <p className="text-yellow-200 text-sm">
              ⚠️ Your credits are running low. <Link href="/pricing" className="underline">Purchase more credits</Link> to continue using ImageTools.
            </p>
          </div>
        )}

        {/* Zero Credits */}
        {(profile?.credits ?? 0) === 0 && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-200 text-sm">
              ❌ You have no credits remaining. <Link href="/pricing" className="underline font-semibold">Purchase credits</Link> to continue using ImageTools.
            </p>
          </div>
        )}

        {/* History Tabs */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden">
          <div className="flex border-b border-gray-700">
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
            <button
              onClick={() => setActiveTab("usage")}
              className={`flex-1 px-6 py-4 text-center font-medium transition ${
                activeTab === "usage"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Usage History
            </button>
          </div>

          <div className="p-6">
            {activeTab === "purchases" && (
              <div>
                {purchases.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No purchase history yet.</p>
                    <Link
                      href="/pricing"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Purchase credits
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{purchase.package_name}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(purchase.created_at).toLocaleDateString()}
                          </p>
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

            {activeTab === "usage" && (
              <div>
                {usage.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No usage history yet.</p>
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
                        <div>
                          <p className="font-medium">
                            {record.status === "failed" ? "❌ Failed" : "✅ Success"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(record.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-400">-{record.credits_used} credit</p>
                          <p className="text-sm text-gray-400">
                            {(record.image_size / 1024).toFixed(1)} KB
                          </p>
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
