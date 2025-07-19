"use client"
import MarketOverview from "@/components/market-overview"
import NewlyBondedTokens from "@/components/newly-bonded-tokens"
import TokenTable from "@/components/token-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import WelcomeBanner from "@/components/welcome-banner"
import type { FrontendToken, TokensApiResponse } from "@/lib/types"
import { BarChart2, Bell, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"



export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tokens, setTokens] = useState<FrontendToken[]>([])
  const [bondedTokens, setBondedTokens] = useState<FrontendToken[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real token data
  const fetchTokens = async () => {
    try {
      setLoading(true)

      // Fetch all tokens for dashboard display
      const allTokensResponse = await fetch('/api/tokens/all?limit=1000', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      const allTokensData: TokensApiResponse = await allTokensResponse.json()

      // Handle 503 (no real data available) gracefully
      if (allTokensResponse.status === 503) {
        setTokens([])
        setError(allTokensData.message || 'No real pump.fun data available. Start the scraper to collect real data.')
        return
      }

      if (!allTokensResponse.ok) {
        throw new Error(`HTTP error! status: ${allTokensResponse.status}`)
      }

      if (allTokensData.success && allTokensData.data) {
        setTokens(allTokensData.data)
        setError(null)
      } else {
        throw new Error(allTokensData.message || 'Failed to fetch tokens')
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
            <CardContent className="grid gap-3 sm:gap-4">
              <Button asChild className="justify-start bg-indigo-600 hover:bg-indigo-700 h-10 sm:h-auto">
                <Link href="/alerts">
                  <Bell className="mr-2 h-4 w-4" /> <span className="text-sm sm:text-base">Create Alert</span>
                </Link>
              </Button>
              <Button asChild className="justify-start bg-indigo-600 hover:bg-indigo-700 h-10 sm:h-auto">
                <Link href="/bonded">
                  <BarChart2 className="mr-2 h-4 w-4" /> <span className="text-sm sm:text-base">View Bonded Tokens</span>
                </Link>
              </Button>
              <Button asChild className="justify-start bg-indigo-600 hover:bg-indigo-700 h-10 sm:h-auto">
                <Link href="/profile">
                  <Zap className="mr-2 h-4 w-4" /> <span className="text-sm sm:text-base">Upgrade Plan</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <NewlyBondedTokens tokens={tokens} loading={loading} />

      {/* Removed Watchlist section as requested */}

      {/* Removed New Tokens and Recommended Tokens sections as requested */}

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">All Tokens</CardTitle>

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
            <TokenTable tokens={featuredTokens} />
          )}
          <div className="p-3 text-center border-t">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/all-tokens">View All Tokens</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Token Statistics */}

    </div>
  )
}
