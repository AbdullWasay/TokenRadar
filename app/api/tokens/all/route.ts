import { NextRequest, NextResponse } from 'next/server';

// DexScreener API integration
interface DexScreenerPair {
  priceChange?: {
    m5?: number
    h1?: number
    h6?: number
    h24?: number
  }
  priceUsd?: string
}

interface DexScreenerResponse {
  pairs: DexScreenerPair[] | null
}

async function fetchDexScreenerData(tokenAddress: string): Promise<DexScreenerPair | null> {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TokenRadar-DexScreener-Client/1.0'
      },
      cache: 'no-store'
    })

    if (response.ok) {
      const data: DexScreenerResponse = await response.json()
      if (data.pairs && data.pairs.length > 0) {
        return data.pairs[0] // Return the first pair
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching DexScreener data:', error)
    return null
  }
}

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

// Helper function to format timestamp to actual date
function formatTimestamp(timestamp: number): string {
  if (!timestamp) return 'Unknown';

  try {
    // The database stores timestamps in milliseconds (like 1752362374340)
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Unknown';
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '1000');
    const sortBy = searchParams.get('sortBy') || 'created'; // created, marketCap, bonding, name
    const showBondedOnly = searchParams.get('bondedOnly') === 'true';

    console.log(`🔍 Fetching tokens from MongoDB (search: "${search}", limit: ${limit}, sortBy: ${sortBy}, bondedOnly: ${showBondedOnly})...`);

    // Get tokens from MongoDB (our scraped data)
    try {
      const { MongoClient } = require('mongodb');
      const client = new MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar');
      await client.connect();

      const db = client.db('TokenRadar');
      const collection = db.collection('Rader');

      // Build query
      let query: any = {};
      
      if (showBondedOnly) {
        // Only bonded tokens (100% complete) - try multiple fields
        query = {
          $or: [
            { complete: true },
            { is_bonded: true },
            { bonding_percentage: 100 }
          ]
        };
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        query.$or = [
          { name: { $regex: searchLower, $options: 'i' } },
          { symbol: { $regex: searchLower, $options: 'i' } }
        ];
      }

      // Get tokens from MongoDB
      let sort: any = { created_timestamp: -1 }; // Default: newest first
      
      switch (sortBy) {
        case 'marketCap':
          sort = { usd_market_cap: -1 };
          break;
        case 'bonding':
          sort = { complete: -1, usd_market_cap: -1 };
          break;
        case 'name':
          sort = { name: 1 };
          break;
      }

      const tokens = await collection
        .find(query)
        .sort(sort)
        .limit(limit)
        .toArray();

      console.log(`📊 Found ${tokens.length} tokens from MongoDB (bondedOnly: ${showBondedOnly})`);

      await client.close();

      if (tokens.length > 0) {
        // Transform to frontend format with DexScreener data for first 20 tokens
        const transformedTokens = await Promise.all(
          tokens.map(async (token: any, index: number) => {
            // Use the REAL bonding_percentage from database (no fake calculations!)
            const realBondingPercentage = token.bonding_percentage || 0;

            // Use REAL bonded status from database
            const isBonded = token.complete || token.is_bonded || token.bonding_percentage === 100;

            // Fetch DexScreener data for first 20 tokens to improve performance
            let dexData = null
            if (index < 20) {
              dexData = await fetchDexScreenerData(token.mint)
            }

            return {
              id: token.mint,
              name: token.name || 'Unknown Token',
              symbol: token.symbol || 'UNK',
              marketCap: formatMarketCap(token.usd_market_cap || 0), // Use usd_market_cap (the real USD value)
              created: formatTimestamp(token.created_timestamp),
              bonded: isBonded,
              bondedDate: isBonded ? formatTimestamp(token.created_timestamp) : '',
              bondedAt: isBonded ? new Date(token.created_timestamp * 1000).toISOString() : null,
              bondedTimestamp: isBonded ? token.created_timestamp * 1000 : null,
              fiveMin: dexData?.priceChange?.m5 !== undefined ? dexData.priceChange.m5.toFixed(2) : "N/A",
              oneHour: dexData?.priceChange?.h1 !== undefined ? dexData.priceChange.h1.toFixed(2) : "N/A",
              sixHour: dexData?.priceChange?.h6 !== undefined ? dexData.priceChange.h6.toFixed(2) : "N/A",
              twentyFourHour: dexData?.priceChange?.h24 !== undefined ? dexData.priceChange.h24.toFixed(2) : "N/A",
              image: token.image || "",
              description: token.description || '',
              website: token.website,
              twitter: token.twitter,
              telegram: token.telegram,
            contractAddress: token.mint,
            totalSupply: token.total_supply?.toLocaleString() || '1,000,000,000',
            bondedPercentage: realBondingPercentage, // REAL bonding percentage from database
            creator: token.creator,
            virtualSolReserves: token.virtual_sol_reserves?.toString() || '0',
            virtualTokenReserves: token.virtual_token_reserves?.toString() || '0',
            dexScreenerUrl: isBonded ? `https://dexscreener.com/solana/${token.mint}` : null,
            metadataUri: token.metadataUri || token.metadata_uri,
            complete: isBonded,
            raydiumPool: token.raydium_pool,
            source: 'mongodb'
          };
        })
        );

        return NextResponse.json({
          success: true,
          data: transformedTokens,
          total: transformedTokens.length,
          message: `Found ${transformedTokens.length} tokens from MongoDB`,
          source: 'mongodb'
        }, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }
    } catch (dbError) {
      console.error('❌ Error fetching from MongoDB:', dbError);
    }

    // No real data available
    console.log('❌ No tokens available from MongoDB');

    return NextResponse.json({
      success: false,
      message: 'No tokens available. Start the scraper to collect real data from pump.fun.',
      data: [],
      total: 0,
      note: 'This system only shows real data from pump.fun - no fake or sample data.'
    }, { status: 503 });

  } catch (error) {
    console.error('Error in tokens API:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      data: [],
      total: 0
    }, { status: 500 });
  }
}
