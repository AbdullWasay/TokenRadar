"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Clock, RefreshCw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import BondStatus from "@/components/bond-status"

// Mock data for newly bonded tokens
const newlyBondedTokens = [
  {
    id: "1",
    name: "NewCoin",
    symbol: "NEW",
    price: 0.00012345,
    change24h: 15.7,
    marketCap: 1250000,
    volume24h: 450000,
    launchTime: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    bondedPercentage: 100,
    bondedTime: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "FreshToken",
    symbol: "FRSH",
    price: 0.00000789,
    change24h: 8.3,
    marketCap: 980000,
    volume24h: 320000,
    launchTime: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    bondedPercentage: 100,
    bondedTime: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "BondCoin",
    symbol: "BOND",
    price: 0.00002156,
    change24h: 12.1,
    marketCap: 1750000,
    volume24h: 580000,
    launchTime: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    bondedPercentage: 100,
    bondedTime: Date.now() - 1000 * 60 * 45, // 45 minutes ago
    image: "/placeholder.svg?height=40&width=40",
  },
]

// Mock data for almost bonded tokens
const almostBondedTokens = [
  {
    id: "4",
    name: "AlmostCoin",
    symbol: "ALMT",
    price: 0.00000456,
    change24h: 5.2,
    marketCap: 750000,
    volume24h: 250000,
    launchTime: Date.now() - 1000 * 60 * 60 * 1, // 1 hour ago
    bondedPercentage: 95,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "SoonToken",
    symbol: "SOON",
    price: 0.00000123,
    change24h: 3.8,
    marketCap: 520000,
    volume24h: 180000,
    launchTime: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    bondedPercentage: 92,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function NewlyBondedTokens() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"bonded" | "almost">("bonded")

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          {activeTab === "bonded" ? "Newly Bonded Tokens" : "Almost Bonded Tokens"}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-input bg-background p-1">
            <Button
              variant={activeTab === "bonded" ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setActiveTab("bonded")}
            >
              Bonded
            </Button>
            <Button
              variant={activeTab === "almost" ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setActiveTab("almost")}
            >
              Almost Bonded
            </Button>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {(activeTab === "bonded" ? newlyBondedTokens : almostBondedTokens).map((token) => (
            <div key={token.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Image
                    src={token.image || "/placeholder.svg"}
                    alt={token.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <Link href={`/token/${token.id}`} className="font-medium hover:underline">
                      {token.name}
                    </Link>
                    <div className="text-sm text-muted-foreground">${token.symbol}</div>
                    <div className="flex items-center mt-1">
                      <div className="text-xs text-muted-foreground mr-2">
                        <span className="font-medium text-foreground">${token.price.toFixed(8)}</span>
                      </div>
                      <div className={`text-xs ${token.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {token.change24h >= 0 ? "+" : ""}
                        {token.change24h}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <BondStatus bondedPercentage={token.bondedPercentage} size="sm" showLabel={false} />
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    {activeTab === "bonded" ? (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Bonded {formatDistanceToNow(token.bondedTime, { addSuffix: true })}</span>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="h-6 text-xs">
                        <Bell className="h-3 w-3 mr-1" />
                        Alert me
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/all-tokens">View all tokens</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
