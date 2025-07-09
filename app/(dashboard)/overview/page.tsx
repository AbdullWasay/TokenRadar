"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import type { FrontendToken, TokensApiResponse } from "@/lib/types"
import { Bell, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

interface VolumeData {
  m5: number
  h1: number
  h6: number
  h24: number
}

export default function OverviewPage() {
  const { toast } = useToast()
  const [tokens, setTokens] = useState<FrontendToken[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedToken, setSelectedToken] = useState<FrontendToken | null>(null)
  const [volumeData, setVolumeData] = useState<VolumeData | null>(null)
  const [volumeLoading, setVolumeLoading] = useState(false)
  const [priceThreshold, setPriceThreshold] = useState<string>('')
  const [isCreatingAlert, setIsCreatingAlert] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const tokensPerPage = 6 // 2 rows × 3 columns
  const [wishlistTokenIds, setWishlistTokenIds] = useState<string[]>([])

  const fetchTokens = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      }
      const response = await fetch('/api/tokens', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch tokens')
      }
      const data: TokensApiResponse = await response.json()

      if (data.success && data.data) {
        setTokens(data.data)

        // Update selected token data if it exists in the new data
        if (selectedToken) {
          const updatedSelectedToken = data.data.find(token => token.id === selectedToken.id)
          if (updatedSelectedToken) {
            setSelectedToken(updatedSelectedToken)
            await fetchVolumeData(updatedSelectedToken)
          }
        } else if (data.data.length > 0) {
          // Only set initial token if no token is selected
          setSelectedToken(data.data[0])
          await fetchVolumeData(data.data[0])
        }
        setError(null)
      } else {
        throw new Error(data.message || 'Failed to fetch tokens')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  const fetchVolumeData = async (token: FrontendToken) => {
    try {
      setVolumeLoading(true)
      // Fetch detailed token data to get volume information
      const response = await fetch(`/api/tokens/${token.id}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          // Extract volume data from the detailed token response
          setVolumeData({
            m5: data.data.volume?.m5 || 0,
            h1: data.data.volume?.h1 || 0,
            h6: data.data.volume?.h6 || 0,
            h24: data.data.volume24h || 0
          })
        }
      }
    } catch (error) {
      console.error('Error fetching volume data:', error)
      setVolumeData(null)
    } finally {
      setVolumeLoading(false)
    }
  }

  useEffect(() => {
    fetchTokens(true) // Show loading only when page is accessed
  }, [])

  const createPriceAlert = async () => {
    if (!selectedToken || !priceThreshold) {
      toast({
        title: "Error",
        description: "Please select a token and enter a price threshold",
        variant: "destructive"
      })
      return
    }

    setIsCreatingAlert(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast({
          title: "Error",
          description: "Please log in to create alerts",
          variant: "destructive"
        })
        return
      }

      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tokenId: selectedToken.id,
          tokenName: selectedToken.name,
          tokenSymbol: selectedToken.symbol,
          alertType: 'price',
          condition: 'above',
          threshold: parseFloat(priceThreshold),
          timeframe: null
        })
      })

      const data = await response.json()
      console.log('Alert creation response:', data) // Debug log

      if (data.success) {
        toast({
          title: "✅ Alert Created Successfully!",
          description: `Price alert set for ${selectedToken.symbol} at $${priceThreshold}. Check your alerts page to view it.`,
          duration: 5000,
        })
        setPriceThreshold('')

        // Show a follow-up toast with link to alerts page
        setTimeout(() => {
          toast({
            title: "💡 View Your Alerts",
            description: "Your new alert is ready! Click to view all alerts.",
            action: (
              <a
                href="/alerts"
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50"
                onClick={() => {
                  // Force page refresh when navigating to alerts
                  window.location.href = '/alerts'
                }}
              >
                View Alerts
              </a>
            ),
            duration: 10000,
          })
        }, 3000)
      } else {
        console.error('Alert creation failed:', data) // Debug log
        toast({
          title: "❌ Failed to Create Alert",
          description: data.error || data.message || 'Failed to create alert. Please try again.',
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error creating alert:', error)
      toast({
        title: "❌ Network Error",
        description: "Failed to create alert due to network error. Please check your connection and try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsCreatingAlert(false)
    }
  }

  // Check wishlist status for current tokens
  const checkWishlistStatus = async (tokenIds: string[]) => {
    try {
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) {
        setWishlistTokenIds([])
        return
      }

      const response = await fetch('/api/wishlist', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ tokenIds })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setWishlistTokenIds(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error)
      setWishlistTokenIds([])
    }
  }

  // Check wishlist status when tokens change
  useEffect(() => {
    if (tokens.length > 0) {
      const tokenIds = tokens.map(token => token.id)
      checkWishlistStatus(tokenIds)
    }
  }, [tokens])

  // Add token to wishlist
  const addToWishlist = async (token: FrontendToken) => {
    if (!token) return

    setIsAddingToWishlist(true)
    try {
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) {
        toast({
          title: "❌ Login Required",
          description: "Please log in to add tokens to your wishlist.",
          variant: "destructive",
          duration: 5000,
        })
        return
      }

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          tokenId: token.id,
          tokenName: token.name,
          tokenSymbol: token.symbol,
          tokenAddress: token.address || null
        })
      })

      const data = await response.json()
      console.log('Wishlist API response:', data) // Debug log
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok && data.success) {
        toast({
          title: "✅ Added to Wishlist!",
          description: `${token.symbol} has been added to your wishlist.`,
          action: (
            <a
              href="/watchlist"
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50"
              onClick={() => {
                window.location.href = '/watchlist'
              }}
            >
              View Wishlist
            </a>
          ),
          duration: 8000,
        })

        // Update wishlist status
        setWishlistTokenIds(prev => [...prev, token.id])
      } else {
        console.error('Wishlist addition failed:', data)
        console.error('Full response:', { status: response.status, data })
        toast({
          title: "❌ Failed to Add",
          description: data.error || `Failed to add token to wishlist. Status: ${response.status}`,
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      toast({
        title: "❌ Network Error",
        description: `Failed to add to wishlist: ${error.message}`,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  const handleTokenSelection = async (token: FrontendToken) => {
    setSelectedToken(token)
    await fetchVolumeData(token)
  }

  const formatPriceChange = (value: string) => {
    if (value === "N/A" || !value) return "N/A"
    const num = parseFloat(value)
    return num >= 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`
  }

  const getPriceChangeColor = (value: string) => {
    if (value === "N/A" || !value) return "text-gray-400"
    const num = parseFloat(value)
    return num >= 0 ? "text-green-500" : "text-red-500"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading overview data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => fetchTokens()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Overview</h1>
        <Button
          onClick={() => fetchTokens(false)}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Token Selection */}
      {tokens.length > 1 && (() => {
        const totalPages = Math.ceil(tokens.length / tokensPerPage)
        const startIndex = currentPage * tokensPerPage
        const endIndex = startIndex + tokensPerPage
        const currentTokens = tokens.slice(startIndex, endIndex)

        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Token for Analysis</CardTitle>
                  <p className="text-sm text-gray-600">
                    Choose a token to view detailed information and set alerts
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {tokens.length} tokens available
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {currentTokens.map((token) => (
                  <div
                    key={token.id}
                    onClick={() => setSelectedToken(token)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedToken?.id === token.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-black dark:text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-sm">{token.symbol}</h3>
                        <p className="text-xs text-gray-500 truncate">{token.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{token.created}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Wishlist status indicator */}
                        {wishlistTokenIds.includes(token.id) && (
                          <div className="flex items-center gap-1 text-red-500">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <span className="text-xs">In Wishlist</span>
                          </div>
                        )}
                        {selectedToken?.id === token.id && !wishlistTokenIds.includes(token.id) && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                addToWishlist(token)
                              }}
                              disabled={isAddingToWishlist}
                              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                              {isAddingToWishlist ? 'Adding...' : 'Add to Wishlist'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-8 h-8 text-sm rounded ${
                            currentPage === i
                              ? 'bg-blue-500 text-white'
                              : 'border hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })()}

      {/* Main Grid - Single Column for Mobile */}
      <div className="grid grid-cols-1 gap-6">
        {/* PUMP.FUN DATA */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <CardTitle>PUMP.FUN DATA</CardTitle>
            </div>
            <p className="text-sm text-gray-600">
              {selectedToken ? `${selectedToken.name} (${selectedToken.symbol})` : 'No token selected'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedToken ? (
              <div className="space-y-4">
                {/* Token Image and Basic Info */}
                <div className="flex items-center gap-4">
                  {selectedToken.image && (
                    <img
                      src={selectedToken.image}
                      alt={selectedToken.symbol}
                      className="w-16 h-16 rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{selectedToken.name}</h3>
                    <p className="text-gray-600">{selectedToken.symbol}</p>
                    {selectedToken.description && (
                      <p className="text-sm text-gray-500 mt-1 max-w-md truncate">
                        {selectedToken.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Token Details Grid - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created</span>
                      <span className="text-blue-600">
                        {new Date(selectedToken.created).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creator</span>
                      <span className="text-blue-600 text-xs">
                        {selectedToken.creator ?
                          `${selectedToken.creator.slice(0, 6)}...${selectedToken.creator.slice(-4)}` :
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bonded Status</span>
                      <span className={`font-medium ${selectedToken.bonded && selectedToken.bonded !== 'N/A' ? 'text-green-600' : 'text-orange-600'}`}>
                        {selectedToken.bonded && selectedToken.bonded !== 'N/A' ? 'Bonded' : 'Not Bonded'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Cap</span>
                      <span className="text-blue-600 font-medium">{selectedToken.marketCap || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bonding %</span>
                      <span className="text-blue-600">
                        {selectedToken.bondedPercentage !== undefined ? `${selectedToken.bondedPercentage}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Trade</span>
                      <span className="text-blue-600">
                        {selectedToken.lastTradeTimestamp ?
                          new Date(selectedToken.lastTradeTimestamp * 1000).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Supply</span>
                      <span className="text-blue-600">{selectedToken.totalSupply || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contract</span>
                      <span className="text-blue-600 text-xs">
                        {selectedToken.contractAddress ?
                          `${selectedToken.contractAddress.slice(0, 6)}...${selectedToken.contractAddress.slice(-4)}` :
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SOL Reserves</span>
                      <span className="text-blue-600 text-xs">
                        {selectedToken.virtualSolReserves ?
                          parseFloat(selectedToken.virtualSolReserves).toFixed(2) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Token Reserves</span>
                      <span className="text-blue-600 text-xs">
                        {selectedToken.virtualTokenReserves ?
                          parseFloat(selectedToken.virtualTokenReserves).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bonding Curve</span>
                      <span className="text-blue-600 text-xs">
                        {selectedToken.bondingCurve ?
                          `${selectedToken.bondingCurve.slice(0, 6)}...${selectedToken.bondingCurve.slice(-4)}` :
                          'N/A'
                        }
                      </span>
                    </div>
                    {/* Social Links */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Links</span>
                      <div className="flex gap-2">
                        {selectedToken.website && (
                          <a href={selectedToken.website} target="_blank" rel="noopener noreferrer"
                             className="text-blue-600 hover:text-blue-800 text-xs">
                            Web
                          </a>
                        )}
                        {selectedToken.twitter && (
                          <a href={selectedToken.twitter} target="_blank" rel="noopener noreferrer"
                             className="text-blue-600 hover:text-blue-800 text-xs">
                            X
                          </a>
                        )}
                        {selectedToken.telegram && (
                          <a href={selectedToken.telegram} target="_blank" rel="noopener noreferrer"
                             className="text-blue-600 hover:text-blue-800 text-xs">
                            TG
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No token data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* DEX DATA */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <CardTitle>DEX DATA</CardTitle>
            </div>
            <div className="text-orange-500 font-bold">
              MARKET CAP: {selectedToken?.marketCap || 'N/A'}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timeframe Headers - Mobile Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center text-sm font-medium text-gray-600 border-b pb-2">
              <span>5m</span>
              <span>1h</span>
              <span>6h</span>
              <span>24h</span>
            </div>

            {/* Price Changes Row */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="mb-2">
                <span className="font-medium text-gray-700">PRICE CHANGE</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
                <span className={`font-medium ${getPriceChangeColor(selectedToken?.fiveMin || "0")}`}>
                  {formatPriceChange(selectedToken?.fiveMin || "0")}
                </span>
                <span className={`font-medium ${getPriceChangeColor(selectedToken?.oneHour || "0")}`}>
                  {formatPriceChange(selectedToken?.oneHour || "0")}
                </span>
                <span className={`font-medium ${getPriceChangeColor(selectedToken?.sixHour || "0")}`}>
                  {formatPriceChange(selectedToken?.sixHour || "0")}
                </span>
                <span className={`font-medium ${getPriceChangeColor(selectedToken?.twentyFourHour || "0")}`}>
                  {formatPriceChange(selectedToken?.twentyFourHour || "0")}
                </span>
              </div>
            </div>

            {/* Volume Row */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="mb-2">
                <span className="font-medium text-gray-700">
                  VOLUME {volumeLoading && <span className="text-xs text-blue-500 ml-2">updating...</span>}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
                <span className="text-gray-600 font-medium">
                  {volumeLoading ? '...' : (volumeData?.m5 ? `$${volumeData.m5.toLocaleString()}` : 'N/A')}
                </span>
                <span className="text-gray-600 font-medium">
                  {volumeLoading ? '...' : (volumeData?.h1 ? `$${volumeData.h1.toLocaleString()}` : 'N/A')}
                </span>
                <span className="text-gray-600 font-medium">
                  {volumeLoading ? '...' : (volumeData?.h6 ? `$${volumeData.h6.toLocaleString()}` : 'N/A')}
                </span>
                <span className="text-gray-600 font-medium">
                  {volumeLoading ? '...' : (volumeData?.h24 ? `$${volumeData.h24.toLocaleString()}` : 'N/A')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Price Alert Configuration */}
      {selectedToken && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Price Alert for {selectedToken.symbol}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Get notified when {selectedToken.name} reaches your target price
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Target Price ($):</span>
                <input
                  type="number"
                  value={priceThreshold}
                  onChange={(e) => setPriceThreshold(e.target.value)}
                  placeholder="0.000001"
                  className="px-3 py-2 border rounded-md w-32 text-sm"
                  step="0.000001"
                  min="0"
                />
              </div>
              <Button
                onClick={createPriceAlert}
                disabled={!priceThreshold || isCreatingAlert}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCreatingAlert ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
                  </>
                )}
              </Button>
            </div>
            {selectedToken.marketCap && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Market Cap:</span> {selectedToken.marketCap}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Symbol:</span> {selectedToken.symbol}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Created:</span> {selectedToken.created}
                </p>
              </div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Alerts will be displayed in your <a href="/alerts" className="text-blue-500 hover:underline">Alerts section</a> once created
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  )
}
