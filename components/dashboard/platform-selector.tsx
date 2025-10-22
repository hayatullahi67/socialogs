// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
// import { Instagram, Facebook, Music, Twitter, Linkedin, Mic, Ghost, Shield, MoreHorizontal } from "lucide-react"

// const platforms = [
//   { id: "all", name: "All", icon: null },
//   { id: "instagram", name: "Instagram", icon: Instagram },
//   { id: "facebook", name: "Facebook", icon: Facebook },
//   { id: "tiktok", name: "TikTok", icon: Music },
//   { id: "x", name: "X", icon: Twitter },
//   { id: "linkedin", name: "LinkedIn", icon: Linkedin },
//   { id: "google", name: "Google Voice", icon: Mic },
//   { id: "snapchat", name: "Snapchat", icon: Ghost },
//   { id: "vpn", name: "VPN", icon: Shield },
//   { id: "other", name: "Other Platforms", icon: MoreHorizontal },
// ]



// export function PlatformSelector() {
//   const [selected, setSelected] = useState("all")

//   return (
//     <div>
//       <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4 pb-2 border-b">Select a Platform</h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
//         {platforms.map((platform) => {
//           const Icon = platform.icon
//           return (
//             <Button
//               key={platform.id}
//               variant="outline"
//               className={cn(
//                 "h-auto py-2 md:py-3 px-3 md:px-4 flex items-center justify-center gap-2 rounded-lg md:rounded-xl transition-all font-medium text-xs md:text-sm",
//                 selected === platform.id
//                   ? "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
//                   : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
//               )}
//               onClick={() => setSelected(platform.id)}
//             >
//               {Icon && <Icon className="w-4 h-4 md:w-5 md:h-5" />}
//               <span className="text-xs md:text-sm">{platform.name}</span>
//             </Button>
//           )
//         })}
//       </div>
//     </div>
//   )
// }



"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Instagram, Facebook, Music, Twitter, Linkedin, Mic, Ghost, Shield, MoreHorizontal } from "lucide-react"

const platforms = [
  { id: "all", name: "All", icon: null },
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "facebook", name: "Facebook", icon: Facebook },
  { id: "tiktok", name: "TikTok", icon: Music },
  { id: "x", name: "X", icon: Twitter },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
  { id: "google", name: "Google Voice", icon: Mic },
  { id: "snapchat", name: "Snapchat", icon: Ghost },
  { id: "vpn", name: "VPN", icon: Shield },
  { id: "other", name: "Other Platforms", icon: MoreHorizontal },
]

interface PlatformSelectorProps {
  selectedPlatform: string
  onPlatformChange: (platformId: string) => void
}

export function PlatformSelector({ selectedPlatform, onPlatformChange }: PlatformSelectorProps) {
  return (
    <div>
      <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4 pb-2 border-b">Select a Platform</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
        {platforms.map((platform) => {
          const Icon = platform.icon
          return (
            <Button
              key={platform.id}
              variant="outline"
              className={cn(
                "h-auto py-2 md:py-3 px-3 md:px-4 flex items-center justify-center gap-2 rounded-lg md:rounded-xl transition-all font-medium text-xs md:text-sm",
                selectedPlatform === platform.id
                  ? "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
              )}
              onClick={() => onPlatformChange(platform.id)}
            >
              {Icon && <Icon className="w-4 h-4 md:w-5 md:h-5" />}
              <span className="text-xs md:text-sm">{platform.name}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}