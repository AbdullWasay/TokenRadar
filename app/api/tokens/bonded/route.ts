import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '1000'); // Get many more bonded tokens
    const minutesAgo = parseInt(searchParams.get('minutes') || '60');

    console.log(`🎯 Fetching newly bonded tokens (last ${minutesAgo} minutes, search: "${search}")...`);

    // Helper function to format market cap
    function formatMarketCap(marketCap: number): string {
      if (marketCap >= 1000000) {
        return `$${(marketCap / 1000000).toFixed(2)}M`;
      } else if (marketCap >= 1000) {
        return `$${(marketCap / 1000).toFixed(2)}K`;
      } else {
        return `$${marketCap.toFixed(2)}`;
      }
    }

    // Helper function to format timestamp to date string
    function formatTimestamp(timestamp: number): string {
      // Handle both seconds and milliseconds timestamps
      const timestampMs = timestamp > 1000000000000 ? timestamp : timestamp * 1000;
      const date = new Date(timestampMs);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    }

    // Helper function to format time
    function formatTime(date: Date): string {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }

    // DIRECT PUMP.FUN API SCRAPING for bonded tokens
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

      console.log('📡 Fetching bonded tokens from pump.fun API...')

      // Get ALL bonded tokens (no limit) using complete=true parameter
      const response = await axios.default.get('https://frontend-api-v3.pump.fun/coins', {
        params: {
          offset: '0',
          limit: '1000', // Get many more bonded tokens instead of using limit parameter
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

      if (response.status === 200 && Array.isArray(response.data)) {
        const bondedTokens = response.data
        console.log(`📊 Found ${bondedTokens.length} bonded tokens from complete=true API`)

        // All tokens should be bonded since we used complete=true, but verify
        const verifiedBondedTokens = bondedTokens.filter(token =>
          token.complete === true || token.raydium_pool
        )

        console.log(`🎉 Verified ${verifiedBondedTokens.length} bonded tokens`)

        // Filter by time frame (minutes ago)
        const cutoffTime = Date.now() - (minutesAgo * 60 * 1000); // Convert minutes to milliseconds
        const timeFilteredTokens = verifiedBondedTokens.filter(token => {
          const tokenTime = token.created_timestamp * 1000; // Convert to milliseconds
          return tokenTime >= cutoffTime;
        });

        console.log(`⏰ Filtered to ${timeFilteredTokens.length} tokens bonded in last ${minutesAgo} minutes`)

        // Use time-filtered bonded tokens
        let tokensToShow = timeFilteredTokens

        // Since we're using complete=true, we should always have bonded tokens
        // But if somehow we don't, show the available tokens
        if (tokensToShow.length === 0) {
          tokensToShow = bondedTokens
            .sort((a, b) => (b.usd_market_cap || 0) - (a.usd_market_cap || 0))
            .slice(0, limit)
        }

        // Sort by bonding percentage (highest first)
        tokensToShow.sort((a, b) => {
          const aPercentage = a.complete ? 100 : Math.min(Math.round((a.usd_market_cap / 69000) * 100), 99)
          const bPercentage = b.complete ? 100 : Math.min(Math.round((b.usd_market_cap / 69000) * 100), 99)
          return bPercentage - aPercentage
        })

        console.log(`🎉 Found ${bondedTokens.length} bonded tokens (100% complete)`)
        console.log(`📊 Total tokens to show: ${tokensToShow.length}`)

        // Transform to frontend format
        const transformedTokens = tokensToShow.map(token => {
          const bondingPercentage = token.complete ? 100 : Math.min(Math.round((token.usd_market_cap / 69000) * 100), 99)

          return {
            id: token.mint,
            name: token.name || 'Unknown Token',
            symbol: token.symbol || 'UNK',
            marketCap: formatMarketCap(token.usd_market_cap || 0),
            created: formatTimestamp(token.created_timestamp),
            bonded: token.complete ? formatTimestamp(token.created_timestamp) : '',
            bondedAt: token.complete ? formatTime(new Date(token.created_timestamp * 1000)) : 'Not bonded',
            bondedTimestamp: token.complete ? token.created_timestamp : null,
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
            raydiumPool: token.raydium_pool,
            wasNewlyBonded: token.complete || false,
            minutesAgoBonded: token.complete ? Math.round((Date.now() - (token.created_timestamp * 1000)) / (1000 * 60)) : null,
            source: 'pump-fun-direct-api',
            complete: token.complete || false,
            bondingStatus: token.complete ? 'BONDED' : bondingPercentage >= 90 ? 'NEAR_BONDED' : 'BONDING'
          }
        })

        // Apply search filter
        let filteredTokens = transformedTokens
        if (search) {
          const searchLower = search.toLowerCase()
          filteredTokens = transformedTokens.filter(token =>
            token.name.toLowerCase().includes(searchLower) ||
            token.symbol.toLowerCase().includes(searchLower)
          )
        }

        // Sort by bonded time (most recent first)
        filteredTokens.sort((a, b) => {
          if (!a.bondedTimestamp || !b.bondedTimestamp) return 0
          return b.bondedTimestamp - a.bondedTimestamp
        })

        return NextResponse.json({
          success: true,
          data: filteredTokens,
          total: filteredTokens.length,
          message: bondedTokens.length > 0
            ? `Found ${filteredTokens.length} bonded and near-bonded tokens from pump.fun`
            : `Found ${filteredTokens.length} high-progress tokens from pump.fun`,
          timeFrame: `${minutesAgo} minutes`,
          isRecent: true,
          source: 'pump-fun-direct-api',
          stats: {
            bondedCount: bondedTokens.length,
            totalAnalyzed: bondedTokens.length
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
      console.error('❌ Error fetching bonded tokens from pump.fun direct API:', error)
    }

    // No real data available - return error (NO FAKE DATA)
    console.log('❌ No bonded pump.fun data available from direct API')

    return NextResponse.json({
      success: false,
      message: 'Cannot load bonded tokens - no real pump.fun data available. The direct API may be temporarily unavailable.',
      data: [],
      total: 0,
      note: 'This system only shows REAL data from pump.fun - no fake or sample data.'
    }, { status: 503 })

  } catch (error: any) {
    console.error('❌ Error in /api/tokens/bonded:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to fetch bonded tokens from pump.fun direct API',
      error: error.message,
      data: [],
      total: 0,
      note: 'This system only shows REAL data from pump.fun - no fake or sample data.'
    }, { status: 500 })
  }
}
