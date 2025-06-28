"use client"

import Footer from "@/components/footer"
import Navbar from "@/components/landing-navbar"
import SubscriptionPayment from "@/components/subscription-payment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { BarChart3, Bell, Check, Crown, Shield, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SubscribePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    router.push('/dashboard')
  }

  const isPremium = user?.subscriptionStatus === 'premium'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get unlimited access to real-time token data, alerts, and advanced features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Free</span>
                  <span className="text-gray-600 dark:text-gray-400">/forever</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Basic token tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Limited market data</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Community support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Basic analytics</span>
                  </li>
                </ul>

                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white border-gray-900 hover:border-gray-800"
                  onClick={() => router.push('/signup')}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-500 rounded-xl shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>For serious traders</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">2 SOL</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                {isPremium && (
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    Current Plan
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Advanced token analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Real-time price alerts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Unlimited token tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Advanced market insights</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Portfolio management tools</span>
                  </li>
                </ul>

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleSubscribe}
                  disabled={isPremium}
                >
                  {isPremium ? 'Current Plan' : 'Upgrade to Premium'}
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Features Comparison */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get detailed insights with advanced charts, technical indicators, and market analysis tools.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Alerts</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Never miss important price movements with instant notifications and custom alert conditions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Priority Support</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get priority access to our support team and exclusive features for premium subscribers.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">How does the Solana payment work?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We use Solana blockchain for secure, fast, and low-cost payments. Simply connect your Solana wallet and pay 2 SOL for a monthly subscription.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">What wallets are supported?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We support all major Solana wallets including Phantom, Solflare, and any wallet compatible with the Solana Wallet Adapter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription>
              Complete your payment to unlock all premium features
            </DialogDescription>
          </DialogHeader>
          <SubscriptionPayment
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
