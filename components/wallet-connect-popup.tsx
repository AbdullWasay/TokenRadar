"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWallet } from "@/lib/wallet-context"
import { Wallet, Crown, AlertTriangle } from "lucide-react"

interface WalletConnectPopupProps {
  isOpen: boolean
  onClose: () => void
  onWalletConnected?: () => void
}

export default function WalletConnectPopup({ isOpen, onClose, onWalletConnected }: WalletConnectPopupProps) {
  const { connectWallet, wallet } = useWallet()

  const handleConnectWallet = async () => {
    try {
      await connectWallet()
      if (onWalletConnected) {
        onWalletConnected()
      }
      onClose()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900">
            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Wallet Connection Required
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            You need to connect your Solana wallet to upgrade to premium and make payments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Premium Benefits */}
          <div className="rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 dark:border-yellow-800 dark:from-yellow-950 dark:to-orange-950">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Premium Benefits
              </span>
            </div>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Real-time token alerts</li>
              <li>• Advanced dashboard analytics</li>
              <li>• Email & Telegram notifications</li>
              <li>• Premium watchlist features</li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              2 SOL/month
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cancel anytime
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Connect Your Wallet
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Connect your Solana wallet to securely process your premium subscription payment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnectWallet}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
