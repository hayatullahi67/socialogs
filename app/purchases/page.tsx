"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/header"

export default function PurchasesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <aside className="hidden lg:block w-72">
          <Sidebar />
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:pl-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Purchases</h1>
              <p className="text-sm text-gray-600 mt-1">View your recent purchases and order details.</p>
            </div>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-sm text-gray-500">Total Spent</h3>
                <div className="mt-2 text-xl font-semibold">₦18,450</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-sm text-gray-500">Orders</h3>
                <div className="mt-2 text-xl font-semibold">12</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-sm text-gray-500">Pending</h3>
                <div className="mt-2 text-xl font-semibold">2</div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Order #DE12345</h4>
                    <p className="text-sm text-gray-500">Instagram | 120k followers</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Purchased</div>
                    <div className="font-semibold text-gray-900">₦3,500</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Order #DE12312</h4>
                    <p className="text-sm text-gray-500">X | 45k followers</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Delivered</div>
                    <div className="font-semibold text-gray-900">₦2,100</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Order #DE12290</h4>
                    <p className="text-sm text-gray-500">TikTok | 220k followers</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Processing</div>
                    <div className="font-semibold text-gray-900">₦12,850</div>
                  </div>
                </div>
              </div>

              {/* Placeholder for more items; responsive card list */}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}