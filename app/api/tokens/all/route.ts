import { NextRequest, NextResponse } from 'next/server';

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
        // Transform to frontend format using REAL database fields
        const transformedTokens = tokens.map((token: any) => {
          // Use the REAL bonding_percentage from database (no fake calculations!)
          const realBondingPercentage = token.bonding_percentage || 0;

          // Use REAL bonded status from database
          const isBonded = token.complete || token.is_bonded || token.bonding_percentage === 100;

          return {
            id: token.mint,
            name: token.name || 'Unknown Token',
            symbol: token.symbol || 'UNK',
            marketCap: formatMarketCap(token.usd_market_cap || 0), // Use usd_market_cap (the real USD value)
            created: formatTimestamp(token.created_timestamp),
            bonded: isBonded,
            bondedDate: isBonded ? formatTimestamp(token.created_timestamp) : '',
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
        });

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
