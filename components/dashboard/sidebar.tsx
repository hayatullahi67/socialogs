"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Wallet, Receipt, Users, MessageCircle, UsersRound, X, ShoppingBasket, ArrowLeftRight, Headset, Handshake } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

const menuItems = [
  { icon: ShoppingBasket, label: "Purchases", href: "/purchases" },
  { icon: Wallet, label: "Add Funds", href: "/add-funds" },
  { icon: ArrowLeftRight, label: "Transactions", href: "/transactions" },
  { icon: UsersRound, label: "Referrals", href: "/referrals" },
  { icon: Headset, label: "Support", href: "/support" },
  { icon: Handshake, label: "Join Our Community", href: "/community" },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="h-full bg-[#1a49ee] flex flex-col">
      {/* Profile section */}
      <div className="p-6 flex items-center justify-between border-b border-blue-600">
        <div className="flex items-center gap-3">
         <Image
                       src="/image/DeSocial Plug A23.png"
                       width={120}
                       height={70}
                       alt="Logo"
                       className="w-auto h-11 object-contain"
                     />
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Menu items */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                isActive ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700 hover:text-white",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-blue-600">
        <Link
          href="/logout"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="font-medium">Signout</span>
        </Link>
      </div>
    </div>
  )
}
