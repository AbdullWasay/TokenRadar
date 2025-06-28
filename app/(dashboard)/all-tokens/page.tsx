"use client"


import Pagination from "@/components/pagination"
import TokenTable from "@/components/token-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { FrontendToken, TokensApiResponse } from "@/lib/types"
import { RefreshCw, SlidersHorizontal } from "lucide-react"
import { useEffect, useState } from "react"

export default function AllTokensPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [tokens, setTokens] = useState<FrontendToken[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
  const [previousTokenCount, setPreviousTokenCount] = useState<number>(0)
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'marketCap' | 'change24h'>('created')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const tokensPerPage = 6

  // Fetch tokens from API
  const fetchTokens = async () => {
    try {
      setLoading(true)
      setError(null)

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
        // Check for new tokens
        if (previousTokenCount > 0 && data.data.length > previousTokenCount) {
          const newTokensCount = data.data.length - previousTokenCount
          console.log(`🚀 ${newTokensCount} new token(s) detected!`)
          // You could add a toast notification here
        }

        setTokens(data.data)
        setPreviousTokenCount(data.data.length)
        setLastUpdated(data.lastUpdated || new Date().toISOString())
        setConnectionStatus('connected')
      } else {
        throw new Error(data.message || 'Failed to fetch tokens')
      }
    } catch (err: any) {
      console.error('Error fetching tokens:', err)
      setError(err.message || 'Failed to fetch token data')
      setConnectionStatus('disconnected')
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchTokens()
  }, [])

  // Removed auto-refresh - data loads only when page is accessed

  // Sort tokens
  const sortedTokens = [...tokens].sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'created':
        aValue = new Date(a.created).getTime()
        bValue = new Date(b.created).getTime()
        break
      case 'marketCap':
        aValue = parseFloat(a.marketCap || '0')
        bValue = parseFloat(b.marketCap || '0')
        break
      case 'change24h':
        aValue = parseFloat(a.twentyFourHour || '0')
        bValue = parseFloat(b.twentyFourHour || '0')
        break
      default:
        return 0
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Get current tokens for pagination
  const indexOfLastToken = currentPage * tokensPerPage
  const indexOfFirstToken = indexOfLastToken - tokensPerPage
  const currentTokens = sortedTokens.slice(indexOfFirstToken, indexOfLastToken)
  const totalPages = Math.ceil(sortedTokens.length / tokensPerPage)

  // Sort options
  const sortOptions = [
    { value: 'created', label: 'Created Date' },
    { value: 'name', label: 'Name' },
    { value: 'marketCap', label: 'Market Cap' },
    { value: 'change24h', label: '24h Change' }
  ]

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy as any)
      setSortOrder('desc')
    }
    setShowSortDropdown(false)
    setCurrentPage(1) // Reset to first page when sorting
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading tokens...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-medium">All Tokens</h1>
          <div className="flex items-center gap-4 mt-1">
            {lastUpdated && (
              <p className="text-sm text-gray-500">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-gray-500 capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 relative">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <SlidersHorizontal size={16} />
            <span>Sort By: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
            <span className="text-xs">({sortOrder === 'asc' ? '↑' : '↓'})</span>
          </Button>

          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 min-w-[150px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  onClick={() => handleSortChange(option.value)}
                >
                  {option.label}
                  {sortBy === option.value && (
                    <span className="float-right">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {tokens.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No tokens found.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <TokenTable tokens={currentTokens} />
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </>
      )}
    </div>
  )
}
