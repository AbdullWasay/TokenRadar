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
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'marketCap' | 'bonding'>('bonding') // Default to bonding percentage
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [search, setSearch] = useState('')
  const tokensPerPage = 20 // Show more tokens per page

  // Fetch tokens from API
  const fetchTokens = async () => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams({
        limit: '1000',
        sortBy: sortBy,
        ...(search && { search: search })
      })

      const response = await fetch(`/api/tokens/all?${searchParams}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      const data: TokensApiResponse = await response.json()

      // Handle 503 (no real data available) gracefully
      if (response.status === 503) {
        setTokens([])
        setConnectionStatus('disconnected')
        setError(data.message || 'No real pump.fun data available. Start the scraper to collect real data.')
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

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
        // Handle case when no real data is available
        setTokens([])
        setConnectionStatus('disconnected')
        throw new Error(data.message || 'Cannot load tokens - no real data available from pump.fun')
      }
    } catch (err: any) {
      console.error('Error fetching tokens:', err)
      setError(err.message || 'Failed to fetch token data')
      setConnectionStatus('disconnected')
    } finally {
      setLoading(false)
    }
  }

  // Load tokens when search or sortBy changes
  useEffect(() => {
    fetchTokens()
  }, [search, sortBy])

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

      {/* Search and Sorting Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tokens by name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="bonding">Bonding %</option>
            <option value="marketCap">Market Cap</option>
            <option value="name">Name</option>
            <option value="created">Created</option>
          </select>

          <Button
            onClick={fetchTokens}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">No Real Pump.fun Data Available</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                This application only displays <strong>REAL DATA</strong> from pump.fun - no fake or sample data.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  <strong>To see real pump.fun tokens:</strong>
                </p>
                <ol className="text-sm text-blue-600 dark:text-blue-400 text-left space-y-1">
                  <li>1. Visit <a href="/admin/scraper" className="underline hover:text-blue-800">/admin/scraper</a></li>
                  <li>2. Click "Start Scraper" to begin collecting real pump.fun data</li>
                  <li>3. Wait for the scraper to collect tokens from pump.fun</li>
                  <li>4. Refresh this page to see real tokens</li>
                </ol>
              </div>
              <Button
                onClick={() => window.location.href = '/admin/scraper'}
                className="mt-4"
              >
                Go to Scraper Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : tokens.length === 0 ? (
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
