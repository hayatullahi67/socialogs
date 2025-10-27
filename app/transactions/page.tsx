"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "@/lib/firebase"
import { X } from "lucide-react"

interface Transaction {
  id: string
  date?: any
  desc?: string
  amount?: number
  status?: string
  type?: string
  platform?: string
  paystackReference?: string
  accountId?: string
  userUUID?: string
  [key: string]: any
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()

    const fetchTransactions = async (userId: string) => {
      try {
        const transactionsRef = collection(db, "transactions")
        const q = query(transactionsRef, where("userUUID", "==", userId))
        const snapshot = await getDocs(q)

        const txData: Transaction[] = snapshot.docs.map((d) => {
          const data = { id: d.id, ...(d.data() as any) } as Transaction
          return data
        })

        // client-side sort by date (newest first). tolerant to Timestamp or ISO/string
        txData.sort((a, b) => {
          const getTime = (t: any) => {
            if (!t) return 0
            if (t.toDate && typeof t.toDate === "function") return t.toDate().getTime()
            const parsed = Date.parse(String(t))
            return isNaN(parsed) ? 0 : parsed
          }
          return getTime(b.date) - getTime(a.date)
        })

        setTransactions(txData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        setLoading(false)
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchTransactions(user.uid)
      } else {
        setTransactions([])
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const formatDate = (ts: any) => {
    if (!ts) return "N/A"
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts)
      return d.toLocaleString("en-GB", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
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
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-600 mt-1">All account activity and payments.</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="text-sm text-gray-500 border-b">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-b-0">
                    <td className="py-3 px-4">{tx.paystackReference || tx.id.slice(0, 8)}</td>
                    <td className="py-3 px-4">{formatDate(tx.date)}</td>
                    <td className="py-3 px-4">
                      {tx.type === "purchase" ? `Purchase - ${tx.platform || ""}` : tx.desc || ""}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">₦{(tx.amount || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${tx.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {tx.status || "unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transactions.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">No transactions found.</div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}