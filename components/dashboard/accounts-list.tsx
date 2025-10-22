
"use client"

import { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { collection, query, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Instagram, Facebook, Music, Twitter, Linkedin, Mic, Ghost, Shield, MoreHorizontal, X, Calendar, Mail, Users, DollarSign, Package, Plus, Minus, ShoppingCart } from "lucide-react"

interface FirebaseAccount {
  id: string;
  platform: string;
  followers: number;
  mailIncluded: boolean;
  status: string;
  price: number;
  olaz: string;
  logs: number;
  bulkLogs: string[];
  createdAt: any;
  files?: string[];
}

interface LogItem {
  username: string;
  password: string;
}

// Stock color mapping based on logs count
const getStockColor = (logs: number) => {
  if (logs === 0) return "red"
  if (logs <= 2) return "yellow"
  return "green"
}

interface AccountsListProps {
  selectedPlatform: string
}

// Platform icon mapping
const getPlatformIcon = (platform: string) => {
  const normalizedPlatform = platform.toLowerCase()
  
  if (normalizedPlatform.includes('instagram') || normalizedPlatform.includes('ig')) {
    return Instagram
  } else if (normalizedPlatform.includes('facebook') || normalizedPlatform.includes('fb')) {
    return Facebook
  } else if (normalizedPlatform.includes('tiktok') || normalizedPlatform.includes('tik tok')) {
    return Music
  } else if (normalizedPlatform.includes('x') || normalizedPlatform.includes('twitter')) {
    return Twitter
  } else if (normalizedPlatform.includes('linkedin')) {
    return Linkedin
  } else if (normalizedPlatform.includes('google') || normalizedPlatform.includes('voice')) {
    return Mic
  } else if (normalizedPlatform.includes('snapchat') || normalizedPlatform.includes('snap')) {
    return Ghost
  } else if (normalizedPlatform.includes('vpn')) {
    return Shield
  }
  return MoreHorizontal
}

// Platform category mapping
const getPlatformCategory = (platform: string) => {
  const normalizedPlatform = platform.toLowerCase()
  
  if (normalizedPlatform.includes('instagram') || normalizedPlatform.includes('ig')) {
    return 'instagram'
  } else if (normalizedPlatform.includes('facebook') || normalizedPlatform.includes('fb')) {
    return 'facebook'
  } else if (normalizedPlatform.includes('tiktok') || normalizedPlatform.includes('tik tok')) {
    return 'tiktok'
  } else if (normalizedPlatform.includes('x') || normalizedPlatform.includes('twitter')) {
    return 'x'
  } else if (normalizedPlatform.includes('linkedin')) {
    return 'linkedin'
  } else if (normalizedPlatform.includes('google') || normalizedPlatform.includes('voice')) {
    return 'google'
  } else if (normalizedPlatform.includes('snapchat') || normalizedPlatform.includes('snap')) {
    return 'snapchat'
  } else if (normalizedPlatform.includes('vpn')) {
    return 'vpn'
  }
  return 'other'
}

// Platform gradient colors
const getPlatformGradient = (platform: string) => {
  const normalizedPlatform = platform.toLowerCase()
  
  if (normalizedPlatform.includes('instagram') || normalizedPlatform.includes('ig')) {
    return 'from-purple-500 via-pink-500 to-orange-400'
  } else if (normalizedPlatform.includes('facebook') || normalizedPlatform.includes('fb')) {
    return 'from-blue-600 to-blue-500'
  } else if (normalizedPlatform.includes('tiktok') || normalizedPlatform.includes('tik tok')) {
    return 'from-black via-red-500 to-blue-400'
  } else if (normalizedPlatform.includes('x') || normalizedPlatform.includes('twitter')) {
    return 'from-gray-900 to-gray-700'
  } else if (normalizedPlatform.includes('linkedin')) {
    return 'from-blue-700 to-blue-600'
  } else if (normalizedPlatform.includes('google') || normalizedPlatform.includes('voice')) {
    return 'from-blue-500 via-red-500 to-yellow-500'
  } else if (normalizedPlatform.includes('snapchat') || normalizedPlatform.includes('snap')) {
    return 'from-yellow-400 to-yellow-300'
  } else if (normalizedPlatform.includes('vpn')) {
    return 'from-green-600 to-green-500'
  }
  return 'from-gray-600 to-gray-500'
}

// Get platform display name
const getPlatformDisplayName = (platformId: string) => {
  const platformNames: Record<string, string> = {
    all: 'All',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    x: 'X',
    linkedin: 'LinkedIn',
    google: 'Google Voice',
    snapchat: 'Snapchat',
    vpn: 'VPN',
    other: 'Other Platforms'
  }
  return platformNames[platformId] || platformId.charAt(0).toUpperCase() + platformId.slice(1)
}

// Format timestamp
const formatDate = (timestamp: any) => {
  if (!timestamp) return 'N/A'
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'N/A'
  }
}

export function AccountsList({ selectedPlatform }: AccountsListProps) {
  const [firestoreAccounts, setFirestoreAccounts] = useState<FirebaseAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<FirebaseAccount | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPurchaseMode, setIsPurchaseMode] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [availableLogs, setAvailableLogs] = useState<LogItem[]>([])
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [purchasedCredentials, setPurchasedCredentials] = useState<LogItem[]>([])

  useEffect(() => {
    async function fetchFirestoreAccounts() {
      try {
        const accountsRef = collection(db, 'uploads');
        const q = query(accountsRef);
        const snapshot = await getDocs(q);
        
        const accounts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as FirebaseAccount[];

        setFirestoreAccounts(accounts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching from Firestore:', error);
        setLoading(false);
      }
    }

    fetchFirestoreAccounts();
  }, []);

  // Filter accounts based on selected platform
  const filteredAccounts = selectedPlatform === "all"
    ? firestoreAccounts
    : firestoreAccounts.filter(acc => {
        const category = getPlatformCategory(acc.platform || '')
        return category === selectedPlatform
      })

  const handleBuyClick = (account: FirebaseAccount) => {
    setSelectedAccount(account)
    setIsModalOpen(true)
    setIsPurchaseMode(false)
    setQuantity(1)
    setPurchaseSuccess(false)
    setPurchasedCredentials([])
  }

  const handleProceedToPurchase = () => {
    if (!selectedAccount) return
    
    try {
      // Parse bulkLogs from the main document
      const bulkLogs = selectedAccount.bulkLogs || []
      
      const parsedLogs: LogItem[] = bulkLogs.map(logString => {
        // Parse "username: olaowe password: ehdydf" format
        const usernameMatch = logString.match(/username:\s*(\S+)/)
        const passwordMatch = logString.match(/password:\s*(\S+)/)
        
        return {
          username: usernameMatch ? usernameMatch[1] : '',
          password: passwordMatch ? passwordMatch[1] : ''
        }
      })
      
      setAvailableLogs(parsedLogs)
      setIsPurchaseMode(true)
      setQuantity(1)
    } catch (error) {
      console.error('Error loading logs:', error)
      alert('Failed to load available logs')
    }
  }

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      if (quantity < availableLogs.length) {
        setQuantity(prev => prev + 1)
      } else {
        alert(`Maximum quantity available is ${availableLogs.length} logs`)
      }
    } else {
      if (quantity > 1) {
        setQuantity(prev => prev - 1)
      }
    }
  }

  const handleCompletePurchase = async () => {
    if (!selectedAccount) return
    
    setPurchasing(true)
    
    try {
      // Get the logs to sell
      const logsToSell = availableLogs.slice(0, quantity)
      const soldCredentials: LogItem[] = logsToSell
      
      // Calculate remaining logs
      const remainingBulkLogs = selectedAccount.bulkLogs.slice(quantity)
      const newLogsCount = selectedAccount.logs - quantity
      
      // Update main document
      const mainDocRef = doc(db, 'uploads', selectedAccount.id)
      await updateDoc(mainDocRef, { 
        logs: newLogsCount,
        bulkLogs: remainingBulkLogs
      })
      
      // Show purchased credentials
      setPurchasedCredentials(soldCredentials)
      setPurchaseSuccess(true)
      
      // Update local state
      setFirestoreAccounts(prev => 
        prev.map(acc => 
          acc.id === selectedAccount.id 
            ? { ...acc, logs: newLogsCount, bulkLogs: remainingBulkLogs }
            : acc
        )
      )
      
      console.log('✅ Purchase completed successfully')
    } catch (error) {
      console.error('❌ Purchase error:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  const totalPrice = selectedAccount ? selectedAccount.price * quantity : 0

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>
  }

  return (
    <>
      <div>
        <h2 className="text-base md:text-xl font-bold mb-3 md:mb-4 text-gray-900">
          {selectedPlatform === "all"
            ? "All Boosted Accounts"
            : `${getPlatformDisplayName(selectedPlatform)} Boosted Accounts`}
        </h2>
        
        {filteredAccounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No accounts available for this platform
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {filteredAccounts.map((account) => {
              const Icon = getPlatformIcon(account.platform)
              const gradient = getPlatformGradient(account.platform)
              const stockColor = getStockColor(account.logs || 0)
              
              return (
                <div
                  key={account.id}
                  className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
                >
                  <div className="flex items-center gap-2 md:gap-3 flex-1">
                    <div className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
                      gradient
                    )}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-xs md:text-sm">
                        {account.platform} | {account.followers.toLocaleString()}+ followers | {account.mailIncluded ? 'Mail Included' : 'Mail Not Included'}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3">
                    <div
                      className={cn(
                        "px-2 md:px-3 py-1 rounded-md text-xs font-semibold",
                        stockColor === "yellow" && "bg-yellow-100 text-yellow-800",
                        stockColor === "green" && "bg-green-100 text-green-800",
                        stockColor === "red" && "bg-red-100 text-red-800"
                      )}
                    >
                      {account.logs || 0}pcs
                    </div>
                    <div className="text-sm md:text-base font-semibold text-gray-900 min-w-[80px] md:min-w-[100px] text-right">
                      ₦{account.price.toLocaleString()}
                    </div>
                    <Button
                      onClick={() => handleBuyClick(account)}
                      className="min-w-[60px] md:min-w-[70px] rounded-full font-semibold text-xs md:text-sm h-8 md:h-9 bg-primary hover:bg-primary/90 text-white"
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Custom Modal */}
      {isModalOpen && selectedAccount && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => {
            if (!purchasing) {
              setIsModalOpen(false)
              setIsPurchaseMode(false)
              setPurchaseSuccess(false)
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg",
                    getPlatformGradient(selectedAccount.platform)
                  )}>
                    {(() => {
                      const Icon = getPlatformIcon(selectedAccount.platform)
                      return <Icon className="w-8 h-8 text-white" />
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedAccount.platform} Account
                    </h2>
                    <p className="text-gray-600 text-base mt-1">
                      {purchaseSuccess ? 'Purchase Complete!' : isPurchaseMode ? 'Select Quantity' : 'Complete account details'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!purchasing) {
                      setIsModalOpen(false)
                      setIsPurchaseMode(false)
                      setPurchaseSuccess(false)
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={purchasing}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Purchase Success View */}
              {purchaseSuccess && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-900 mb-2">Payment Successful!</h3>
                    <p className="text-green-700">You purchased {quantity} log(s) for ₦{totalPrice.toLocaleString()}</p>
                  </div>

                  {/* Show purchased credentials */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                    <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      Your Credentials ({purchasedCredentials.length} items)
                    </h3>
                    <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto space-y-2 border border-slate-300">
                      {purchasedCredentials.map((cred, index) => (
                        <div 
                          key={index} 
                          className="font-mono text-sm bg-green-50 px-3 py-2 rounded border border-green-200"
                        >
                          <div className="text-gray-700">
                            <span className="font-semibold">Username:</span> {cred.username}
                          </div>
                          <div className="text-gray-700">
                            <span className="font-semibold">Password:</span> {cred.password}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full h-12 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white"
                  >
                    Close
                  </Button>
                </div>
              )}

              {/* Purchase Mode - Quantity Selection */}
              {isPurchaseMode && !purchaseSuccess && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-bold text-gray-900 text-lg mb-4 text-center">Select Quantity</h3>
                    
                    <div className="flex items-center justify-center gap-6 mb-6">
                      <Button
                        onClick={() => handleQuantityChange(false)}
                        disabled={quantity <= 1 || purchasing}
                        className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-6 h-6" />
                      </Button>
                      
                      <div className="text-center">
                        <div className="text-5xl font-bold text-blue-900">{quantity}</div>
                        <div className="text-sm text-blue-700 mt-1">log(s)</div>
                      </div>
                      
                      <Button
                        onClick={() => handleQuantityChange(true)}
                        disabled={quantity >= availableLogs.length || purchasing}
                        className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>

                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price per log:</span>
                        <span className="font-semibold text-gray-900">₦{selectedAccount.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-semibold text-gray-900">{quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-semibold text-green-600">{availableLogs.length} logs</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between text-lg">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="font-bold text-green-600">₦{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setIsPurchaseMode(false)}
                      disabled={purchasing}
                      className="flex-1 h-12 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleCompletePurchase}
                      disabled={purchasing || quantity < 1}
                      className="flex-1 h-12 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
                    >
                      {purchasing ? 'Processing...' : `Pay ₦${totalPrice.toLocaleString()}`}
                    </Button>
                  </div>
                </div>
              )}

              {/* Initial View - Account Details */}
              {!isPurchaseMode && !purchaseSuccess && (
                <>
                  {/* Account Overview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-700 mb-2">
                        <Users className="w-5 h-5" />
                        <span className="text-sm font-semibold">Followers</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{selectedAccount.followers.toLocaleString()}+</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-sm font-semibold">Price per log</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">₦{selectedAccount.price.toLocaleString()}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center gap-2 text-purple-700 mb-2">
                        <Package className="w-5 h-5" />
                        <span className="text-sm font-semibold">Available Stock</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">{selectedAccount.logs || 0} pcs</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center gap-2 text-orange-700 mb-2">
                        <Mail className="w-5 h-5" />
                        <span className="text-sm font-semibold">Email Access</span>
                      </div>
                      <p className="text-lg font-bold text-orange-900">{selectedAccount.mailIncluded ? 'Included ✓' : 'Not Included'}</p>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg mb-4">Account Information</h3>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700">Status</p>
                        <p className="text-base font-medium text-gray-900 mt-1">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-sm font-semibold",
                            selectedAccount.status === "Available" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                          )}>
                            {selectedAccount.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700">Created At</p>
                        <p className="text-base text-gray-900 mt-1">{formatDate(selectedAccount.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Files */}
                  {selectedAccount.files && selectedAccount.files.length > 0 && (
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-5 border border-cyan-200">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        Attached Files ({selectedAccount.files.length})
                      </h3>
                      <div className="space-y-2">
                        {selectedAccount.files.map((file, index) => (
                          <div 
                            key={index}
                            className="bg-white px-3 py-2 rounded-lg text-sm text-gray-700 border border-cyan-200 hover:border-cyan-400 transition-colors"
                          >
                            📎 {file}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 h-12 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={handleProceedToPurchase}
                      disabled={selectedAccount.logs === 0}
                      className="flex-1 h-12 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg disabled:opacity-50"
                    >
                      Proceed to Purchase
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}