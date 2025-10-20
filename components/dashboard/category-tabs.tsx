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
    <div
      role="tablist"
      aria-label="Categories"
      className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide items-center border-b border-gray-100 mt-2"
    >
      {categories.map((category) => {
        const isActive = selected === category

        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => setSelected(category)}
            className={cn(
              "rounded-full px-4 py-2 text-[12px] whitespace-nowrap transition-all mt-1.5 duration-150 ease-in-out focus:outline-none",
              // Selected pill styling: thin blue outline, slightly filled white, blue text
              isActive
                ? "text-blue-600 bg-[#DBEBFE] ring-2 ring-blue-200/70 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                // Unselected: light gray text (light-looking), no heavy background
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            <span className={cn("select-none", isActive ? "font-semibold" : "font-normal")}>
              {category}
            </span>
          </button>
        )
      })}
    </div>
  )
}
