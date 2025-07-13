import { NextRequest, NextResponse } from 'next/server'

// DIRECT PUMP.FUN API SCRAPING - NO FAKE DATA
// This endpoint uses the Python-style method to fetch real data directly from pump.fun

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
  // Handle both seconds and milliseconds timestamps
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
    const search = searchParams.get('search') || ''

    console.log(`🔍 Fetching REAL pump.fun tokens directly from API (search: "${search}")...`)

    // DIRECT PUMP.FUN API SCRAPING (Python-style method as requested)
    try {
      // Import axios for direct API calls
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

      // Parameters for pump.fun API (get many tokens, then sort by bonding percentage)
      const params = {
        offset: '0',
        limit: '1000', // Get many more tokens for overview
        sort: 'created_timestamp', // Use timestamp sorting (market cap sorting not supported)
        includeNsfw: 'false',
        order: 'DESC',
      }

      console.log('📡 Making direct request to pump.fun API...')
      
      // Make the API request to pump.fun
      const response = await axios.default.get('https://frontend-api-v3.pump.fun/coins', {
        params,
        headers: {
          ...headers,
          'cookie': cookieString,
        },
        timeout: 30000,
      })

      if (response.status === 200 && Array.isArray(response.data)) {
        const tokens = response.data
        console.log(`📊 Found ${tokens.length} REAL tokens from pump.fun API`)

        // Show ONLY bonded tokens (100% complete) for overview page
        let filteredTokens = tokens.filter(token => token.complete === true)

        console.log(`🎉 Filtered to ${filteredTokens.length} bonded tokens (100% complete) for overview`)

        // If no search, show bonded tokens sorted by creation time (most recent first)
        if (!search) {
          // Sort bonded tokens by creation time (most recent first)
          filteredTokens = filteredTokens.sort((a, b) => {
            return b.created_timestamp - a.created_timestamp
          })

          const bondedCount = filteredTokens.filter(t => t.complete === true || t.raydium_pool).length
          const highProgressCount = filteredTokens.filter(t => {
            if (t.complete === true || t.raydium_pool) return false
            const percentage = Math.min(Math.round((t.usd_market_cap / 69000) * 100), 99)
            return percentage >= 10
          }).length

          console.log(`🎉 Found ${bondedCount} bonded tokens (100% complete)`)
          console.log(`🚀 Found ${highProgressCount} tokens with progress (10%+)`)
          console.log(`📊 Total tokens to show: ${filteredTokens.length} (showing ALL tokens sorted by progress)`)
        }

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase()
          filteredTokens = tokens.filter(token =>
            token.name?.toLowerCase().includes(searchLower) ||
            token.symbol?.toLowerCase().includes(searchLower)
          )
          console.log(`🔍 Found ${filteredTokens.length} tokens matching search "${search}"`)
        }

        // Transform to frontend format
        const transformedTokens = filteredTokens.map(token => {
          const bondingPercentage = token.complete ? 100 : Math.min(Math.round((token.usd_market_cap / 69000) * 100), 99)
          
          return {
            id: token.mint,
            name: token.name || 'Unknown Token',
            symbol: token.symbol || 'UNK',
            marketCap: formatMarketCap(token.usd_market_cap || 0),
            created: formatTimestamp(token.created_timestamp),
            bonded: token.complete || false, // Boolean for dashboard filtering
            bondedDate: token.complete ? formatTimestamp(token.created_timestamp) : '', // Date string for display
            fiveMin: "N/A",
            oneHour: "N/A",
            sixHour: "N/A",
            twentyFourHour: "N/A",
            image: token.image || "",
            description: token.description || '',
            website: token.website,
            twitter: token.twitter,
            telegram: token.telegram,
            contractAddress: token.mint,
            totalSupply: token.total_supply?.toLocaleString() || '1,000,000,000',
            bondedPercentage: bondingPercentage,
            creator: token.creator,
            virtualSolReserves: token.virtual_sol_reserves?.toString() || '0',
            virtualTokenReserves: token.virtual_token_reserves?.toString() || '0',
            dexScreenerUrl: token.complete ? `https://dexscreener.com/solana/${token.mint}` : null,
            metadataUri: token.metadataUri,
            complete: token.complete || false,
            raydiumPool: token.raydium_pool,
            source: 'pump-fun-direct-api'
          }
        })

        return NextResponse.json({
          success: true,
          data: transformedTokens,
          total: transformedTokens.length,
          message: `Found ${transformedTokens.length} REAL tokens from pump.fun (direct API)`,
          source: 'pump-fun-direct-api'
        }, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
      }
    } catch (error) {
      console.error('❌ Error fetching from pump.fun direct API:', error)
    }

    // No real data available - return error (NO FAKE DATA)
    console.log('❌ No real pump.fun data available from direct API')

    return NextResponse.json({
      success: false,
      message: 'Cannot load tokens - no real pump.fun data available. The direct API may be temporarily unavailable.',
      data: [],
      total: 0,
      note: 'This system only shows REAL data from pump.fun - no fake or sample data.'
    }, { status: 503 })

  } catch (error: any) {
    console.error('❌ Error in GET /api/tokens:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch tokens from pump.fun direct API',
      error: error.message,
      note: 'This system only shows REAL data from pump.fun - no fake or sample data.'
    }, { status: 500 })
  }
}
