"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function TransactionsPage() {
  const items = [
    { id: "T-001", date: "Oct 18, 2025", desc: "Purchase - Instagram account", amount: "₦3,500", status: "Completed" },
    { id: "T-002", date: "Oct 12, 2025", desc: "Add Funds", amount: "₦5,000", status: "Completed" },
    { id: "T-003", date: "Oct 09, 2025", desc: "Purchase - TikTok account", amount: "₦12,850", status: "Processing" },
  ]

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
                {items.map((it) => (
                  <tr key={it.id} className="border-b last:border-b-0">
                    <td className="py-3 px-4">{it.id}</td>
                    <td className="py-3 px-4">{it.date}</td>
                    <td className="py-3 px-4">{it.desc}</td>
                    <td className="py-3 px-4 text-right font-semibold">{it.amount}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                        it.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {it.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {items.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">No transactions found.</div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}