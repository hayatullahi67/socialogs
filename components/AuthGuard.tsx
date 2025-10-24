"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true) // Add loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // User is not logged in, redirect to login page
        router.push("/login") // Change this to your desired route
      } else {
        // User is logged in, set loading to false
        setLoading(false)
      }
    })

    return () => unsubscribe() // Cleanup subscription on unmount
  }, [router])

  if (loading) {
    return null // Render nothing while loading
  }

  return <>{children}</> // Render children if logged in
}

export default AuthGuard