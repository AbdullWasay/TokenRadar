import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    
    console.log(`📊 Fetching tokens from MongoDB (limit: ${limit}, search: "${search}")`);
    
    // Connect to MongoDB
    const dbConnect = await import('@/lib/mongodb');
    await dbConnect.default();
    
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const collection = db.collection('Rader'); // Using the correct collection name
    
    // Build query
    let query: any = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { symbol: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Fetch tokens
    const tokens = await collection
      .find(query)
      .sort({ created_timestamp: -1 })
      .limit(limit)
      .toArray();
    
    console.log(`📊 Retrieved ${tokens.length} tokens from MongoDB`);
    
    // Transform tokens to frontend format
    const transformedTokens = tokens.map((token: any) => {
      const bondingPercentage = token.complete ? 100 : Math.min(Math.round((token.usd_market_cap / 69000) * 100), 99);
      
      return {
        id: token.mint,
        name: token.name,
        symbol: token.symbol,
        marketCap: formatMarketCap(token.usd_market_cap),
        created: formatTimestamp(token.created_timestamp),
        bonded: token.complete ? formatTimestamp(token.created_timestamp) : '',
        fiveMin: "N/A",
        oneHour: "N/A", 
        sixHour: "N/A",
        twentyFourHour: "N/A",
        image: token.image || "",
        description: token.description || "",
        website: token.website || "",
        twitter: token.twitter || "",
        telegram: token.telegram || "",
        contractAddress: token.mint,
        totalSupply: token.total_supply?.toLocaleString() || "0",
        bondedPercentage: bondingPercentage,
        creator: token.creator,
        virtualSolReserves: token.virtual_sol_reserves?.toString() || "0",
        virtualTokenReserves: token.virtual_token_reserves?.toString() || "0",
        dexScreenerUrl: token.complete ? `https://dexscreener.com/solana/${token.mint}` : null,
        metadataUri: token.metadataUri || "",
        isComplete: token.complete || false,
        hasRaydiumPool: !!token.raydium_pool
      };
    });
    
    return NextResponse.json({
      success: true,
      data: transformedTokens,
      total: transformedTokens.length,
      message: `Found ${transformedTokens.length} tokens from MongoDB`,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('❌ MongoDB tokens API error:', error);
    
    return NextResponse.json({
      success: false,
      message: `MongoDB error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: [],
      total: 0,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Helper functions
function formatMarketCap(marketCap: number): string {
  if (!marketCap) return '$0';
  if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`;
  } else if (marketCap >= 1000) {
    return `$${(marketCap / 1000).toFixed(2)}K`;
  } else {
    return `$${marketCap.toFixed(2)}`;
  }
}

function formatTimestamp(timestamp: number): string {
  if (!timestamp) return '';
  const timestampMs = timestamp > 1000000000000 ? timestamp : timestamp * 1000;
  const date = new Date(timestampMs);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}

export async function POST(request: NextRequest) {
  return GET(request); // Allow both GET and POST
}
