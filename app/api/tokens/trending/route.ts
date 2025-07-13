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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    console.log(`🔥 Fetching trending bonded tokens (limit: ${limit})...`)

    // DIRECT PUMP.FUN API SCRAPING for trending bonded tokens
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

      console.log('📡 Fetching bonded tokens from pump.fun for trending analysis...')

      // First, get bonded tokens specifically using complete=true parameter
      const bondedResponse = await axios.default.get('https://frontend-api-v3.pump.fun/coins', {
        params: {
          offset: '0',
          limit: '1000', // Get many more bonded tokens
          sort: 'created_timestamp',
          includeNsfw: 'false',
          order: 'DESC',
          complete: 'true', // This is the key parameter to get bonded tokens!
        },
        headers: {
          ...headers,
          'cookie': cookieString,
        },
        timeout: 30000,
      })

      // Also get recent tokens to find near-bonded ones
      const recentResponse = await axios.default.get('https://frontend-api-v3.pump.fun/coins', {
        params: {
          offset: '0',
          limit: '1000', // Get many more recent tokens
          sort: 'created_timestamp', // Use timestamp sorting (market cap sorting not supported)
          includeNsfw: 'false',
          order: 'DESC',
        },
        headers: {
          ...headers,
          'cookie': cookieString,
        },
        timeout: 30000,
      })

      if (bondedResponse.status === 200 && recentResponse.status === 200) {
        const bondedTokens = Array.isArray(bondedResponse.data) ? bondedResponse.data : []
        const recentTokens = Array.isArray(recentResponse.data) ? recentResponse.data : []

        console.log(`📊 Found ${bondedTokens.length} bonded tokens from complete=true API`)
        console.log(`📊 Found ${recentTokens.length} recent tokens for near-bonded analysis`)

        // Filter recent tokens for near-bonded ones (90%+ but not complete)
        const nearBondedTokens = recentTokens.filter(token => {
          if (token.complete === true || token.raydium_pool) return false
          const bondingPercentage = Math.min(Math.round((token.usd_market_cap / 69000) * 100), 99)
          return bondingPercentage >= 90
        })

        // Combine bonded and near-bonded tokens, prioritizing bonded
        let trendingTokens = [...bondedTokens, ...nearBondedTokens]

        // Remove duplicates based on mint address
        const uniqueTokens = trendingTokens.filter((token, index, self) =>
          index === self.findIndex(t => t.mint === token.mint)
        )

        // Sort by creation time (most recent first) and limit
        trendingTokens = uniqueTokens
          .sort((a, b) => b.created_timestamp - a.created_timestamp)
          .slice(0, limit)

        console.log(`🔥 Found ${bondedTokens.length} bonded tokens`)
        console.log(`🚀 Found ${nearBondedTokens.length} near-bonded tokens (90%+)`)
        console.log(`📋 Showing ${trendingTokens.length} trending tokens after deduplication`)

        // Transform to frontend format
        const transformedTokens = trendingTokens.map(token => {
          const bondingPercentage = token.complete ? 100 : Math.min(Math.round((token.usd_market_cap / 69000) * 100), 99)
          
          return {
            id: token.mint,
            name: token.name || 'Unknown Token',
            symbol: token.symbol || 'UNK',
            marketCap: formatMarketCap(token.usd_market_cap || 0),
            created: formatTimestamp(token.created_timestamp),
            bonded: token.complete ? formatTimestamp(token.created_timestamp) : '',
            bondingPercentage,
            complete: token.complete || false,
            raydiumPool: token.raydium_pool,
            description: token.description || '',
            website: token.website,
            twitter: token.twitter,
            telegram: token.telegram,
            image: token.image || "",
            contractAddress: token.mint,
            totalSupply: token.total_supply?.toLocaleString() || '1,000,000,000',
            creator: token.creator,
            virtualSolReserves: token.virtual_sol_reserves?.toString() || '0',
            virtualTokenReserves: token.virtual_token_reserves?.toString() || '0',
            dexScreenerUrl: token.complete ? `https://dexscreener.com/solana/${token.mint}` : null,
            metadataUri: token.metadataUri,
            source: 'pump-fun-direct-api',
            trending: true,
            bondingStatus: token.complete ? 'BONDED' : bondingPercentage >= 90 ? 'NEAR_BONDED' : 'BONDING'
          }
        })

        return NextResponse.json({
          success: true,
          data: transformedTokens,
          total: transformedTokens.length,
          message: `Found ${transformedTokens.length} trending tokens (bonded and near-bonded)`,
          source: 'pump-fun-direct-api',
          stats: {
            bondedCount: bondedTokens.length,
            nearBondedCount: nearBondedTokens.length,
            totalAnalyzed: recentTokens.length + bondedTokens.length
          }
        }, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
      }
    } catch (error) {
      console.error('❌ Error fetching trending tokens from pump.fun direct API:', error)
    }

    // No real data available - return error (NO FAKE DATA)
    console.log('❌ No trending pump.fun data available from direct API')

    return NextResponse.json({
      success: false,
      message: 'Cannot load trending tokens - no real pump.fun data available. The direct API may be temporarily unavailable.',
      data: [],
      total: 0,
      note: 'This system only shows REAL data from pump.fun - no fake or sample data.'
    }, { status: 503 })

  } catch (error: any) {
    console.error('❌ Error in GET /api/tokens/trending:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trending tokens from pump.fun direct API',
      error: error.message,
      note: 'This system only shows REAL data from pump.fun - no fake or sample data.'
    }, { status: 500 })
  }
}
