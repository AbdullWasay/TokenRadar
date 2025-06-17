"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, Clock, Filter, Flame } from "lucide-react"
import TokenTable from "@/components/token-table"
import TrendingTokenCard from "@/components/trending-token-card"

// Mock data
const trendingTokens = [
  {
    id: "1",
    name: "Pepe",
    symbol: "PEPE",
    marketCap: "$1,234,567",
    created: "1 day ago",
    bonded: "1 day ago",
    fiveMin: "12.5",
    oneHour: "8.3",
    sixHour: "15.2",
    twentyFourHour: "32.7",
    sevenDay: "45.9",
    chart: "up",
    image: "/placeholder.svg?height=40&width=40",
    rank: 1,
    mentions: 1250,
    socialScore: 98,
  },
  {
    id: "2",
    name: "Floki",
    symbol: "FLOKI",
    marketCap: "$987,654",
    created: "2 days ago",
    bonded: "2 days ago",
    fiveMin: "8.1",
    oneHour: "5.2",
    sixHour: "10.3",
    twentyFourHour: "25.6",
    sevenDay: "38.2",
    chart: "up",
    image: "/placeholder.svg?height=40&width=40",
    rank: 2,
    mentions: 980,
    socialScore: 92,
  },
  {
    id: "3",
    name: "Wojak",
    symbol: "WOJ",
    marketCap: "$567,890",
    created: "3 days ago",
    bonded: "3 days ago",
    fiveMin: "6.7",
    oneHour: "4.5",
    sixHour: "9.8",
    twentyFourHour: "18.3",
    sevenDay: "29.5",
    chart: "up",
    image: "/placeholder.svg?height=40&width=40",
    rank: 3,
    mentions: 820,
    socialScore: 87,
  },
  {
    id: "4",
    name: "Bonk",
    symbol: "BONK",
    marketCap: "$345,678",
    created: "5 days ago",
    bonded: "5 days ago",
    fiveMin: "5.2",
    oneHour: "3.8",
    sixHour: "7.5",
    twentyFourHour: "15.2",
    sevenDay: "22.8",
    chart: "up",
    image: "/placeholder.svg?height=40&width=40",
    rank: 4,
    mentions: 750,
    socialScore: 82,
  },
  {
    id: "5",
    name: "Mog",
    symbol: "MOG",
    marketCap: "$234,567",
    created: "7 days ago",
    bonded: "7 days ago",
    fiveMin: "4.3",
    oneHour: "2.9",
    sixHour: "6.1",
    twentyFourHour: "12.7",
    sevenDay: "18.5",
    chart: "up",
    image: "/placeholder.svg?height=40&width=40",
    rank: 5,
    mentions: 680,
    socialScore: 78,
  },
]

const recentlyLaunched = [
  {
    id: "6",
    name: "NewCoin",
    symbol: "NEW",
    marketCap: "$123,456",
    created: "2 hours ago",
    bonded: "2 hours ago",
    fiveMin: "25.3",
    oneHour: "18.7",
    sixHour: "25.3",
    twentyFourHour: "25.3",
    sevenDay: "25.3",
    chart: "up",
  },
  {
    id: "7",
    name: "FreshToken",
    symbol: "FRSH",
    marketCap: "$98,765",
    created: "5 hours ago",
    bonded: "5 hours ago",
    fiveMin: "18.2",
    oneHour: "12.5",
    sixHour: "18.2",
    twentyFourHour: "18.2",
    sevenDay: "18.2",
    chart: "up",
  },
  {
    id: "8",
    name: "JustLaunched",
    symbol: "JLCH",
    marketCap: "$76,543",
    created: "8 hours ago",
    bonded: "8 hours ago",
    fiveMin: "15.7",
    oneHour: "10.2",
    sixHour: "15.7",
    twentyFourHour: "15.7",
    sevenDay: "15.7",
    chart: "up",
  },
]

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState("trending")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trending</h1>
          <p className="text-gray-500 dark:text-gray-400">Discover the hottest tokens in the market</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Clock className="h-4 w-4" />
            <span>24h</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="trending">
            <Flame className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="gainers">
            <ArrowUp className="h-4 w-4 mr-2" />
            Top Gainers
          </TabsTrigger>
          <TabsTrigger value="new">
            <Clock className="h-4 w-4 mr-2" />
            Recently Launched
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "trending" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {trendingTokens.slice(0, 3).map((token, index) => (
              <TrendingTokenCard key={token.id} token={token} rank={index + 1} />
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Trending Tokens</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TokenTable tokens={trendingTokens} />
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "gainers" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Gainers (24h)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TokenTable
              tokens={trendingTokens.sort(
                (a, b) => Number.parseFloat(b.twentyFourHour) - Number.parseFloat(a.twentyFourHour),
              )}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "new" && (
        <>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Recently Launched</CardTitle>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Last 24 hours</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TokenTable tokens={recentlyLaunched} />
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </>
      )}
    </div>
  )
}
