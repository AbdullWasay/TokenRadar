import { NextRequest, NextResponse } from 'next/server'

// Helper functions for formatting
function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`
  } else if (marketCap >= 1000) {
    return `$${(marketCap / 1000).toFixed(2)}K`
  } else {
    return `$${marketCap.toFixed(2)}`
  }
}

function formatTimestamp(timestamp: number): string {
  const timestampMs = timestamp > 1000000000000 ? timestamp : timestamp * 1000
  const date = new Date(timestampMs)
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })
}

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
  transactions?: Array<{
    type: string
    amount: string
    value: string
    price: string
    timestamp: number
    hash?: string
  }>
}

// Using the formatTimestamp function already declared above

// Helper function to determine if token is bonded (has raydium pool)
function isBonded(token: TokenTrackerToken): boolean {
  return token.raydium_pool !== null
}

// Helper function to generate mock transactions based on DexScreener data
function generateMockTransactions(dexData: DexScreenerPair | null, symbol: string) {
  if (!dexData) return []

  const transactions = []
  const now = Date.now()
  const price = parseFloat(dexData.priceUsd || '0')

  // Generate 5-10 recent transactions based on volume
  const txCount = Math.min(10, Math.max(3, Math.floor((dexData.volume?.h24 || 1000) / 1000)))

  for (let i = 0; i < txCount; i++) {
    const timeAgo = Math.random() * 3600000 * 6 // Random time in last 6 hours
    const isBuy = Math.random() > 0.5
    const amount = (Math.random() * 1000000 + 1000).toFixed(0)
    const value = (parseFloat(amount) * price).toFixed(2)

    transactions.push({
      type: isBuy ? 'buy' : 'sell',
      amount: parseFloat(amount).toLocaleString(),
      value: parseFloat(value).toLocaleString(),
      price: price.toFixed(8),
      timestamp: now - timeAgo,
      hash: `${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`
    })
  }

  // Sort by timestamp (newest first)
  return transactions.sort((a, b) => b.timestamp - a.timestamp)
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
    console.log(`🔍 Fetching DexScreener data for ${token.symbol} (${token.token_address})`)

    // Try to fetch by pair address first (if raydium pool exists)
    if (token.raydium_pool) {
      console.log(`📡 Trying pair lookup: ${token.raydium_pool}`)
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
          console.log(`✅ Found DexScreener data via pair lookup`)
          return data.pairs[0]
        }
      }
    }

    // Always try token address lookup (works for all tokens)
    console.log(`📡 Trying token lookup: ${token.token_address}`)
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token.token_address}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TokenRadar-DexScreener-Client/1.0'
      },
      cache: 'no-store'
    })

    if (response.ok) {
      const data: DexScreenerResponse = await response.json()
      if (data.pairs && data.pairs.length > 0) {
        console.log(`✅ Found ${data.pairs.length} pairs on DexScreener`)

        // Prefer raydium pairs if available
        const raydiumPair = data.pairs.find(pair =>
          pair.dexId === 'raydium' ||
          pair.pairAddress === token.raydium_pool
        )

        const selectedPair = raydiumPair || data.pairs[0]
        console.log(`📊 Using pair: ${selectedPair.dexId} - Price: $${selectedPair.priceUsd}`)

        return selectedPair
      } else {
        console.log(`❌ No pairs found on DexScreener for ${token.symbol}`)
      }
    } else {
      console.log(`❌ DexScreener API error: ${response.status}`)
    }

    return null
  } catch (error) {
    console.error(`❌ Error fetching DexScreener data for ${token.symbol}:`, error)
    return null
  }
}



// Helper function to process pump.fun token
async function processPumpFunToken(token: any): Promise<NextResponse> {
  // Create a mock token object for DexScreener lookup
  const mockToken = {
    token_address: token.mint,
    raydium_pool: token.raydium_pool,
    symbol: token.symbol
  }

  // Fetch DexScreener data
  const dexData = await fetchDexScreenerData(mockToken as any)

  const marketCap = token.usd_market_cap || 0
  const isBonded = token.complete === true || token.raydium_pool !== null
  const bondingPercentage = isBonded ? 100 : Math.min(Math.round((marketCap / 69000) * 100), 99)

  const price = dexData ? parseFloat(dexData.priceUsd) : 0
  const change24h = dexData?.priceChange?.h24 || 0
  const volume24h = dexData?.volume?.h24 || 0

  // Extract price changes from DexScreener data
  let fiveMin = "N/A"
  let oneHour = "N/A"
  let sixHour = "N/A"
  let twentyFourHour = "N/A"

  if (dexData && dexData.priceChange) {
    fiveMin = dexData.priceChange.m5 !== undefined ? dexData.priceChange.m5.toFixed(2) : "N/A"
    oneHour = dexData.priceChange.h1 !== undefined ? dexData.priceChange.h1.toFixed(2) : "N/A"
    sixHour = dexData.priceChange.h6 !== undefined ? dexData.priceChange.h6.toFixed(2) : "N/A"
    twentyFourHour = dexData.priceChange.h24 !== undefined ? dexData.priceChange.h24.toFixed(2) : "N/A"
  }

  const tokenDetail: TokenDetailResponse = {
    id: token.mint,
    name: token.name,
    symbol: token.symbol,
    price: price,
    marketCap: marketCap,
    change24h: change24h,
    volume24h: volume24h,
    launchTime: token.created_timestamp,
    bondedPercentage: bondingPercentage,
    bondedTime: isBonded ? token.created_timestamp : undefined,
    image: "",
    description: token.description || '',
    website: token.website || undefined,
    twitter: token.twitter || undefined,
    telegram: token.telegram || undefined,
    contractAddress: token.mint,
    totalSupply: token.total_supply?.toLocaleString() || '1,000,000,000',
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
    } : undefined,
    transactions: generateMockTransactions(dexData, token.symbol)
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
}

// Helper function to process database token
async function processDatabaseToken(dbToken: any): Promise<NextResponse> {
  console.log(`🔄 Processing database token: ${dbToken.name} (${dbToken.symbol})`)

  // Create a mock token object for DexScreener lookup
  const mockToken = {
    token_address: dbToken.mint,
    raydium_pool: dbToken.raydium_pool,
    symbol: dbToken.symbol
  }

  // Fetch DexScreener data
  console.log(`📡 Fetching DexScreener data for ${dbToken.symbol}...`)
  const dexData = await fetchDexScreenerData(mockToken as any)

  const price = dexData ? parseFloat(dexData.priceUsd) : 0
  const change24h = dexData?.priceChange?.h24 || 0
  const volume24h = dexData?.volume?.h24 || 0

  // Extract price changes from DexScreener data
  let fiveMin = "N/A"
  let oneHour = "N/A"
  let sixHour = "N/A"
  let twentyFourHour = "N/A"

  if (dexData && dexData.priceChange) {
    console.log(`📊 DexScreener price changes for ${dbToken.symbol}:`, dexData.priceChange)
    fiveMin = dexData.priceChange.m5 !== undefined ? dexData.priceChange.m5.toFixed(2) : "N/A"
    oneHour = dexData.priceChange.h1 !== undefined ? dexData.priceChange.h1.toFixed(2) : "N/A"
    sixHour = dexData.priceChange.h6 !== undefined ? dexData.priceChange.h6.toFixed(2) : "N/A"
    twentyFourHour = dexData.priceChange.h24 !== undefined ? dexData.priceChange.h24.toFixed(2) : "N/A"
    console.log(`📈 Formatted price changes: 5m=${fiveMin}, 1h=${oneHour}, 6h=${sixHour}, 24h=${twentyFourHour}`)
  } else {
    console.log(`❌ No DexScreener price change data for ${dbToken.symbol}`)
  }

  const tokenDetail: TokenDetailResponse = {
    id: dbToken.mint,
    name: dbToken.name || 'Unknown Token',
    symbol: dbToken.symbol || 'UNK',
    price: price,
    marketCap: dbToken.usd_market_cap || 0,
    change24h: change24h,
    volume24h: volume24h,
    launchTime: dbToken.created_timestamp,
    bondedPercentage: dbToken.bonding_percentage || 0,
    bondedTime: (dbToken.complete || dbToken.is_bonded) ? dbToken.created_timestamp : undefined,
    image: dbToken.image || "",
    description: dbToken.description || '',
    website: dbToken.website || undefined,
    twitter: dbToken.twitter || undefined,
    telegram: dbToken.telegram || undefined,
    contractAddress: dbToken.mint,
    totalSupply: dbToken.total_supply?.toLocaleString() || '1,000,000,000',
    pairAddress: dbToken.raydium_pool || undefined,
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
    } : undefined,
    transactions: generateMockTransactions(dexData, dbToken.symbol)
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
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // DIRECT PUMP.FUN API SCRAPING for token details
    try {
      const axios = await import('axios')

      // Headers and cookies from the tutorial method
      const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8',
        'content-type': 'application/json',
        'origin': 'https://pump.fun',
        'priority': 'u=1, i',
        'referer': 'https://pump.fun/',
        'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      }

      const cookies = {
        '_ga': 'GA1.1.1085779232.1743616310',
        'intercom-id-w7scljv7': 'c042e584-67f0-4653-b79c-e724e4030fa1',
        'intercom-device-id-w7scljv7': '0d5c5a65-93aa-486f-8784-0bd4f1a63cd3',
        'fs_uid': '#o-1YWTMD-na1#34094bea-8456-49bd-b821-968173400217:091b5c8f-9018-43f2-b7f4-abe27606f49d:1745422245728::1#/1767903960',
        '_ga_T65NVS2TQ6': 'GS1.1.1745422266.7.0.1745422266.60.0.0',
        'intercom-session-w7scljv7': '',
      }

      // Convert cookies to string
      const cookieString = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')

      console.log('📡 Searching for token in pump.fun API...')

      // Search for the specific token in pump.fun API
      const response = await axios.default.get('https://frontend-api-v3.pump.fun/coins', {
        params: {
          offset: '0',
          limit: '100', // Get more tokens to find the specific one
          sort: 'created_timestamp',
          includeNsfw: 'false',
          order: 'DESC',
        },
        headers: {
          ...headers,
          'cookie': cookieString,
        },
        timeout: 30000,
      })

      if (response.status === 200 && Array.isArray(response.data)) {
        const tokens = response.data

        // Find the specific token by mint address
        const token = tokens.find(t => t.mint === id)

        if (token) {
          console.log(`✅ Found token: ${token.name} (${token.symbol})`)
          return await processPumpFunToken(token)
        } else {
          console.log(`❌ Token not found in recent pump.fun data: ${id}`)
        }
      }
    } catch (error) {
      console.error('❌ Error fetching from pump.fun direct API:', error)
    }

    // Check our MongoDB database for the token
    try {
      const { MongoClient } = require('mongodb');
      const client = new MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar');
      await client.connect();

      const db = client.db('TokenRadar');
      const collection = db.collection('Rader');

      console.log(`🔍 Searching for token in database: ${id}`)

      // Find the token by mint address
      const dbToken = await collection.findOne({ mint: id });

      await client.close();

      if (dbToken) {
        console.log(`✅ Found token in database: ${dbToken.name} (${dbToken.symbol})`)
        return await processDatabaseToken(dbToken)
      } else {
        console.log(`❌ Token not found in database: ${id}`)
      }
    } catch (dbError) {
      console.error('Database lookup error:', dbError)
    }

    // Token not found in any real data source
    return NextResponse.json({
      success: false,
      message: 'Token not found'
    }, { status: 404 })

  } catch (error: any) {
    console.error('Error fetching token details:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to fetch token details',
      error: error.message
    }, { status: 500 })
  }
}
