"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Copy, CheckCircle2 } from "lucide-react"

export default function AddFundsPage() {
  const [virtualAccount, setVirtualAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchVirtualAccount() {
      try {
        const user = auth.currentUser
        if (!user) {
          console.log("No user logged in")
          setLoading(false)
          return
        }

        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists() && userDoc.data()?.virtualAccount) {
          setVirtualAccount(userDoc.data()?.virtualAccount)
          console.log("Fetched virtual account:", userDoc.data()?.virtualAccount)
        } else {
          console.log("No virtual account found for user")
        }
      } catch (error) {
        console.error("Error fetching virtual account:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVirtualAccount()
  }, [])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <DashboardLayout>
      <main className="p-6 lg:p-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Add Funds</h1>
            <p className="text-sm text-gray-600 mt-1">Transfer to the account below to fund your wallet</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              Loading account details...
            </div>
          ) : virtualAccount ? (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Bank Name</span>
                    <span className="font-medium">{virtualAccount.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{virtualAccount.accountNumber}</span>
                      <button
                        onClick={() => handleCopy(virtualAccount.accountNumber)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Account Name</span>
                    <span className="font-medium">{virtualAccount.accountName}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">How to fund your wallet:</h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Copy the account number above</li>
                  <li>2. Transfer the amount you want to fund from your bank app</li>
                  <li>3. Your wallet will be credited automatically within 5 minutes</li>
                  <li>4. If not credited after 5 minutes, please contact support</li>
                </ol>
              </div>

              {/* Important Notice */}
              <div className="mt-6 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
                <strong>Important:</strong> Make sure the account name matches exactly as shown above. 
                Transfers with incorrect names may be delayed or rejected.
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center text-gray-500">
              No virtual account found. Please contact support if this issue persists.
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  )
}