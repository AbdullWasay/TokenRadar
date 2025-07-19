"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FrontendToken } from "@/lib/types"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface MarketStats {
  bondedTokensLast24h: number
  totalBondedTokens: number
  totalTokens: number
}

interface MarketOverviewProps {
  tokens: FrontendToken[]
  loading: boolean
}

export default function MarketOverview({ tokens, loading }: MarketOverviewProps) {
  const [marketStats, setMarketStats] = useState<MarketStats>({
    bondedTokensLast24h: 0,
    totalBondedTokens: 0,
    totalTokens: 0
  })

  useEffect(() => {
    const fetchBondedTokensToday = async () => {
      if (tokens.length > 0) {
        const totalTokens = tokens.length

        // Count total bonded tokens
        const totalBondedTokens = tokens.filter(token => {
          return token.bonded || token.bondedPercentage === 100
        }).length

        // Count bonded tokens created today - use exact same logic as bonded tokens page
        try {
          const response = await fetch('/api/tokens/bonded?limit=1000', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache'
            }
          })
          const data = await response.json()

          let bondedTokensToday = 0
          if (data.success && data.data) {
            const now = new Date()

            // Count tokens with "New" badge (exact same logic as bonded tokens page)
            bondedTokensToday = data.data.filter((token: any) => {
              if (token.bondedTimestamp) {
                // Handle both seconds and milliseconds timestamps
                const timestamp = parseInt(token.bondedTimestamp)
                const bondedTime = new Date(timestamp > 1000000000000 ? timestamp : timestamp * 1000)
                const isSameDay = bondedTime.toDateString() === now.toDateString()
                return isSameDay
              }
              return false
            }).length
          }

          setMarketStats({
            totalTokens,
            totalBondedTokens,
            bondedTokensLast24h: bondedTokensToday
          })
        } catch (error) {
          console.error('Error fetching bonded tokens for market overview:', error)
          setMarketStats({
            totalTokens,
            totalBondedTokens,
            bondedTokensLast24h: 0
          })
        }
      }
    }

    fetchBondedTokensToday()
  }, [tokens])



  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Market Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-pulse">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3"></div>
              <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-6">
            {/* Left: Icon and Stats */}
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1.5">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  {marketStats.bondedTokensLast24h}
                </div>
                <div className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  New Bonded Tokens Today
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Tokens that reached 100% bonding today
                </div>
              </div>
            </div>

            {/* Right: Action Button */}
            <Button
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow transform transition hover:scale-105 text-sm"
              asChild
            >
              <Link href="/bonded">
                <TrendingUp className="w-4 h-4 mr-2" />
                View All
              </Link>
            </Button>
          </div>

        )}
      </CardContent>
    </Card>
  )
}
