"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useWallet } from "@/lib/wallet-context"
import { AlertCircle, ArrowRight, CheckCircle2, Copy, ExternalLink, Loader2, Wallet } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SolanaPaymentPage() {
  const router = useRouter()
  const { wallet, connectWallet } = useWallet()
  const [paymentStatus, setPaymentStatus] = useState<"initial" | "processing" | "success" | "error">("initial")
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes in seconds

  // Mock recipient address
  const recipientAddress = "8ZUgCKnD9qzo4zAQL81scFsETgbxNQbeuDZ8nnJy4TU7"

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (paymentStatus === "processing") {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [paymentStatus])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(recipientAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartPayment = async () => {
    if (!wallet.connected) {
      await connectWallet()
      return
    }

    setPaymentStatus("processing")

    // In a real implementation, you would:
    // 1. Create a Solana transaction
    // 2. Request user to sign it
    // 3. Send the transaction
    // 4. Monitor for confirmation

    // For demo purposes, we'll simulate a successful payment after 5 seconds
    setTimeout(() => {
      setPaymentStatus("success")
    }, 5000)
  }

  const handleManualConfirm = () => {
    // In a real app, you would verify the transaction on the blockchain
    setPaymentStatus("success")
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="border-green-500">
            <CardContent className="pt-6 px-6 pb-8 flex flex-col items-center text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Your Pro subscription has been activated. Thank you for your payment of 2 SOL.
              </p>
              <div className="w-full space-y-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => router.push("/subscribe/confirmation")}
                >
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="https://explorer.solana.com" target="_blank" rel="noopener noreferrer">
                    View Transaction
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600 dark:text-gray-400">You're subscribing to the Pro Plan at 2 SOL/month</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Pay with Solana</h2>

                {!wallet.connected ? (
                  <div className="text-center py-8">
                    <Wallet className="h-16 w-16 mx-auto text-purple-500 mb-4" />
                    <h3 className="text-lg font-medium mb-4">Connect your Solana wallet to continue</h3>
                    <Button onClick={connectWallet} className="bg-purple-600 hover:bg-purple-700">
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </Button>
                  </div>
                ) : paymentStatus === "initial" ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Wallet className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">
                            Connected: {wallet.publicKey?.slice(0, 6)}...{wallet.publicKey?.slice(-4)}
                          </h3>
                          <div className="mt-1 text-sm text-purple-700 dark:text-purple-400">
                            <p>Balance: {wallet.balance?.toFixed(2)} SOL</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="mb-4">Click the button below to send 2 SOL to complete your subscription</p>
                      <Button
                        onClick={handleStartPayment}
                        className="bg-purple-600 hover:bg-purple-700"
                        disabled={!wallet.connected}
                      >
                        Pay 2 SOL Now
                      </Button>
                    </div>
                  </div>
                ) : paymentStatus === "processing" ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Payment in progress</h3>
                          <div className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                            <p>Please complete the payment in your wallet</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Send exactly</span>
                        <span className="font-bold">2 SOL</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">To address</span>
                        <div className="flex items-center">
                          <span className="text-xs md:text-sm font-mono mr-2 truncate max-w-[120px] md:max-w-[200px]">
                            {recipientAddress}
                          </span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
                            {copied ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Time remaining: {formatTime(countdown)}
                        </p>
                        <Button variant="outline" size="sm" onClick={handleManualConfirm} className="text-xs">
                          I've sent the payment
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Important</h3>
                          <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                            <p>
                              Send exactly 2 SOL to the address above. Sending a different amount may result in payment
                              failure.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Pro Plan</span>
                      <span className="font-medium">2 SOL</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Monthly subscription</div>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal</span>
                    <span>2 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Network Fee</span>
                    <span>~0.000005 SOL</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>2 SOL</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4">
                    <span>Billed monthly</span>
                    <span>Cancel anytime</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Accepted wallets</div>
                  <div className="flex justify-center gap-2">
                    <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                      <Image src="/placeholder.svg?height=24&width=24" alt="Phantom" width={24} height={24} />
                    </div>
                    <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                      <Image src="/placeholder.svg?height=24&width=24" alt="Solflare" width={24} height={24} />
                    </div>
                    <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                      <Image src="/placeholder.svg?height=24&width=24" alt="Backpack" width={24} height={24} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
