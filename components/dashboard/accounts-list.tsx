import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const accounts = [
  {
    id: 1,
    name: "Instagram Accounts | 10,000+ followers | Mail Included",
    stock: "1pcs",
    stockColor: "yellow",
    price: "N50430.60",
    available: true,
  },
  {
    id: 2,
    name: "Instagram Accounts | 1000+ followers | Mail Included",
    stock: "16pcs",
    stockColor: "green",
    price: "N8910.00",
    available: true,
  },
  {
    id: 3,
    name: "Instagram Accounts | 250+ followers | Mail Included",
    stock: "0pcs",
    stockColor: "red",
    price: "N3511.20",
    available: false,
  },
  {
    id: 4,
    name: "Instagram Accounts | 5000+ followers | Mail Included",
    stock: "2pcs",
    stockColor: "yellow",
    price: "N36464.72",
    available: true,
  },
  {
    id: 5,
    name: "Instagram Accounts | 50+ followers | Mail Included",
    stock: "0pcs",
    stockColor: "red",
    price: "N2268.75",
    available: false,
  },
]

export function AccountsList() {
  return (
    <div>
      <h2 className="text-base md:text-xl font-bold mb-3 md:mb-4 text-gray-900">Instagram Boosted accounts</h2>
      <div className="space-y-2 md:space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
          >
            <div className="flex items-center gap-2 md:gap-3 flex-1">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.948 0-3.204.013-3.583.072-4.949.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-xs md:text-sm">{account.name}</h3>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3">
              <div
                className={cn(
                  "px-2 md:px-3 py-1 rounded-md text-xs font-semibold",
                  account.stockColor === "yellow" && "bg-yellow-100 text-yellow-800",
                  account.stockColor === "green" && "bg-green-100 text-green-800",
                  account.stockColor === "red" && "bg-red-100 text-red-800",
                )}
              >
                {account.stock}
              </div>
              <div className="text-sm md:text-base font-semibold text-gray-900 min-w-[80px] md:min-w-[100px] text-right">
                {account.price}
              </div>
              <Button
                className={cn(
                  "min-w-[60px] md:min-w-[70px] rounded-full font-semibold text-xs md:text-sm h-8 md:h-9",
                  account.available
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white",
                )}
              >
                {account.available ? "Buy" : "Pre"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
