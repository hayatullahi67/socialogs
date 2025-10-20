'use client'
import React from 'react'

export default function SignOutButton({ onClose }: { onClose?: () => void }) {
  const handleSignOut = async () => {
    try {
      // remove stored tokens / user data (update keys to match your app)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.clear()
    } catch (e) {
      // ignore storage errors
    }

    // optional: notify server to invalidate refresh tokens
    // await fetch('/api/auth/logout', { method: 'POST' })

    onClose?.()
    // full page redirect so no App Router hook is required
    window.location.href = '/login'
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span className="font-medium">Signout</span>
    </button>
  )
}