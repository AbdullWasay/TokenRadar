"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2, Clock, RefreshCw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import type { BondEvent } from "@/lib/types"

// Mock data for bond events
const bondEvents: BondEvent[] = [
  {
    id: "1",
    tokenId: "1",
    tokenName: "NewCoin",
    tokenSymbol: "NEW",
    bondedPercentage: 100,
    timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    tokenId: "2",
    tokenName: "FreshToken",
    tokenSymbol: "FRSH",
    bondedPercentage: 95,
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    tokenId: "3",
    tokenName: "BondCoin",
    tokenSymbol: "BOND",
    bondedPercentage: 90,
    timestamp: Date.now() - 1000 * 60 * 45, // 45 minutes ago
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    tokenId: "4",
    tokenName: "AlmostCoin",
    tokenSymbol: "ALMT",
    bondedPercentage: 85,
    timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function BondAlerts() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getBondStatusBadge = (percentage: number) => {
    if (percentage === 100) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Bonded
        </Badge>
      )
    } else if (percentage >= 90) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Almost Bonded
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <Clock className="h-3 w-3 mr-1" />
          Bonding
        </Badge>
      )
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Bond Alerts</CardTitle>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRefresh}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {bondEvents.map((event) => (
            <div key={event.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.tokenName}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <Link href={`/token/${event.tokenId}`} className="font-medium hover:underline">
                      {event.tokenName}
                    </Link>
                    <div className="text-sm text-muted-foreground">${event.tokenSymbol}</div>
                    <div className="flex items-center mt-1">
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getBondStatusBadge(event.bondedPercentage)}
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    <Bell className="h-3 w-3 mr-1" />
                    Set Alert
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/alerts">View all alerts</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
