"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "@/lib/firebase"
import { X } from "lucide-react"

interface Credential {
  username?: string
  password?: string
  [key: string]: any
}

interface Purchase {
  id: string
  platform: string
  followers: number
  totalAmount: number
  quantity: number
  purchaseDate: any
  credentials: Credential[]
  status?: string
  paystackReference?: string
  accountId?: string
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [loading, setLoading] = useState(true)

  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const auth = getAuth()

    const fetchPurchases = async (userId: string) => {
      try {
        const purchasesRef = collection(db, "purchases")
        const q = query(purchasesRef, where("userUUID", "==", userId))
        const snapshot = await getDocs(q)

        const purchaseData: Purchase[] = []
        let total = 0

        snapshot.forEach((doc) => {
          const data = { id: doc.id, ...(doc.data() as any) } as Purchase
          // ensure credentials array shape
          data.credentials = (data.credentials || []).map((c: any) => ({
            username: c?.username || "",
            password: c?.password || "",
          }))
          purchaseData.push(data)
          total += data.totalAmount || 0
        })

        setPurchases(purchaseData)
        setTotalSpent(total)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching purchases:", error)
        setLoading(false)
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPurchases(user.uid)
      } else {
        setPurchases([])
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const openPurchaseModal = (p: Purchase) => {
    setSelectedPurchase(p)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPurchase(null)
  }

  const formatDate = (ts: any) => {
    if (!ts) return "N/A"
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts)
      return d.toLocaleString("en-GB", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
    } catch {
      return String(ts)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <main className="p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Purchases</h1>
            <p className="text-sm text-gray-600 mt-1">View your recent purchases and order details.</p>
          </div>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm text-gray-500">Total Spent</h3>
              <div className="mt-2 text-xl font-semibold">₦{totalSpent.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm text-gray-500">Orders</h3>
              <div className="mt-2 text-xl font-semibold">{purchases.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm text-gray-500">Pending</h3>
              <div className="mt-2 text-xl font-semibold">
                {purchases.filter((p) => p.status === "Processing").length}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            {purchases.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No purchases found</div>
            ) : (
              purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition"
                  onClick={() => openPurchaseModal(purchase)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Order #{purchase.id.slice(0, 8)}</h4>
                      <p className="text-sm text-gray-500">
                        {purchase.platform} | {purchase.followers?.toLocaleString() || "—"} followers
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(purchase.purchaseDate)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{purchase.status || "Completed"}</div>
                      <div className="font-semibold text-gray-900">₦{purchase.totalAmount?.toLocaleString() || "0"}</div>
                    </div>
                  </div>
                </div>
              )))}
            
          </section>
        </div>

        {/* Modal */}
        {isModalOpen && selectedPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Purchase #{selectedPurchase.id.slice(0, 8)}
                    </h2>
                    <p className="text-sm text-gray-600">{selectedPurchase.platform} — {selectedPurchase.quantity} log(s)</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(selectedPurchase.purchaseDate)}</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 mb-4">
                  <div className="mb-2 text-sm text-gray-700">Paystack Reference</div>
                  <div className="font-mono text-sm text-gray-800">{selectedPurchase.paystackReference || "—"}</div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Credentials ({selectedPurchase.credentials?.length || 0})</h3>
                  {selectedPurchase.credentials && selectedPurchase.credentials.length > 0 ? (
                    <div className="grid gap-3">
                      {selectedPurchase.credentials.map((cred, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-3 border border-slate-200">
                          <div className="text-sm text-gray-700"><span className="font-semibold">Username:</span> {cred.username}</div>
                          <div className="text-sm text-gray-700"><span className="font-semibold">Password:</span> {cred.password}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No credentials available for this purchase.</div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button onClick={closeModal} className="h-10 px-4 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}