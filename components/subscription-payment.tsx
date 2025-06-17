"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth-context'
import { SUBSCRIPTION_PRICE_SOL } from '@/lib/solana-config'
import { createSubscriptionPayment, formatSOL, hasInsufficientBalance } from '@/lib/solana-utils'
import { useWallet } from '@/lib/wallet-context'
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { AlertTriangle, CheckCircle, Crown, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface SubscriptionPaymentProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function SubscriptionPayment({ onSuccess, onCancel }: SubscriptionPaymentProps) {
  const { wallet, refreshBalance } = useWallet()
  const { user, checkAuth } = useAuth()
  const { sendTransaction } = useSolanaWallet()
  const { toast } = useToast()
  const [processing, setProcessing] = useState(false)
  const [checking, setChecking] = useState(false)

  const handlePayment = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
      })
      return
    }

    setProcessing(true)

    try {
      // Check if user has sufficient balance
      setChecking(true)
      const insufficientBalance = await hasInsufficientBalance(wallet.publicKey)
      setChecking(false)

      if (insufficientBalance) {
        toast({
          variant: "destructive",
          title: "Insufficient balance",
          description: `You need at least ${formatSOL(SUBSCRIPTION_PRICE_SOL + 0.001)} to complete this transaction.`,
        })
        return
      }

      // Create and send payment transaction
      const result = await createSubscriptionPayment(
        new PublicKey(wallet.publicKey),
        sendTransaction
      )

      if (result.success && result.signature) {
        // Verify transaction with backend
        const response = await fetch('/api/subscription/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({
            transactionSignature: result.signature,
            walletAddress: wallet.publicKey,
          }),
        })

        const data = await response.json()

        if (data.success) {
          // Refresh user data and wallet balance
          await Promise.all([
            checkAuth(),
            refreshBalance()
          ])

          toast({
            title: "Payment successful!",
            description: "Your premium subscription has been activated.",
          })

          onSuccess?.()
        } else {
          throw new Error(data.message || 'Payment verification failed')
        }
      } else {
        throw new Error(result.error || 'Payment transaction failed')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error.message || "There was an error processing your payment. Please try again.",
      })
    } finally {
      setProcessing(false)
    }
  }

  const isCurrentlyPremium = user?.subscriptionStatus === 'premium'

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          Premium Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Subscription Price:</span>
            <span className="font-bold text-lg">{formatSOL(SUBSCRIPTION_PRICE_SOL)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Duration:</span>
            <span className="font-medium">30 days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Your Balance:</span>
            <span className="font-medium">
              {wallet.connected ? formatSOL(wallet.balance || 0) : 'Not connected'}
            </span>
          </div>
        </div>

        {/* Wallet Status */}
        {!wallet.connected && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">Please connect your wallet to continue</span>
          </div>
        )}

        {/* Current Premium Status */}
        {isCurrentlyPremium && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-800">You already have an active premium subscription</span>
          </div>
        )}

        {/* Payment Button */}
        <div className="space-y-3">
          <Button
            onClick={handlePayment}
            disabled={!wallet.connected || processing || checking || isCurrentlyPremium}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : checking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Balance...
              </>
            ) : isCurrentlyPremium ? (
              'Already Premium'
            ) : (
              `Pay ${formatSOL(SUBSCRIPTION_PRICE_SOL)} SOL`
            )}
          </Button>

          {onCancel && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full"
              disabled={processing}
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Features List */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Premium Features:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Advanced token analytics
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Real-time price alerts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Priority customer support
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Unlimited token tracking
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
