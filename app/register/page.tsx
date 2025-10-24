"use client"

import Link from "next/link"
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUpWithFirebase } from "@/lib/firebase-auth"
import { auth, db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.phone) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Please fill in all fields",
      })
      return
    }

    // Basic phone validation (digits, optional +, length 7-15)
    const phoneNormalized = formData.phone.trim()
    const phoneRegex = /^\+?\d{7,15}$/
    if (!phoneRegex.test(phoneNormalized)) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Please enter a valid phone number (digits only, optional +, 7-15 chars).",
      })
      return
    }

    if (formData.password.length < 6) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Password must be at least 6 characters long",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await signUpWithFirebase(
        formData.email,
        formData.password,
        formData.username,
        phoneNormalized
      )

      // ALWAYS log the signup result so you can verify it's returning success
      console.log('signUpWithFirebase result:', result)

      if (result.success) {
        console.log('Firebase signup succeeded — about to call virtual account API', {
          email: formData.email,
          username: formData.username,
          phone: phoneNormalized,
          navigatorOnline: typeof navigator !== "undefined" ? navigator.onLine : "unknown",
        })

        // API credentials (as provided)
        const apiSecret = 'b6c78bbe842c103548b6e93360def7a9fee8d89b847e7579ac648206898149e699abec0fc05518faefbc86ce43269dcb90a7e9665895993cfa930fe0'
        const apiKey = '51f95b6c653949ce47d04a3455a6dd1245ca54a6' // used as api-key header
        const businessId = '731a954915ce7768e190acd29eb08e8a853c3ab8'

        const headers = {
          'Authorization': `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
          'api-key': apiKey,
        }

        const body = {
          email: formData.email,
          name: formData.username,
          phoneNumber: phoneNormalized,
          bankCode: ['20946', '20897'],
          businessId,
        }

        // Log request details (do NOT expose secrets in production logs)
        console.log('Calling virtual account API ->', {
          url: 'https://api.paymentpoint.co/api/v1/createVirtualAccount',
          headers: { ...headers, Authorization: 'Bearer [REDACTED]' }, // redact secret in logs
          body,
        })

        try {
          const proxyResp = await fetch("/api/create-virtual-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })

          const proxyJson = await proxyResp.json()
          console.log("Proxy response:", proxyResp.status, proxyJson)

          if (proxyResp.ok && proxyJson.status === 'success') {
            console.log("Virtual account created via server proxy:", proxyJson)
            
            // Get the bank account details from response
            const bank = proxyJson.bankAccounts?.[0]
            const uid = auth.currentUser?.uid

            if (uid && bank) {
              try {
                // Update the user's document with virtual account details
                await updateDoc(doc(db, "users", uid), {
                  virtualAccount: {
                    accountName: bank.accountName,
                    accountNumber: bank.accountNumber,
                    bankName: bank.bankName,
                    bankCode: bank.bankCode,
                    reservedAccountId: bank.Reserved_Account_Id,
                    updatedAt: new Date().toISOString()
                  }
                })
                console.log("✅ Virtual account stored successfully for user:", uid)
              } catch (dbError) {
                console.error("Failed to store virtual account:", dbError)
              }
            } else {
              console.warn("Missing uid or bank details for storage", { uid, bankInfo: bank })
            }
          } else {
            console.error("Server proxy returned error:", proxyJson)
          }
        } catch (err) {
          console.error("Error calling server proxy:", err)
        }

        setModal({
          isOpen: true,
          type: "success",
          title: "Registration Successful!",
          message: "Your account has been created successfully. Redirecting to login...",
        })

        // Reset form
        setFormData({ username: "", email: "", password: "", phone: "" })

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: "Registration Failed",
          message: result.message || "Something went wrong. Please try again.",
        })
      }
    } catch (error: any) {
      console.error('Unexpected error during registration flow:', error)
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: error?.message || "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-4 animate-fade-in">Register</h1>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
              Create an account and unlock a vast selection of premium social media accounts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform group-focus-within:scale-110">
                <User className="w-5 h-5" />
              </div>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                className="pl-12 h-14 bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white rounded-xl text-base transition-all disabled:opacity-50"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform group-focus-within:scale-110">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className="pl-12 h-14 bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white rounded-xl text-base transition-all disabled:opacity-50"
              />
            </div>

            {/* Phone input */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform group-focus-within:scale-110">
                <Phone className="w-5 h-5" />
              </div>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone (e.g. +2348012345678)"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                className="pl-12 h-14 bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white rounded-xl text-base transition-all disabled:opacity-50"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform group-focus-within:scale-110">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className="pl-12 pr-12 h-14 bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white rounded-xl text-base transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl text-lg font-semibold mt-6 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "REGISTERING..." : "REGISTER →"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-14 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Button>

          <p className="text-center mt-8 text-base text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <img
          src="/happy-person-using-social-media-on-phone-with-colo.jpg"
          alt="Happy person using social media on phone with colorful background"
          className="w-full h-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 animate-slide-up">
            <h2 className="text-4xl font-bold mb-4">Join Thousands of Users</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Access premium social media accounts and grow your online presence instantly
            </p>
          </div>
        </div>
      </div>

      {/* Success/Error Modal */}
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
        <div className="text-center">
          <div className="mb-4">
            {modal.type === "success" ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            )}
          </div>
          <p className="text-gray-600 mb-6">{modal.message}</p>
          <div className="flex gap-3">
            <Button onClick={closeModal} className="flex-1" variant={modal.type === "success" ? "default" : "outline"}>
              {modal.type === "success" ? "Continue" : "Try Again"}
            </Button>
            {modal.type === "success" && (
              <Link href="/login" className="flex-1">
                <Button className="w-full" variant="outline">
                  Go to Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
