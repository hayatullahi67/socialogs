"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/header"
import { useState } from "react"

export default function AddFundsPage() {
  const [amount, setAmount] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <aside className="hidden lg:block w-72">
          <Sidebar />
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:pl-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Add Funds</h1>
              <p className="text-sm text-gray-600 mt-1">Top up your wallet to buy accounts faster.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                <label className="block text-sm text-gray-600">Amount</label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter amount (₦)"
                  />
                  <button className="bg-primary text-white px-4 rounded-lg font-medium">Top up</button>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm text-gray-500 mb-2">Choose a payment method</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-xs text-gray-500">Transfer to our account manually</div>
                      </div>
                      <div>
                        <button className="text-sm text-primary font-medium">Select</button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">Paystack / Card</div>
                        <div className="text-xs text-gray-500">Instant card payments</div>
                      </div>
                      <div>
                        <button className="text-sm text-primary font-medium">Select</button>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">This page is UI-only. Integration with payment providers should be implemented on the server side.</p>
              </div>

              <aside className="bg-white rounded-xl p-4 shadow-sm">
                <h4 className="font-medium text-gray-900">Wallet Balance</h4>
                <div className="mt-3 text-2xl font-semibold">₦4,750</div>
                <div className="mt-4 text-sm text-gray-500">Suggested top-ups</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[1000, 2500, 5000, 10000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(String(val))}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-sm"
                    >
                      ₦{val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}