"use client"

import { Badge } from "@/components/ui/badge"
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
      const token = localStorage.getItem('token')
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

      if (data.success) {
        toast({
          title: "Success",
          description: `Price alert created for ${selectedToken.symbol} at $${priceThreshold}`,
        })
        setPriceThreshold('')
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to create alert',
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating alert:', error)
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCreatingAlert(false)
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
          <Button onClick={fetchTokens} variant="outline">
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                {/* Token Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
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
            {/* Timeframe Headers */}
            <div className="grid grid-cols-4 gap-4 text-center text-sm font-medium text-gray-600 border-b pb-2">
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
              <div className="grid grid-cols-4 gap-4 text-center">
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
              <div className="grid grid-cols-4 gap-4 text-center">
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

      {/* Alert Configuration Section */}
      {selectedToken && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-500" />
                <span className="font-medium">
                  Price Alert for {selectedToken.symbol}
                </span>
                <Badge variant="secondary">
                  {priceThreshold ? `$${priceThreshold}` : 'Set Threshold'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Alert Status</span>
                <div className={`w-10 h-6 rounded-full relative ${priceThreshold ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${priceThreshold ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Alert Configuration */}
      {selectedToken && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Price Alert Configuration</CardTitle>
            <p className="text-sm text-gray-600">
              Set a price threshold for {selectedToken.symbol} to receive notifications
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Alert Price ($):</span>
              <input
                type="number"
                value={priceThreshold}
                onChange={(e) => setPriceThreshold(e.target.value)}
                placeholder="0.00"
                className="border rounded px-3 py-2 w-32"
                step="0.000001"
                min="0"
              />
              <Button
                onClick={createPriceAlert}
                disabled={!priceThreshold || isCreatingAlert}
                size="sm"
              >
                {isCreatingAlert ? 'Creating...' : 'Set Alert'}
              </Button>
            </div>
            {selectedToken.marketCap && (
              <p className="text-sm text-gray-500">
                Current Market Cap: {selectedToken.marketCap}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Token Selection */}
      {tokens.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Token for Analysis</CardTitle>
            <p className="text-sm text-gray-600">
              Choose a token to view detailed information and set alerts
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tokens.slice(0, 6).map((token) => (
                <div
                  key={token.id}
                  onClick={() => handleTokenSelection(token)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedToken?.id === token.id ? 'border-blue-500 bg-blue-50 text-gray-900' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {token.image && (
                      <img
                        src={token.image}
                        alt={token.symbol}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-gray-500">{token.name}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="text-gray-600">MC: {token.marketCap}</div>
                    <div className={`${getPriceChangeColor(token.twentyFourHour)}`}>
                      24h: {formatPriceChange(token.twentyFourHour)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
