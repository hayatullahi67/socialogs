import { Button } from "@/components/ui/button"

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
      {/* Total Balance Card */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <div className="p-2 md:p-3 bg-blue-50 rounded-lg md:rounded-xl flex-shrink-0">
              <svg className="w-4 h-4 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs md:text-sm text-gray-600">Total Balance</div>
              <div className="text-lg md:text-2xl font-bold text-gray-900">₦ 0.00</div>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white text-xs md:text-sm px-3 md:px-4 h-8 md:h-10 rounded-lg md:rounded-xl flex-shrink-0">
            Fund Wallet
          </Button>
        </div>
      </div>

      {/* Total Spent Card */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="p-2 md:p-3 bg-blue-50 rounded-lg md:rounded-xl flex-shrink-0">
            <svg className="w-4 h-4 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs md:text-sm text-gray-600">Total Spent</div>
            <div className="text-lg md:text-2xl font-bold text-gray-900">₦ 0</div>
          </div>
        </div>
      </div>

      {/* Account Status Card */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="p-2 md:p-3 bg-blue-50 rounded-lg md:rounded-xl flex-shrink-0">
            <svg className="w-4 h-4 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs md:text-sm text-gray-600">Account Status</div>
            <div className="text-lg md:text-2xl font-bold text-gray-900">Standard</div>
          </div>
        </div>
      </div>
    </div>
  )
}
