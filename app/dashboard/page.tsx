"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PlatformSelector } from "@/components/dashboard/platform-selector"
import { CategoryTabs } from "@/components/dashboard/category-tabs"
import { AccountsList } from "@/components/dashboard/accounts-list"
import { useState } from "react"
import AuthGuard from "@/components/AuthGuard" // Import the AuthGuard

export default function DashboardPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  return (
    <AuthGuard> {/* Wrap the entire component with AuthGuard */}
      <DashboardLayout>
        <main className="p-6 lg:p-8 bg-gray-50">
          <StatsCards />

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Select a Platform</h2>
            <PlatformSelector 
              selectedPlatform={selectedPlatform}
              onPlatformChange={setSelectedPlatform}
            />
          </div>

          <div className="mb-6">
            <CategoryTabs />
          </div>

          <AccountsList selectedPlatform={selectedPlatform} />
        </main>
      </DashboardLayout>
    </AuthGuard>
  )
}
