"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FrontendToken, TokensApiResponse } from "@/lib/types"
import { Eye, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Helper function to get price change color
function getPriceChangeColor(change: string): string {
  if (change === "N/A") return "text-gray-400"
  const numChange = parseFloat(change)
  return numChange >= 0 ? "text-green-500" : "text-red-500"
}

// Helper function to format price change
function formatPriceChange(change: string): string {
  if (change === "N/A") return "N/A"
  const numChange = parseFloat(change)
  return `${numChange >= 0 ? "+" : ""}${change}%`
}

// Helper function to render mini chart
function renderMiniChart(change: string) {
  const numChange = parseFloat(change)
  if (isNaN(numChange)) {
    return <div className="w-16 h-8 bg-gray-100 rounded"></div>
  }
  
  const isPositive = numChange >= 0
  return (
    <div className="w-16 h-8 flex items-center justify-center">
      {isPositive ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
    </div>
  )
}

export default function WatchlistPage() {
  const [tokens, setTokens] = useState<FrontendToken[]>([])
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real token data
  useEffect(() => {
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

    fetchTokens() // Load only when watchlist is accessed
  }, [])

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setWishlistLoading(true)
        const authToken = localStorage.getItem('auth_token')

        if (!authToken) {
          setWishlistItems([])
          setWishlistLoading(false)
          return
        }

        const response = await fetch('/api/wishlist', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Cache-Control': 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.data) {
          setWishlistItems(data.data)
        } else {
          setWishlistItems([])
        }
      } catch (error: any) {
        console.error('Error fetching wishlist:', error)
        setWishlistItems([])
      } finally {
        setWishlistLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  // Remove item from wishlist
  const removeFromWishlist = async (itemId: string) => {
    try {
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) return

      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  // Render wishlist section
  const renderWishlist = () => {
    if (wishlistLoading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading wishlist...</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (wishlistItems.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">Your wishlist is empty.</p>
              <p className="text-sm text-gray-400 mt-1">
                Add tokens from the overview page to track them here.
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Wishlist</CardTitle>
          <p className="text-sm text-gray-600">
            Tokens you've added to your wishlist
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{item.tokenSymbol}</div>
                    <div className="text-sm text-gray-500">{item.tokenName}</div>
                    <div className="text-xs text-gray-400">
                      Added: {new Date(item.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/token/${item.tokenId}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Split tokens into two sections
  const recommendedTokens = tokens.slice(0, 5)
  const newTokens = tokens.slice(5, 10)

  const renderTokenTable = (tokens: FrontendToken[], title: string) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-800">
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Name</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Symbol</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Market Cap</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Created</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Bonded</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">5m%</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">1h%</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">6h%</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">24h%</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">5m</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {token.symbol.charAt(0)}
                      </div>
                      <span className="font-medium">{token.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{token.symbol}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{token.marketCap || 'N/A'}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">
                    {new Date(token.created).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">
                    {new Date(token.created).toLocaleDateString()}
                  </td>
                  <td className={`p-3 ${getPriceChangeColor(token.fiveMin)}`}>
                    {formatPriceChange(token.fiveMin)}
                  </td>
                  <td className={`p-3 ${getPriceChangeColor(token.oneHour)}`}>
                    {formatPriceChange(token.oneHour)}
                  </td>
                  <td className={`p-3 ${getPriceChangeColor(token.sixHour)}`}>
                    {formatPriceChange(token.sixHour)}
                  </td>
                  <td className={`p-3 ${getPriceChangeColor(token.twentyFourHour)}`}>
                    {formatPriceChange(token.twentyFourHour)}
                  </td>
                  <td className={`p-3 ${getPriceChangeColor(token.fiveMin)}`}>
                    {formatPriceChange(token.fiveMin)}
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/token/${token.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Watchlist</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading tokens...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Watchlist</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error loading tokens: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Watchlist</h1>
        </div>
      </div>

      {/* Wishlist */}
      {renderWishlist()}

      {/* Recommended Tokens */}
      {renderTokenTable(recommendedTokens, "Recommend Tokens")}

      {/* New Tokens */}
      {renderTokenTable(newTokens, "New Tokens")}
    </div>
  )
}
