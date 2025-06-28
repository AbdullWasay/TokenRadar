"use client"
import MarketOverview from "@/components/market-overview"
import NewlyBondedTokens from "@/components/newly-bonded-tokens"
import TokenCard from "@/components/token-card"
import TokenTable from "@/components/token-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WelcomeBanner from "@/components/welcome-banner"
import type { FrontendToken, TokensApiResponse } from "@/lib/types"
import { BarChart2, Bell, ChevronDown, Filter, Plus, RefreshCw, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"



export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tokens, setTokens] = useState<FrontendToken[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real token data
  const fetchTokens = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tokens', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: TokensApiResponse = await response.json()

      if (data.success && data.data) {
        setTokens(data.data)
        setError(null)
      } else {
        throw new Error(data.message || 'Failed to fetch tokens')
      }
    } catch (error: any) {
      console.error('Error fetching tokens:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTokens() // Load only when dashboard is accessed
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchTokens().finally(() => setIsRefreshing(false))
  }

  // Transform tokens for different sections
  const topTokens = tokens.slice(0, 3).map(token => ({
    id: token.id,
    name: token.name,
    symbol: token.symbol,
    price: 0.00000001, // We'll need to get real price from individual token API
    change: parseFloat(token.twentyFourHour) || 0,
    image: token.image || "/placeholder.svg?height=40&width=40",
    bondedPercentage: token.bondedPercentage
  }))

  const featuredTokens = tokens.slice(0, 6)

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <MarketOverview tokens={tokens} loading={loading} />
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

      <NewlyBondedTokens tokens={tokens} loading={loading} />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Watchlist</h2>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error loading tokens: {error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topTokens.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        )}
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
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <TokenTable tokens={featuredTokens.slice(0, 3)} />
            )}
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
            {loading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <TokenTable tokens={featuredTokens.slice(0, 2)} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">New Tokens</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-muted h-8">
                <TabsTrigger value="all" className="text-xs h-7">
                  All
                </TabsTrigger>
                <TabsTrigger value="bonded" className="text-xs h-7">
                  Bonded
                </TabsTrigger>
                <TabsTrigger value="unbonded" className="text-xs h-7">
                  Unbonded
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <TokenTable tokens={
              activeTab === "bonded"
                ? featuredTokens.filter(token => token.bonded)
                : activeTab === "unbonded"
                ? featuredTokens.filter(token => !token.bonded)
                : featuredTokens
            } />
          )}
        </CardContent>
      </Card>

      {/* Real-time Token Statistics */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Live Statistics</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/all-tokens">View All Tokens</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{tokens.length}</div>
              <div className="text-sm text-gray-500">Total Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tokens.filter(token => token.bonded).length}
              </div>
              <div className="text-sm text-gray-500">Bonded Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {tokens.filter(token => !token.bonded).length}
              </div>
              <div className="text-sm text-gray-500">Unbonded Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {tokens.filter(token => {
                  const created = new Date(token.created)
                  const now = new Date()
                  const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
                  return diffHours <= 24
                }).length}
              </div>
              <div className="text-sm text-gray-500">New (24h)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
