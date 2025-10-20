'use client'
import { useEffect, useState } from 'react'
import type { IconType } from 'react-icons'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getAccounts, type Account } from '@/lib/accounts'

import { FaTwitter, FaInstagram, FaYoutube, FaFacebook, FaUserCircle } from 'react-icons/fa'
import { SiTiktok, SiX, SiSnapchat } from 'react-icons/si'
import { FiGlobe } from 'react-icons/fi'

function getPlatformIcon(platform?: string): IconType {
  if (!platform) return FaUserCircle
  const key = platform.toLowerCase()
  if (key.includes('twitter') || key === 'x' || key.includes('/x')) return FaTwitter
  if (key.includes('instagram') || key.includes('ig')) return FaInstagram
  if (key.includes('youtube') || key.includes('yt')) return FaYoutube
  if (key.includes('tiktok')) return SiTiktok
  if (key.includes('facebook') || key.includes('fb')) return FaFacebook
  if (key.includes('snapchat')) return SiSnapchat
  if (key.includes('website') || key.includes('web') || key.includes('site')) return FiGlobe
  // add more mappings as needed
  return FaUserCircle
}

export function AccountsList() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await getAccounts()
        setAccounts(data)
      } catch (error) {
        console.error('Error loading accounts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAccounts()
  }, [])

  if (loading) return <div>Loading...</div>

  // compute unique platforms for filter chips
  const platforms = Array.from(
    new Set(accounts.map(a => (a.platform || 'Unknown').trim()))
  ).filter(Boolean)

  const filteredAccounts = selectedPlatform
    ? accounts.filter(a => (a.platform || '').toLowerCase().trim() === selectedPlatform.toLowerCase().trim())
    : accounts

  return (
    <div>
      <h2 className="text-base md:text-xl font-bold mb-3 md:mb-4 text-gray-900">Social Media Accounts</h2>

      {/* Platform filter chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedPlatform(null)}
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            !selectedPlatform ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
          )}
        >
          All
        </button>

        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPlatform(p)}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              selectedPlatform && selectedPlatform.toLowerCase().trim() === p.toLowerCase().trim()
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="space-y-2 md:space-y-3">
        {filteredAccounts.map((account) => {
          const Icon = getPlatformIcon(account.platform)
          return (
            <div
              key={account.id}
              className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
            >
              <div className="flex items-center gap-2 md:gap-3 flex-1">
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 cursor-pointer"
                  onClick={() => setSelectedPlatform(account.platform ?? null)}
                  title={`Filter by ${account.platform ?? 'Unknown'}`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-xs md:text-sm">{account.olaz}</h3>
                  <p
                    className="text-xs text-gray-500 cursor-pointer hover:underline"
                    onClick={() => setSelectedPlatform(account.platform ?? null)}
                    title={`Filter by ${account.platform ?? 'Unknown'}`}
                  >
                    {account.platform}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3">
                <div
                  className={cn(
                    "px-2 md:px-3 py-1 rounded-md text-xs font-semibold",
                    account.status === "Available" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  )}
                >
                  {account.followers} followers
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-900 min-w-[80px] md:min-w-[100px] text-right">
                  ₦{account.price}
                </div>
                <Button
                  className={cn(
                    "min-w-[60px] md:min-w-[70px] rounded-full font-semibold text-xs md:text-sm h-8 md:h-9",
                    "bg-primary hover:bg-primary/90 text-white"
                  )}
                >
                  Buy
                </Button>
              </div>
            </div>
          )
        })}

        {filteredAccounts.length === 0 && (
          <div className="text-sm text-gray-500">No accounts found for "{selectedPlatform}"</div>
        )}
      </div>
    </div>
  )
}
