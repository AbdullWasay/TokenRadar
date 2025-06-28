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

// Token detail response interface
interface TokenDetailResponse {
  id: string
  name: string
  symbol: string
  price: number
  marketCap: number
  change24h: number
  volume24h: number
  launchTime: number
  bondedPercentage: number
  bondedTime?: number
  image: string
  description: string
  website?: string
  twitter?: string
  telegram?: string
  contractAddress: string
  holders?: number
  totalSupply: string
  pairAddress?: string
  liquidity?: number
  fdv?: number
  fiveMin: string
  oneHour: string
  sixHour: string
  twentyFourHour: string
  volume?: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
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

// Helper function to determine if token is bonded (has raydium pool)
function isBonded(token: TokenTrackerToken): boolean {
  return token.raydium_pool !== null
}

// Helper function to calculate bonding percentage
function calculateBondingPercentage(token: TokenTrackerToken): number {
  if (token.raydium_pool) {
    return 100
  }
  
  const maxBondingMC = 100000 // Assume $100K is full bonding threshold
  const percentage = Math.min((token.usd_market_cap / maxBondingMC) * 100, 99)
  return Math.round(percentage)
}

// Fetch DexScreener data for a token
async function fetchDexScreenerData(token: TokenTrackerToken): Promise<DexScreenerPair | null> {
  try {
    if (!token.raydium_pool) {
      return null
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
        return data.pairs[0]
      }
    }

    // If pair lookup fails, try token address lookup
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
        const raydiumPair = data.pairs.find(pair => 
          pair.dexId === 'raydium' || 
          pair.pairAddress === token.raydium_pool
        )
        return raydiumPair || data.pairs[0]
      }
    }

    return null
  } catch (error) {
    console.error(`Error fetching DexScreener data for ${token.symbol}:`, error)
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch all tokens from TokenTracker
    const response = await fetch('https://tokentracker-fc80b9e9df85.herokuapp.com/tokens', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TokenRadar-TokenTracker-Client/1.0'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`TokenTracker API error: ${response.status} ${response.statusText}`)
    }

    const tokenTrackerData: TokenTrackerToken[] = await response.json()

    // Find the specific token by ID (token_address)
    const token = tokenTrackerData.find(t => t.token_address === id)

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Token not found'
      }, { status: 404 })
    }

    // Fetch DexScreener data for this specific token
    const dexData = await fetchDexScreenerData(token)

    // Transform the data
    const bondedPercentage = calculateBondingPercentage(token)
    const price = dexData ? parseFloat(dexData.priceUsd) : 0
    const change24h = dexData?.priceChange?.h24 || 0
    const volume24h = dexData?.volume?.h24 || 0

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

    const tokenDetail: TokenDetailResponse = {
      id: token.token_address,
      name: token.name,
      symbol: token.symbol,
      price: price,
      marketCap: token.usd_market_cap,
      change24h: change24h,
      volume24h: volume24h,
      launchTime: token.created_timestamp,
      bondedPercentage: bondedPercentage,
      bondedTime: isBonded(token) ? token.last_trade_timestamp : undefined,
      image: token.image_url,
      description: token.description,
      website: token.website || undefined,
      twitter: token.twitter || undefined,
      telegram: token.telegram || undefined,
      contractAddress: token.token_address,
      totalSupply: token.total_supply.toLocaleString(),
      pairAddress: token.raydium_pool || undefined,
      liquidity: dexData?.liquidity?.usd,
      fdv: dexData?.fdv,
      fiveMin,
      oneHour,
      sixHour,
      twentyFourHour,
      volume: dexData ? {
        m5: dexData.volume.m5,
        h1: dexData.volume.h1,
        h6: dexData.volume.h6,
        h24: dexData.volume.h24
      } : undefined
    }

    return NextResponse.json({
      success: true,
      data: tokenDetail
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error: any) {
    console.error('Error fetching token details:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch token details',
      error: error.message
    }, { status: 500 })
  }
}
