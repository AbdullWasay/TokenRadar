"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Crown, Lock } from "lucide-react"
import { ReactNode } from "react"

interface PremiumGuardProps {
  children: ReactNode
  fallback?: ReactNode
  showUpgradePrompt?: boolean
  feature?: string
}

export default function PremiumGuard({ 
  children, 
  fallback, 
  showUpgradePrompt = true,
  feature = "this feature"
}: PremiumGuardProps) {
  const { user } = useAuth()
  
  const isPremium = user?.subscriptionStatus === 'premium'
  
  if (isPremium) {
    return <>{children}</>
  }
  
  if (fallback) {
    return <>{fallback}</>
  }
  
  if (showUpgradePrompt) {
    return (
      <Card className="border-2 border-dashed border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <Crown className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Premium Feature
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upgrade to Premium to access {feature} and unlock all advanced features.
          </p>
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  return null
}

// Premium Icon Component
export function PremiumIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <Crown className={`text-yellow-500 ${className}`} />
  )
}

// Premium Badge Component
export function PremiumBadge({ text = "Premium" }: { text?: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
      <Crown className="w-3 h-3 mr-1" />
      {text}
    </span>
  )
}

// Premium Lock Overlay Component
export function PremiumLockOverlay({ feature }: { feature: string }) {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="text-center text-white">
        <Lock className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm font-medium">Premium Required</p>
        <p className="text-xs opacity-75">{feature}</p>
      </div>
    </div>
  )
}
