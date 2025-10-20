"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, ShoppingBasket, Wallet, ArrowLeftRight, UsersRound, Headset, Handshake } from "lucide-react"
// import SignOutButton from "./signout-button"
import SignOutButton from "./signout-button"

const menuItems = [
  { icon: ShoppingBasket, label: "Purchases", href: "/purchases" },
  { icon: Wallet, label: "Add Funds", href: "/add-funds" },
  { icon: ArrowLeftRight, label: "Transactions", href: "/transactions" },
  { icon: UsersRound, label: "Referrals", href: "/referrals" },
  { icon: Headset, label: "Support", href: "/support" },
  { icon: Handshake, label: "Join Our Community", href: "/community" },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
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
        {/* onClose handled by client button if needed */}
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
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-blue-600">
        {/* client-only signout button */}
        <SignOutButton onClose={onClose} />
      </div>
    </div>
  )
}
