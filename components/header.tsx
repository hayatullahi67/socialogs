"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, User, X } from "lucide-react"
import cn from "classnames"

const NAV = ["About us", "Services", "Boost Accounts", "Blog"]

export function Header() {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement | null>(null)

  // Close drawer on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  // Trap focus inside drawer when open (basic)
  useEffect(() => {
    if (!open || !drawerRef.current) return
    const first = drawerRef.current.querySelector<HTMLElement>("button, a, input")
    first?.focus()
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Desktop & Tablet layout */}
          <div className="hidden lg:flex h-16 items-center justify-between">
            {/* left: logo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Image
                  src="/image/DeSocial Plug AW2.png"
                  alt="Logo"
                  width={160}
                  height={70}
                  className="w-auto h-12 object-contain"
                />
              </div>
            </div>

            {/* center: nav */}
            <nav aria-label="Primary" className="flex gap-10">
              {NAV.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* right: auth buttons */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="px-3 py-1.5 rounded-full">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>

              <Button className="rounded-full px-4 py-1.5" /* primary */>
                Signup
              </Button>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="flex items-center justify-between h-16 lg:hidden">
            {/* left: logo (smaller) */}
            <div className="flex items-center">
              <Image
                src="/image/DeSocial Plug AW2.png"
                alt="Logo"
                width={120}
                height={36}
                className="w-auto h-8 object-contain"
              />
            </div>

            {/* right: icons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="rounded-full"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Drawer for mobile (blue slider) */}
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          open ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpen(false)}
        style={{ background: "rgba(10, 40, 255, 0.6)" }}
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-80 max-w-full transform transition-transform duration-300 shadow-2xl",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="h-full flex flex-col bg-gradient-to-b from-blue-600 to-blue-500 text-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Image
                src="/image/DeSocial Plug A23.png"
                width={120}
                height={36}
                alt="Logo"
                className="w-auto h-8 object-contain"
              />
            </div>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-4">
              {NAV.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="block rounded-md px-3 py-2 text-base font-medium text-white/95 hover:bg-white/10 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-4 pb-8">
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border border-white/40 px-4 py-2 text-white bg-white/6 hover:bg-white/10"
              >
                Login
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-white text-blue-600 px-4 py-2 font-semibold hover:opacity-95"
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Header
