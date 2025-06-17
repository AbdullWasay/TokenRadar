"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Bell, ExternalLink, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import TokenPriceChart from "@/components/token-price-chart"
import TokenStats from "@/components/token-stats"
import TokenTransactions from "@/components/token-transactions"
import { useState, useEffect } from "react"
import type { TokenDetailData } from "@/lib/types"

export default function TokenDetail() {
  const params = useParams()
  const { id } = params

  const [token, setToken] = useState<TokenDetailData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with an actual API call
    // For now, we'll simulate loading with a timeout
    const timeout = setTimeout(() => {
      setToken({
        id: id as string,
        name: "PEPE",
        symbol: "PEPE",
        price: 0.00000123,
        marketCap: 1200000,
        change24h: 12.5,
        volume24h: 500000,
        launchTime: new Date().getTime() - 3600000,
        bondedPercentage: 100,
        image: "/placeholder.svg?height=64&width=64",
        description: "PEPE is a memecoin based on the popular Pepe the Frog internet meme.",
        website: "https://pepe.io",
        twitter: "https://twitter.com/pepe",
        telegram: "https://t.me/pepe",
        contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
        holders: 12500,
        totalSupply: "100,000,000,000,000",
        pairAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        transactions: [
          {
            id: "tx1",
            type: "buy",
            amount: "1,000,000 PEPE",
            value: "$120.50",
            time: new Date().getTime() - 300000,
            address: "0x1234...5678",
          },
          {
            id: "tx2",
            type: "sell",
            amount: "500,000 PEPE",
            value: "$58.25",
            time: new Date().getTime() - 600000,
            address: "0x8765...4321",
          },
          {
            id: "tx3",
            type: "buy",
            amount: "2,500,000 PEPE",
            value: "$302.75",
            time: new Date().getTime() - 900000,
            address: "0x2468...1357",
          },
        ],
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Token not found</h3>
          <Link href="/dashboard" className="text-primary hover:underline">
            Return to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Image
              src={token.image || "/placeholder.svg"}
              alt={token.name}
              width={64}
              height={64}
              className="rounded-full mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                {token.name}
                <span className="text-gray-500 dark:text-gray-400 ml-2">({token.symbol})</span>
              </h1>
              <div className="flex items-center mt-1">
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded ${
                    token.change24h >= 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {token.change24h >= 0 ? "+" : ""}
                  {token.change24h}%
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">24h</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Bell size={16} className="mr-1" />
              Alert
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share2 size={16} className="mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ExternalLink size={16} className="mr-1" />
              DexScreener
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Price Chart</h2>
                <div className="text-right">
                  <div className="text-2xl font-bold">${token.price.toFixed(8)}</div>
                  <div className={`text-sm ${token.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {token.change24h >= 0 ? "+" : ""}
                    {token.change24h}% (24h)
                  </div>
                </div>
              </div>
              <TokenPriceChart />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="transactions">
                <TabsList className="mb-4">
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="holders">Holders</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                  <TokenTransactions transactions={token.transactions} />
                </TabsContent>
                <TabsContent value="holders">
                  <div className="text-center py-8">
                    <h3 className="text-xl font-medium mb-2">Holders data coming soon</h3>
                    <p className="text-gray-500 dark:text-gray-400">This feature is under development</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <TokenStats token={token} />
        </div>
      </div>
    </div>
  )
}
