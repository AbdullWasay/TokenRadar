"use client"

import EditProfileModal from "@/components/edit-profile-modal"
import PremiumGuard from "@/components/premium-guard"
import SubscriptionPayment from "@/components/subscription-payment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { Copy, Crown, Edit } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"


const subscriptionPlans = [
  {
    id: "free",
    name: "Free Plan",
    description: "For Individual Users",
    price: "Free",
    features: [
      "Basic token tracking",
      "Limited market data",
      "Community support",
      "Basic analytics",
    ],
    isPopular: false,
  },
  {
    id: "premium",
    name: "Premium Plan",
    description: "For Serious Traders",
    price: "2 SOL/month",
    features: [
      "Advanced token analytics",
      "Real-time price alerts",
      "Priority customer support",
      "Unlimited token tracking",
      "Advanced market insights",
      "Portfolio management tools",
    ],
    isPopular: true,
  },
]

export default function ProfilePage() {
  const { user, checkAuth } = useAuth()
  const { wallet } = useWallet()
  const { toast } = useToast()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isWalletConnectPopupOpen, setIsWalletConnectPopupOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(user?.subscriptionStatus || "free")
  const [copied, setCopied] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loadingWishlist, setLoadingWishlist] = useState(true)
  const [profileImage, setProfileImage] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)

  // Load profile image from user data when component mounts
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage)
    }
  }, [user])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    bondedTokenAlerts: true,
    marketCapAlerts: false,
  })

  const [telegramNotifications, setTelegramNotifications] = useState({
    bondedTokenAlerts: true,
    marketCapAlerts: false,
  })

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      setLoadingWishlist(true)
      const authToken = localStorage.getItem('auth_token')

      if (!authToken) {
        setWishlistItems([])
        setLoadingWishlist(false)
        return
      }

      const response = await fetch('/api/wishlist', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Cache-Control': 'no-cache',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setWishlistItems(data.data)
        } else {
          setWishlistItems([])
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      setWishlistItems([])
    } finally {
      setLoadingWishlist(false)
    }
  }

  // Remove item from wishlist
  const removeFromWishlist = async (itemId: string) => {
    try {
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) return

      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId))
        toast({
          title: "Success",
          description: "Token removed from wishlist",
        })
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast({
        title: "Error",
        description: "Failed to remove token from wishlist",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)

      // Upload to Cloudinary via API
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setProfileImage(data.url)

      // Update profile in database
      try {
        const updateResponse = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: user?.name || '',
            email: user?.email || '',
            profileImage: data.url
          })
        })

        if (updateResponse.ok) {
          // Refresh user data in auth context
          await checkAuth()
        }
      } catch (updateError) {
        console.error('Error updating profile:', updateError)
      }

      toast({
        title: "Success!",
        description: "Profile image updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Profile Settings</h2>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <Image
                src={profileImage || "/placeholder.svg?height=80&width=80"}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </div>

            <div className="ml-6 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{user?.name || 'Abdul Wasay'}</h3>
                {user?.subscriptionStatus === 'premium' && (
                  <Crown className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <p className="text-sm text-gray-400 capitalize">
                {user?.subscriptionStatus === 'premium' ? 'Premium Member' : 'Free Member'}
              </p>
              <div className="mt-3">
                <p className="text-sm text-gray-400 mb-1">Current Wallet Address:</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-mono bg-gray-800 text-white px-2 sm:px-3 py-2 rounded border border-gray-600 flex-1 truncate">
                    {wallet?.publicKey ?
                      `${wallet.publicKey.slice(0, 6)}...${wallet.publicKey.slice(-6)}` :
                      'GhA5B9ZT...8nnJy4TU7'
                    }
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-400 border-green-400 hover:bg-green-400/10"
                    onClick={() => copyToClipboard(wallet?.publicKey || 'GhA5B9ZTBcKnD9qzo4zAQL81scFsETgbxNQbeuDZ8nnJy4TU7')}
                  >
                    <Copy size={14} className="mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist */}
      <Card>
        <CardHeader>
          <CardTitle>My Wishlist</CardTitle>
          <p className="text-sm text-gray-600">
            Tokens you've added to your wishlist
          </p>
        </CardHeader>
        <CardContent>
          {loadingWishlist ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading wishlist...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your wishlist is empty.</p>
              <p className="text-sm text-gray-400 mt-1">
                Add tokens from the overview page to track them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {wishlistItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-200"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="font-semibold text-lg mb-1">{item.tokenSymbol}</div>
                        <div className="text-sm text-gray-600 mb-2 line-clamp-2">{item.tokenName}</div>
                        <div className="text-xs text-gray-400 mb-3">
                          Added: {new Date(item.addedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1 mr-2">
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Notifications - Premium Feature */}
      <PremiumGuard feature="email notifications">
        <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Email Notifications</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ON/OFF</span>
              <Switch
                checked={emailNotifications.bondedTokenAlerts || emailNotifications.marketCapAlerts}
                onCheckedChange={(checked) => {
                  setEmailNotifications({
                    bondedTokenAlerts: checked,
                    marketCapAlerts: checked
                  })
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Bonded Token Alerts</span>
            </div>
            <Switch
              checked={emailNotifications.bondedTokenAlerts}
              onCheckedChange={(checked) =>
                setEmailNotifications(prev => ({ ...prev, bondedTokenAlerts: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Market Cap Alerts</span>
            </div>
            <Switch
              checked={emailNotifications.marketCapAlerts}
              onCheckedChange={(checked) =>
                setEmailNotifications(prev => ({ ...prev, marketCapAlerts: checked }))
              }
            />
          </div>
        </CardContent>
        </Card>
      </PremiumGuard>

      {/* Telegram Notifications - Premium Feature */}
      <PremiumGuard feature="telegram notifications">
        <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Telegram Notifications</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ON/OFF</span>
              <Switch
                checked={telegramNotifications.bondedTokenAlerts || telegramNotifications.marketCapAlerts}
                onCheckedChange={(checked) => {
                  setTelegramNotifications({
                    bondedTokenAlerts: checked,
                    marketCapAlerts: checked
                  })
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Bonded Token Alerts</span>
            </div>
            <Switch
              checked={telegramNotifications.bondedTokenAlerts}
              onCheckedChange={(checked) =>
                setTelegramNotifications(prev => ({ ...prev, bondedTokenAlerts: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Market Cap Alerts</span>
            </div>
            <Switch
              checked={telegramNotifications.marketCapAlerts}
              onCheckedChange={(checked) =>
                setTelegramNotifications(prev => ({ ...prev, marketCapAlerts: checked }))
              }
            />
          </div>
        </CardContent>
        </Card>
      </PremiumGuard>

      {/* Update Subscription - Only show for premium members */}
      {user?.subscriptionStatus === 'premium' && (
        <Card>
          <CardHeader>
            <CardTitle>Update Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-medium mb-4">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <Card className={`relative ${user?.subscriptionStatus === 'free' || !user?.subscriptionStatus ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''}`}>
            {(user?.subscriptionStatus === 'free' || !user?.subscriptionStatus) && (
              <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-br-lg">
                CURRENT PLAN
              </div>
            )}
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Free Plan</h3>
              <p className="text-sm text-gray-600 mb-4">For Individual Users</p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm">5 free responses per month</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm">Limited access to the AI writing assistant</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm">Limited to basic blog, Professional and Casual</span>
                </li>
              </ul>

              <div className="text-center mb-4">
                <span className="text-2xl font-bold">Free</span>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={user?.subscriptionStatus === 'free' || !user?.subscriptionStatus}
              >
                {(user?.subscriptionStatus === 'free' || !user?.subscriptionStatus) ? 'Current Plan' : 'Get Started Now'}
              </Button>
            </CardContent>
          </Card>

          {/* Member Plan */}
          <Card className={`relative border-blue-600 ${user?.subscriptionStatus === 'premium' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''}`}>
            {user?.subscriptionStatus === 'premium' ? (
              <div className="absolute top-0 left-0 bg-green-600 text-white px-3 py-1 text-xs font-bold rounded-br-lg">
                CURRENT PLAN
              </div>
            ) : (
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                POPULAR
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Member Plan</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Access to balance on their wallet and unlimited investment decisions</p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm">Ability to see analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm">Watch bonded tokens alerts to make investment decisions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm">Be notified instantly and beat the rush</span>
                </li>
              </ul>

              <div className="text-center mb-4">
                <span className="text-2xl font-bold">2 SOL/month</span>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (!wallet?.connected) {
                    setIsWalletConnectPopupOpen(true)
                    return
                  }
                  setIsPaymentModalOpen(true)
                }}
                disabled={user?.subscriptionStatus === 'premium'}
              >
                {user?.subscriptionStatus === 'premium' ? 'Current Plan' : 'Subscribe'}
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdate={(updatedProfile) => {
          if (updatedProfile.profileImage) {
            setProfileImage(updatedProfile.profileImage)
          }
        }}
        profile={{
          name: user?.name || '',
          email: user?.email || '',
          image: profileImage || user?.profileImage || "/placeholder.svg?height=100&width=100"
        }}
      />

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
          </DialogHeader>
          <SubscriptionPayment
            onSuccess={() => {
              setIsPaymentModalOpen(false)
              // The user data will be refreshed automatically by the payment component
            }}
            onCancel={() => setIsPaymentModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Wallet Connect Popup */}
      {isWalletConnectPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900">
                <svg className="h-8 w-8 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Wallet Connection Required</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You need to connect your Solana wallet to upgrade to premium and make payments.
              </p>
              <div className="rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 dark:border-yellow-800 dark:from-yellow-950 dark:to-orange-950 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    2 SOL/month
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Cancel anytime
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsWalletConnectPopupOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await wallet?.connect()
                      setIsWalletConnectPopupOpen(false)
                      setIsPaymentModalOpen(true)
                    } catch (error) {
                      console.error('Failed to connect wallet:', error)
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
