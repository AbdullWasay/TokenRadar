"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { Crown, Lock, Star, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface PremiumPopupProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
}

export default function PremiumPopup({ isOpen, onClose, feature = "this feature" }: PremiumPopupProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const handleUpgrade = () => {
    onClose()
    router.push('/profile#subscription')
  }

  const premiumFeatures = [
    { icon: Zap, text: "Real-time token alerts" },
    { icon: Star, text: "Advanced watchlist features" },
    { icon: Crown, text: "Premium dashboard analytics" },
    { icon: Lock, text: "Email & Telegram notifications" }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900">
            <Crown className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Premium Feature Required
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Upgrade to Premium to access {feature} and unlock all advanced features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Premium Features List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Premium includes:
            </h4>
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                  <feature.icon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 dark:border-yellow-800 dark:from-yellow-950 dark:to-orange-950">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                2 SOL/month
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgrade}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook to manage premium popup
export function usePremiumPopup() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [feature, setFeature] = useState("")

  const showPremiumPopup = (featureName: string) => {
    if (user?.subscriptionStatus !== 'premium') {
      setFeature(featureName)
      setIsOpen(true)
      return true // Blocked
    }
    return false // Not blocked
  }

  const closePremiumPopup = () => {
    setIsOpen(false)
    setFeature("")
  }

  return {
    isOpen,
    feature,
    showPremiumPopup,
    closePremiumPopup
  }
}
