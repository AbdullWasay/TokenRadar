import { NextRequest, NextResponse } from 'next/server'

// TokenTracker API response interface
interface TokenTrackerToken {
  associated_bonding_curve: string
  bonding_curve: string
  created_timestamp: number
  creator: string
  description: string
  image_url: string
  last_trade_timestamp: number
  metadata_uri: string
  name: string
  raydium_pool: string | null
  symbol: string
  telegram: string | null
  token_address: string
  total_supply: number
  twitter: string | null
  usd_market_cap: number
  virtual_sol_reserves: string
  virtual_token_reserves: string
  website: string | null
}

// DexScreener API response interface
interface DexScreenerPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  priceNative: string
  priceUsd: string
  txns: {
    m5: { buys: number; sells: number }
    h1: { buys: number; sells: number }
    h6: { buys: number; sells: number }
    h24: { buys: number; sells: number }
  }
  volume: {
    h24: number
    h6: number
    h1: number
    m5: number
  }
  priceChange: {
    m5?: number
    h1?: number
    h6?: number
    h24?: number
  }
  liquidity: {
    usd: number
    base: number
    quote: number
  }
  fdv: number
  marketCap: number
  pairCreatedAt: number
}

interface DexScreenerResponse {
  schemaVersion: string
  pairs: DexScreenerPair[] | null
}

// Our frontend token interface
interface FrontendToken {
  id: string
  name: string
  symbol: string
  marketCap: string
  created: string
  bonded: string
  fiveMin: string
  oneHour: string
  sixHour: string
  twentyFourHour: string
  image?: string
  description?: string
  website?: string
  twitter?: string
  telegram?: string
  contractAddress?: string
  totalSupply?: string
  bondedPercentage?: number
}

// Helper function to format timestamp to date string
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })
}

// Helper function to format market cap
function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`
  } else if (marketCap >= 1000) {
    return `$${(marketCap / 1000).toFixed(2)}K`
  } else {
    return `$${marketCap.toFixed(2)}`
  }
}

// Helper function to determine if token is bonded (has raydium pool)
function isBonded(token: TokenTrackerToken): boolean {
  return token.raydium_pool !== null
}

// Helper function to calculate bonding percentage (simplified)
function calculateBondingPercentage(token: TokenTrackerToken): number {
  // If it has a raydium pool, it's 100% bonded
  if (token.raydium_pool) {
    return 100
  }

  // Otherwise, calculate based on market cap (this is a simplified approach)
  // In reality, bonding curve mechanics are more complex
  const maxBondingMC = 100000 // Assume $100K is full bonding threshold
  const percentage = Math.min((token.usd_market_cap / maxBondingMC) * 100, 99)
  return Math.round(percentage)
}

// Rate limiting for DexScreener API
const dexScreenerCache = new Map<string, { data: DexScreenerPair | null; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 seconds cache
const REQUEST_DELAY = 100 // 100ms delay between requests

// Helper function to delay execution
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Fetch DexScreener data for a token with caching and rate limiting
async function fetchDexScreenerData(token: TokenTrackerToken, index: number): Promise<DexScreenerPair | null> {
  try {
    // Only fetch DexScreener data for bonded tokens (those with raydium pools)
    if (!token.raydium_pool) {
      return null
    }

    // Check cache first
    const cacheKey = token.raydium_pool
    const cached = dexScreenerCache.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.data
    }

    // Add delay to avoid rate limiting (stagger requests)
    if (index > 0) {
      await delay(REQUEST_DELAY * index)
    }

    // Try to fetch by pair address first (raydium pool)
    let response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${token.raydium_pool}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TokenRadar-DexScreener-Client/1.0'
      },
      cache: 'no-store'
    })

    if (response.ok) {
      const data: DexScreenerResponse = await response.json()
      if (data.pairs && data.pairs.length > 0) {
        const result = data.pairs[0]
        // Cache the result
        dexScreenerCache.set(cacheKey, { data: result, timestamp: Date.now() })
        return result
      }
    }

    // If pair lookup fails, try token address lookup
    await delay(REQUEST_DELAY) // Small delay between requests

    response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token.token_address}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TokenRadar-DexScreener-Client/1.0'
      },
      cache: 'no-store'
    })

    if (response.ok) {
      const data: DexScreenerResponse = await response.json()
      if (data.pairs && data.pairs.length > 0) {
        // Find the Raydium pair if multiple pairs exist
        const raydiumPair = data.pairs.find(pair =>
          pair.dexId === 'raydium' ||
          pair.pairAddress === token.raydium_pool
        )
        const result = raydiumPair || data.pairs[0]
        // Cache the result
        dexScreenerCache.set(cacheKey, { data: result, timestamp: Date.now() })
        return result
      }
    }

    // Cache null result to avoid repeated failed requests
    dexScreenerCache.set(cacheKey, { data: null, timestamp: Date.now() })
    return null
  } catch (error) {
    console.error(`Error fetching DexScreener data for ${token.symbol}:`, error)
    // Cache null result on error
    dexScreenerCache.set(token.raydium_pool || token.token_address, { data: null, timestamp: Date.now() })
    return null
  }
}

// Transform TokenTracker data to frontend format
async function transformToken(token: TokenTrackerToken, index: number = 0): Promise<FrontendToken> {
  const bondedPercentage = calculateBondingPercentage(token)
  const bondedDate = isBonded(token) ? formatTimestamp(token.last_trade_timestamp) : ''

  // Fetch DexScreener data for price changes
  const dexData = await fetchDexScreenerData(token, index)

  // Extract price changes from DexScreener data - only real data, no fake data
  let fiveMin = "N/A"
  let oneHour = "N/A"
  let sixHour = "N/A"
  let twentyFourHour = "N/A"

  if (dexData && dexData.priceChange) {
    // Only show real price changes from DexScreener
    fiveMin = dexData.priceChange.m5 !== undefined ? dexData.priceChange.m5.toFixed(2) : "N/A"
    oneHour = dexData.priceChange.h1 !== undefined ? dexData.priceChange.h1.toFixed(2) : "N/A"
    sixHour = dexData.priceChange.h6 !== undefined ? dexData.priceChange.h6.toFixed(2) : "N/A"
    twentyFourHour = dexData.priceChange.h24 !== undefined ? dexData.priceChange.h24.toFixed(2) : "N/A"
  }
  // For non-bonded tokens, we show "N/A" - no fake data

  return {
    id: token.token_address,
    name: token.name,
    symbol: token.symbol,
    marketCap: formatMarketCap(token.usd_market_cap),
    created: formatTimestamp(token.created_timestamp),
    bonded: bondedDate,
    fiveMin,
    oneHour,
    sixHour,
    twentyFourHour,
    image: token.image_url,
    description: token.description,
    website: token.website,
    twitter: token.twitter,
    telegram: token.telegram,
    contractAddress: token.token_address,
    totalSupply: token.total_supply.toLocaleString(),
    bondedPercentage,
    creator: token.creator,
    virtualSolReserves: token.virtual_sol_reserves,
    virtualTokenReserves: token.virtual_token_reserves,
    bondingCurve: token.bonding_curve,
    associatedBondingCurve: token.associated_bonding_curve,
    lastTradeTimestamp: token.last_trade_timestamp,
    metadataUri: token.metadata_uri
  }
}

export async function GET(request: NextRequest) {
  try {
    // Fetch data from TokenTracker
    const response = await fetch('https://tokentracker-fc80b9e9df85.herokuapp.com/tokens', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TokenRadar-TokenTracker-Client/1.0'
      },
      // Add cache control to ensure fresh data
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`TokenTracker API error: ${response.status} ${response.statusText}`)
    }

    const tokenTrackerData: TokenTrackerToken[] = await response.json()

    // Transform the data to match our frontend format (with DexScreener integration)
    console.log(`Fetching DexScreener data for ${tokenTrackerData.length} tokens...`)
    const transformPromises = tokenTrackerData.map((token, index) => transformToken(token, index))
    const transformedTokens: FrontendToken[] = await Promise.all(transformPromises)

    // Sort by created timestamp (newest first)
    transformedTokens.sort((a, b) => {
      const aTime = tokenTrackerData.find(t => t.token_address === a.id)?.created_timestamp || 0
      const bTime = tokenTrackerData.find(t => t.token_address === b.id)?.created_timestamp || 0
      return bTime - aTime
    })

    console.log(`Successfully processed ${transformedTokens.length} tokens with DexScreener data`)

    return NextResponse.json({
      success: true,
      data: transformedTokens,
      count: transformedTokens.length,
      lastUpdated: new Date().toISOString()
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error: any) {
    console.error('Error fetching tokens from TokenTracker:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch token data',
      error: error.message
    }, { status: 500 })
  }
}
