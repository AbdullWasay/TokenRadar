"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FrontendToken } from "@/lib/types"
import { ArrowDown, ArrowUp, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface MarketStats {
  totalTokens: number
  bondedTokens: number
  totalMarketCap: string
  newTokens24h: number
  avgBondingPercentage: number
}

interface MarketOverviewProps {
  tokens: FrontendToken[]
  loading: boolean
}

export default function MarketOverview({ tokens, loading }: MarketOverviewProps) {
  const [marketStats, setMarketStats] = useState<MarketStats>({
    totalTokens: 0,
    bondedTokens: 0,
    totalMarketCap: "$0",
    newTokens24h: 0,
    avgBondingPercentage: 0
  })

  useEffect(() => {
    if (tokens.length > 0) {
      // Calculate real market statistics
      const totalTokens = tokens.length
      const bondedTokens = tokens.filter(token => {
        // Check if token is bonded using multiple criteria
        return token.bonded || token.complete || token.bondedPercentage === 100
      }).length
      const newTokens24h = tokens.filter(token => {
        try {
          const created = new Date(token.created)
          const now = new Date()
          // Check if created today (same calendar day)
          return created.toDateString() === now.toDateString()
        } catch {
          return false
        }
      }).length

      // Calculate total market cap (sum of all token market caps)
      const totalMarketCapValue = tokens.reduce((sum, token) => {
        const mcValue = parseFloat(token.marketCap.replace(/[$,]/g, '')) || 0
        return sum + mcValue
      }, 0)

      // Calculate average bonding percentage
      const avgBondingPercentage = tokens.reduce((sum, token) => {
        return sum + (token.bondedPercentage || 0)
      }, 0) / totalTokens

      setMarketStats({
        totalTokens,
        bondedTokens,
        totalMarketCap: `$${totalMarketCapValue.toLocaleString()}`,
        newTokens24h,
        avgBondingPercentage: Math.round(avgBondingPercentage)
      })
    }
  }, [tokens])

  const stats = [
    {
      name: "Total Tokens",
      value: marketStats.totalTokens.toString(),
      change: marketStats.newTokens24h,
      icon: DollarSign,
      color: "text-indigo-600",
    },
    {
      name: "Bonded Tokens",
      value: marketStats.bondedTokens.toString(),
      change: Math.round((marketStats.bondedTokens / marketStats.totalTokens) * 100) || 0,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      name: "New (24h)",
      value: marketStats.newTokens24h.toString(),
      change: marketStats.avgBondingPercentage,
      icon: TrendingDown,
      color: "text-blue-500",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.name} className="space-y-1">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <stat.icon className={`h-4 w-4 mr-1 ${stat.color}`} />
                  <span>{stat.name}</span>
                </div>
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className={`flex items-center text-sm ${stat.change > 0 ? "text-green-500" : "text-red-500"}`}>
                  {stat.change > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  <span>{Math.abs(stat.change)}{stat.name === "Bonded Tokens" ? "%" : ""}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Token Distribution</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{marketStats.bondedTokens}</div>
              <div className="text-sm text-green-600">Bonded Tokens</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{marketStats.totalTokens - marketStats.bondedTokens}</div>
              <div className="text-sm text-yellow-600">Unbonded Tokens</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Market Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Total Market Cap</span>
              <span className="font-medium">{marketStats.totalMarketCap}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Avg Bonding %</span>
              <span className="font-medium">{marketStats.avgBondingPercentage}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">New Tokens (24h)</span>
              <span className="font-medium text-blue-600">{marketStats.newTokens24h}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
