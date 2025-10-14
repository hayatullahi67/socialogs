"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const categories = [
  "Instagram Boosted accounts",
  "Instagram Boosted Accounts (Big Boyz)",
  "Instagram By Countries",
  "Instagram Old Accounts",
  "Facebook USA",
  "Facebook Dating",
  "Facebook Target",
]

export function CategoryTabs() {
  const [selected, setSelected] = useState("Instagram Boosted accounts")

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelected(category)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            selected === category
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
