import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PlatformSelector } from "@/components/dashboard/platform-selector"
import { CategoryTabs } from "@/components/dashboard/category-tabs"
import { AccountsList } from "@/components/dashboard/accounts-list"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <main className="p-6 lg:p-8 bg-gray-50">
        <StatsCards />

        {/* <div className="text-center mb-6">
          <a href="#" className="text-primary hover:underline text-sm font-medium">
            Click Here to Watch a Video on how to Buy accounts
          </a>
        </div> */}

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Select a Platform</h2>
          <PlatformSelector />
        </div>

        <div className="mb-6">
          <CategoryTabs />
        </div>

        <AccountsList />
      </main>
    </DashboardLayout>
  )
}
