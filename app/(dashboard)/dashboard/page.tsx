"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart2, Bell, ChevronDown, Filter, Plus, RefreshCw, Zap } from "lucide-react"
import TokenCard from "@/components/token-card"
import NewTokensChart from "@/components/new-tokens-chart"
import TokenTable from "@/components/token-table"
import TransactionsTable from "@/components/transactions-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import WelcomeBanner from "@/components/welcome-banner"
import MarketOverview from "@/components/market-overview"
import NewlyBondedTokens from "@/components/newly-bonded-tokens"

// Mock data
const topTokens = [
  {
    id: "1",
    name: "Top Token 01",
    symbol: "TT1",
    price: 0.00052153,
    change: 12.5,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Top Token 01",
    symbol: "TT1",
    price: 0.00052153,
    change: -5.2,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Top Token 01",
    symbol: "TT1",
    price: 0.00052153,
    change: 8.7,
    image: "/placeholder.svg?height=40&width=40",
  },
]

const featuredTokens = [
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

const transactions = [
  {
    id: "1",
    date: "02/21/2023, 01:40:52 AM",
    owner: "Alex 001",
    type: "Sale",
    tradedToken: "01",
    usd: "753,099,856",
    tokenAmount: "-85.01",
    hash: "100",
  },
  {
    id: "2",
    date: "02/21/2023, 01:40:52 AM",
    owner: "Alex 001",
    type: "Sale",
    tradedToken: "01",
    usd: "753,099,856",
    tokenAmount: "-85.01",
    hash: "100",
  },
  {
    id: "3",
    date: "02/21/2023, 01:40:52 AM",
    owner: "Alex 001",
    type: "Sale",
    tradedToken: "01",
    usd: "753,099,856",
    tokenAmount: "-85.01",
    hash: "100",
  },
  {
    id: "4",
    date: "02/21/2023, 01:40:52 AM",
    owner: "Alex 001",
    type: "Sale",
    tradedToken: "01",
    usd: "753,099,856",
    tokenAmount: "-85.01",
    hash: "100",
  },
  {
    id: "5",
    date: "02/21/2023, 01:40:52 AM",
    owner: "Alex 001",
    type: "Sale",
    tradedToken: "01",
    usd: "753,099,856",
    tokenAmount: "-85.01",
    hash: "100",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <MarketOverview />
        </div>

        <div className="md:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button className="justify-start bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Add New Token
              </Button>
              <Button className="justify-start bg-indigo-600 hover:bg-indigo-700">
                <Bell className="mr-2 h-4 w-4" /> Create Alert
              </Button>
              <Button className="justify-start bg-indigo-600 hover:bg-indigo-700">
                <BarChart2 className="mr-2 h-4 w-4" /> View Analytics
              </Button>
              <Button className="justify-start bg-indigo-600 hover:bg-indigo-700">
                <Zap className="mr-2 h-4 w-4" /> Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <NewlyBondedTokens />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Watchlist</h2>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topTokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">New Tokens</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Last 24 hours</DropdownMenuItem>
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <NewTokensChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Recommended Tokens</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <span>Sort by</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TokenTable tokens={featuredTokens.slice(0, 2)} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Featured Trade</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-muted h-8">
                <TabsTrigger value="all" className="text-xs h-7">
                  All
                </TabsTrigger>
                <TabsTrigger value="trending" className="text-xs h-7">
                  Trending
                </TabsTrigger>
                <TabsTrigger value="new" className="text-xs h-7">
                  New
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TokenTable tokens={featuredTokens} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TransactionsTable transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  )
}
