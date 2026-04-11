"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Coins, LogOut, CreditCard, Zap, Calendar, RefreshCw, Crown } from "lucide-react"
import { Layout } from "@/components/layout"
import { useLanguage } from "@/lib/i18n"
import { useSupabaseUser } from "@/hooks/use-supabase-user"

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
  const { user, loading: userLoading } = useSupabaseUser()
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [usage, setUsage] = useState<UsageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"usage" | "purchases">("usage")
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null)
  const { t } = useLanguage()
  const supabase = createClient()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("purchase") === "success") {
      const credits = params.get("credits")
      setPurchaseSuccess(credits ? `+${credits}` : null)
      // Clean URL
      window.history.replaceState({}, "", "/profile")
    }
    if (params.get("subscription") === "success") {
      setPurchaseSuccess("订阅已激活！")
      window.history.replaceState({}, "", "/profile")
    }
  }, [])

  useEffect(() => {
    if (!user && !userLoading) {
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

    if (user) {
      fetchData()
    }
  }, [user, userLoading])

  if (!user && !userLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center max-w-md mx-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Coins className="w-8 h-8 text-purple-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">{t("sign_in_required")}</h1>
            <p className="text-gray-500 mb-6">{t("sign_in_desc")}</p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700"
            >
              {t("go_to_home")}
            </a>
          </div>
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">{t("loading")}</p>
          </div>
        </div>
      </Layout>
    )
  }

  const userData = user

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-purple-500/20">
                {userData?.user_metadata?.avatar_url || userData?.user_metadata?.picture ? (
                  <img src={userData?.user_metadata?.avatar_url || userData?.user_metadata?.picture || ""} alt={userData?.user_metadata?.full_name || userData?.email || ""} className="w-full h-full rounded-full object-cover" />
                ) : (
                  userData?.user_metadata?.full_name?.[0]?.toUpperCase() || userData?.email?.[0]?.toUpperCase() || "U"
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{userData?.user_metadata?.full_name || userData?.email || "User"}</h1>
                <p className="text-gray-500">{userData?.email}</p>
                {creditInfo?.isSubscriber && (
                  <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-yellow-100 text-yellow-600 text-sm rounded-full">
                    <Crown className="w-3 h-3" />
                    {t("subscriber")}
                  </span>
                )}
              </div>
              <button
                onClick={() => { supabase.auth.signOut(); window.location.href = "/" }}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <LogOut className="w-4 h-4" />
                {t("logout")}
              </button>
            </div>

            {/* Credits Display */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Total Credits */}
              <div className="md:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Coins className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t("available_credits")}</p>
                    <p className="text-5xl font-bold text-yellow-500">{creditInfo?.credits ?? 0}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {(creditInfo?.oneTimeCredits ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-sm shadow-sm">
                      <Zap className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-600">{t("one_time")}: {creditInfo?.oneTimeCredits}</span>
                    </span>
                  )}
                  {creditInfo?.isSubscriber && (
                    <>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-sm shadow-sm">
                        <Calendar className="w-3 h-3 text-green-500" />
                        <span className="text-gray-600">{t("monthly")}: {creditInfo?.monthlyCredits}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-sm shadow-sm">
                        <RefreshCw className="w-3 h-3 text-purple-500" />
                        <span className="text-gray-600">{t("rollover")}: {creditInfo?.rolloverCredits}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gray-100 rounded-xl p-6">
                <p className="text-gray-500 text-sm mb-2">{t("need_more_credits")}</p>
                <p className="text-gray-600 mb-4">{t("purchase_packages")}</p>
                <a
                  href="/pricing"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  {t("view_pricing")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-6">
          {/* Alerts */}
          {(creditInfo?.credits ?? 0) === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 flex items-center gap-2">
                ❌ {t("credits_empty")} <a href="/pricing" className="underline font-semibold">{t("purchase_credits")}</a>
              </p>
            </div>
          )}

          {purchaseSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-600 flex items-center gap-2">
                ✅ Purchase successful! {purchaseSuccess} credits added to your account.
              </p>
            </div>
          )}
          {(creditInfo?.credits ?? 0) > 0 && (creditInfo?.credits ?? 0) < 5 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-600 flex items-center gap-2">
                ⚠️ {t("credits_low").replace("{credits}", String(creditInfo?.credits))}
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("usage")}
                className={`flex-1 px-6 py-4 text-center font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === "usage"
                    ? "bg-purple-50 text-purple-600 border-b-2 border-purple-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Zap className="w-4 h-4" />
                {t("usage_history")}
              </button>
              <button
                onClick={() => setActiveTab("purchases")}
                className={`flex-1 px-6 py-4 text-center font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === "purchases"
                    ? "bg-purple-50 text-purple-600 border-b-2 border-purple-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                {t("purchase_history")}
              </button>
            </div>

            <div className="p-6">
              {activeTab === "usage" && (
                <div>
                  {usage.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-400">{t("no_usage")}</p>
                      <p className="text-gray-500 text-sm mt-1">{t("start_using")}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {usage.map((record) => (
                        <div
                          key={record.id}
                          className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl border ${
                            record.status === "failed" ? "opacity-60 border-red-200" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              record.status === "failed"
                                ? "bg-red-100"
                                : "bg-green-100"
                            }`}>
                              {record.status === "failed" ? (
                                <span className="text-red-500 text-lg">✗</span>
                              ) : (
                                <span className="text-green-500 text-lg">✓</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {record.status === "failed" ? t("processing_failed") : t("image_processed")}
                              </p>
                              <p className="text-sm text-gray-400">
                                {new Date(record.created_at).toLocaleString()}
                                {record.source === "subscription" && (
                                  <span className="ml-2 text-purple-400">• {t("subscription")}</span>
                                )}
                                {record.source === "one-time" && (
                                  <span className="ml-2 text-blue-400">• {t("onetime")}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-red-400">-{record.credits_used}</p>
                            {record.image_size && (
                              <p className="text-sm text-gray-400">
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
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-400">{t("no_purchases")}</p>
                      <a href="/pricing" className="inline-block mt-3 text-purple-500 hover:text-purple-600 underline">
                        {t("view_pricing_plans")}
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {purchases.map((purchase) => (
                        <div
                          key={purchase.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <p className="font-medium">{purchase.package_name}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(purchase.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-500">+{purchase.credits}</p>
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
        </div>
      </div>
    </Layout>
  )
}
