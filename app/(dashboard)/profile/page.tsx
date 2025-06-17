"use client"

import EditProfileModal from "@/components/edit-profile-modal"
import SubscriptionPayment from "@/components/subscription-payment"
import TokenTable from "@/components/token-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { Calendar, Crown, Edit, Mail, Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const userTrades = [
  {
    id: "1",
    name: "Greed3",
    symbol: "Greed3",
    marketCap: "$71,867",
    created: "02/20/2023",
    bonded: "02/20/2023",
    fiveMin: "-0.31",
    oneHour: "-1.78",
    sixHour: "-0.31",
    twentyFourHour: "0.3",
    sevenDay: "39.27",
    chart: "up",
  },
  {
    id: "2",
    name: "Greed3",
    symbol: "Greed3",
    marketCap: "$71,867",
    created: "02/20/2023",
    bonded: "02/20/2023",
    fiveMin: "-0.31",
    oneHour: "-1.78",
    sixHour: "-0.31",
    twentyFourHour: "0.3",
    sevenDay: "39.27",
    chart: "down",
  },
  {
    id: "3",
    name: "Greed3",
    symbol: "Greed3",
    marketCap: "$71,867",
    created: "02/20/2023",
    bonded: "02/20/2023",
    fiveMin: "-0.31",
    oneHour: "-1.78",
    sixHour: "-0.31",
    twentyFourHour: "0.3",
    sevenDay: "39.27",
    chart: "down",
  },
]

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
  const { user } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(user?.subscriptionStatus || "free")

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-medium">Profile Setting</h2>
            <Button size="sm" className="bg-purple-700 hover:bg-purple-800" onClick={() => setIsEditModalOpen(true)}>
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
          </div>

          <div className="flex items-center mt-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                {user?.name ? (
                  <span className="text-2xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <Image
                    src="/placeholder.svg"
                    alt="User"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            <div className="ml-6 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-medium">{user?.name || 'User'}</h3>
                {user?.subscriptionStatus === 'premium' && (
                  <Crown className="w-5 h-5 text-yellow-500" />
                )}
              </div>

              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="capitalize font-medium text-purple-600 dark:text-purple-400">
                    {user?.subscriptionStatus || 'free'} Plan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-medium mb-4">My Trades</h2>
        <Card>
          <CardContent className="p-0">
            <TokenTable tokens={userTrades} />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = user?.subscriptionStatus === plan.id
            const isUpgrade = plan.id === 'premium' && user?.subscriptionStatus === 'free'

            return (
              <Card
                key={plan.id}
                className={`${plan.isPopular ? "border-purple-700" : "border-gray-200"} ${
                  isCurrentPlan ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950" : ""
                } relative`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-purple-700 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute top-0 left-0 bg-green-600 text-white px-3 py-1 text-xs font-bold rounded-br-lg">
                    CURRENT PLAN
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">{plan.name}</h3>
                    {plan.id === 'premium' && <Crown className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="#6D28D9"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2">
                    <div className="text-center">
                      <span className="text-2xl font-bold">{plan.price}</span>
                    </div>
                    <Button
                      className={`w-full ${
                        isCurrentPlan
                          ? "bg-green-600 hover:bg-green-700"
                          : plan.isPopular
                          ? "bg-purple-700 hover:bg-purple-800"
                          : "bg-purple-700 hover:bg-purple-800"
                      }`}
                      onClick={() => {
                        if (plan.id === 'premium' && user?.subscriptionStatus !== 'premium') {
                          setIsPaymentModalOpen(true)
                        } else {
                          setSelectedPlan(plan.id)
                        }
                      }}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? 'Current Plan' : plan.id === 'premium' ? 'Upgrade with SOL' : 'Current Plan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {user?.subscriptionStatus === 'premium' && user?.subscriptionExpiry && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Crown className="w-5 h-5" />
                <span className="font-medium">Premium Subscription</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Your premium subscription expires on {new Date(user.subscriptionExpiry).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={{
          name: user?.name || '',
          email: user?.email || '',
          image: "/placeholder.svg?height=100&width=100"
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
    </div>
  )
}
