"use client"
import { Bell, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

export function DashboardHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  return (
    <div className="sticky top-0 z-50 bg-white border-b px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
              <div className="hidden md:block text-xl font-bold text-primary">
                  <Image
                     src={'/image/DeSocial Plug A11.png'}
                    width={100}
                    height={100}
                    alt="Logo"
                    className="w-[17%]"
                  />
              </div>

        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          {/* Notifications dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-gray-100 bg-gray-100 md:bg-transparent"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] md:w-80 max-w-md">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[60vh] md:max-h-96 overflow-auto">
                <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                  <div className="font-semibold">New account available</div>
                  <div className="text-sm text-muted-foreground">
                    Instagram account with 10,000+ followers is now available
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                  <div className="font-semibold">Order completed</div>
                  <div className="text-sm text-muted-foreground">Your order #12345 has been completed successfully</div>
                  <div className="text-xs text-muted-foreground mt-1">5 hours ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                  <div className="font-semibold">Payment received</div>
                  <div className="text-sm text-muted-foreground">Your wallet has been credited with ₦5,000</div>
                  <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 md:h-10 md:w-10 rounded-full p-0 hover:bg-gray-100 ring-2 ring-gray-200"
              >
                <Avatar className="h-9 w-9 md:h-10 md:w-10">
                  <AvatarImage src="/image/avater.jpeg" />
                  <AvatarFallback className="bg-primary text-white">DT</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] p-4">
              {/* User info section */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                   <AvatarImage src="/image/avater.jpeg" />
                  <AvatarFallback className="bg-primary text-white">LF</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-base">losm fos</div>
                  <div className="text-sm text-gray-500">losmfos@gmail.com</div>
                </div>
              </div>

              {/* Edit Profile button */}
              <Button variant="outline" className="w-full mb-4 justify-center bg-transparent">
                Edit Profile
              </Button>

              {/* Theme Mode section */}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">Theme Mode</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      theme === "light"
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span className="text-xs font-medium">Light</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                      <span className="text-xs font-medium">Dark</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Logout button */}
              <button className="w-full flex items-center justify-center gap-2 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 bg-gray-100 md:bg-transparent">
            <X className="w-5 h-5 text-gray-700" />
          </Button>
        </div>
      </div>
    </div>
  )
}
