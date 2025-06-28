"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWallet } from "@/lib/wallet-context"
import { CheckCircle2, ChevronRight, Clock, Download } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ConfirmationPage() {
  const { wallet } = useWallet()
  const [transactionId, setTransactionId] = useState<string>("")

  useEffect(() => {
    // Generate a mock transaction ID
    setTransactionId(`${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="border-green-500">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Subscription Activated!</h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Thank you for subscribing to the Pro Plan. Your payment has been processed successfully.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Subscription Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan</span>
                  <span className="font-medium">Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="font-medium">2 SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Billing Cycle</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Next Billing Date</span>
                  <span className="font-medium">June 9, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                  <span className="font-medium font-mono text-xs">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Wallet</span>
                  <span className="font-medium font-mono text-xs">
                    {wallet.publicKey
                      ? `${wallet.publicKey.slice(0, 6)}...${wallet.publicKey.slice(-4)}`
                      : "Not connected"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">Your subscription is now active</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    You now have full access to all Pro features. Your subscription will automatically renew on June 9,
                    2025.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
