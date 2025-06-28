"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function usePremiumCheck(featureName: string) {
  const { user } = useAuth()
  const router = useRouter()
  const [showPopup, setShowPopup] = useState(false)

  const isPremium = user?.subscriptionStatus === 'premium'

  const checkPremiumAccess = () => {
    if (!isPremium) {
      setShowPopup(true)
      return false
    }
    return true
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  const redirectToUpgrade = () => {
    setShowPopup(false)
    router.push('/profile#subscription')
  }

  return {
    isPremium,
    showPopup,
    checkPremiumAccess,
    closePopup,
    redirectToUpgrade,
    featureName
  }
}
