"use client"

import AlertModal from "@/components/alert-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { TokenDetailData } from "@/lib/types"
import { ArrowLeft, Bell, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function TokenDetail() {
  const params = useParams()
  const { id } = params

  const [token, setToken] = useState<TokenDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        setLoading(true)

        const response = await fetch(`/api/tokens/${id}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.data) {
          // Transform the API response to match the expected TokenDetailData format
          const tokenDetail: TokenDetailData = {
            id: data.data.id,
            name: data.data.name,
            symbol: data.data.symbol,
            price: data.data.price,
            marketCap: data.data.marketCap,
            change24h: data.data.change24h,
            volume24h: data.data.volume24h,
            launchTime: data.data.launchTime,
            bondedPercentage: data.data.bondedPercentage,
            bondedTime: data.data.bondedTime,
            image: data.data.image || "",

            description: data.data.description || "No description available",
            website: data.data.website,
            twitter: data.data.twitter,
            telegram: data.data.telegram,
            contractAddress: data.data.contractAddress,
            holders: data.data.holders || 0,
            totalSupply: data.data.totalSupply,
            pairAddress: data.data.pairAddress || "",
            transactions: data.data.transactions || [],
            fiveMin: data.data.fiveMin,
            oneHour: data.data.oneHour,
            sixHour: data.data.sixHour,
            twentyFourHour: data.data.twentyFourHour
          }

          setToken(tokenDetail)
        } else {
          throw new Error(data.message || 'Failed to fetch token details')
        }
      } catch (error: any) {
        console.error('Error fetching token details:', error)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTokenDetails()
    }
  }, [id])

  // Wishlist functionality
  const handleWishlistToggle = async () => {
    if (!token) return

    setWishlistLoading(true)
    try {
      const method = isInWishlist ? 'DELETE' : 'POST'
      const response = await fetch(`/api/wishlist/${token.id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setIsInWishlist(!isInWishlist)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setWishlistLoading(false)
    }
  }

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
          <p className="text-gray-500 mb-4">The token you're looking for doesn't exist or has been removed.</p>
          <Link href="/all-tokens" className="text-primary hover:underline">
            Return to All Tokens
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8">
        <Link
          href="/all-tokens"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to All Tokens
        </Link>

        <div className="flex justify-between items-start">
          <div className="flex items-center">
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
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setAlertModalOpen(true)}
            >
              <Bell size={16} className="mr-1" />
              Set Alert
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-blue-500 text-blue-500 hover:bg-blue-50"
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => window.open(`https://pump.fun/${token.contractAddress}`, '_blank')}
            >
              <ExternalLink size={16} className="mr-1" />
              Pump.fun
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => window.open(`https://dexscreener.com/solana/${token.contractAddress}`, '_blank')}
            >
              <ExternalLink size={16} className="mr-1" />
              DexScreener
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Price Information</h2>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {token.price > 0 ? `$${token.price.toFixed(8)}` : 'Price not available'}
                  </div>
                  {token.change24h !== 0 && (
                    <div className={`text-sm ${token.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {token.change24h >= 0 ? "+" : ""}
                      {token.change24h}% (24h)
                    </div>
                  )}
                </div>
              </div>

              {/* Real Price Changes Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">5 Minutes</div>
                  <div className={`text-lg font-semibold ${
                    token.fiveMin && token.fiveMin !== 'N/A'
                      ? parseFloat(token.fiveMin) >= 0 ? 'text-green-500' : 'text-red-500'
                      : 'text-gray-400'
                  }`}>
                    {token.fiveMin && token.fiveMin !== 'N/A'
                      ? `${parseFloat(token.fiveMin) >= 0 ? '+' : ''}${token.fiveMin}%`
                      : 'N/A'
                    }
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">1 Hour</div>
                  <div className={`text-lg font-semibold ${
                    token.oneHour && token.oneHour !== 'N/A'
                      ? parseFloat(token.oneHour) >= 0 ? 'text-green-500' : 'text-red-500'
                      : 'text-gray-400'
                  }`}>
                    {token.oneHour && token.oneHour !== 'N/A'
                      ? `${parseFloat(token.oneHour) >= 0 ? '+' : ''}${token.oneHour}%`
                      : 'N/A'
                    }
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">6 Hours</div>
                  <div className={`text-lg font-semibold ${
                    token.sixHour && token.sixHour !== 'N/A'
                      ? parseFloat(token.sixHour) >= 0 ? 'text-green-500' : 'text-red-500'
                      : 'text-gray-400'
                  }`}>
                    {token.sixHour && token.sixHour !== 'N/A'
                      ? `${parseFloat(token.sixHour) >= 0 ? '+' : ''}${token.sixHour}%`
                      : 'N/A'
                    }
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">24 Hours</div>
                  <div className={`text-lg font-semibold ${
                    token.twentyFourHour && token.twentyFourHour !== 'N/A'
                      ? parseFloat(token.twentyFourHour) >= 0 ? 'text-green-500' : 'text-red-500'
                      : 'text-gray-400'
                  }`}>
                    {token.twentyFourHour && token.twentyFourHour !== 'N/A'
                      ? `${parseFloat(token.twentyFourHour) >= 0 ? '+' : ''}${token.twentyFourHour}%`
                      : 'N/A'
                    }
                  </div>
                </div>
              </div>

              {/* Token Info Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-8">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Token Info</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</div>
                        <p className="text-sm text-gray-300">{token.description || 'No description available'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Launch Time</div>
                          <div className="text-sm font-medium text-gray-300">
                            {new Date(token.launchTime).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bonded</div>
                          <div className="text-sm font-medium text-gray-300">{token.bondedPercentage}%</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Links</div>
                        <div className="text-sm text-gray-500">No social links available</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Stats and Contract Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Market Stats */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Market Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                        <span className="text-sm font-medium text-white">${token.price.toFixed(8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">24h Change</span>
                        <span className={`text-sm font-medium ${token.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {token.change24h >= 0 ? "+" : ""}
                          {token.change24h}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Market Cap</span>
                        <span className="text-sm font-medium text-white">{token.marketCap}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">24h Volume</span>
                        <span className="text-sm font-medium text-white">${token.volume24h?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Holders</span>
                        <span className="text-sm font-medium text-white">{token.holders?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contract Info */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Contract Info</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contract Address</div>
                        <div className="flex items-center">
                          <code className="text-xs bg-gray-700 p-2 rounded w-full overflow-hidden text-ellipsis text-gray-300">
                            {token.contractAddress}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-8 w-8 p-0 text-gray-400 hover:text-white"
                            onClick={() => {
                              navigator.clipboard.writeText(token.contractAddress)
                              alert('Contract address copied!')
                            }}
                          >
                            📋
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <AlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        tokenId={token.id}
        tokenName={token.name}
        tokenSymbol={token.symbol}
        currentPrice={token.price}
        currentBondingPercentage={token.bondedPercentage}
      />
    </div>
  )
}
