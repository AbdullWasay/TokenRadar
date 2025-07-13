import axios from 'axios';
import { NextResponse } from 'next/server';

// Headers and cookies for pump.fun API
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
};

const cookies = {
  '_ga': 'GA1.1.1085779232.1743616310',
  'intercom-id-w7scljv7': 'c042e584-67f0-4653-b79c-e724e4030fa1',
  'intercom-device-id-w7scljv7': '0d5c5a65-93aa-486f-8784-0bd4f1a63cd3',
  'fs_uid': '#o-1YWTMD-na1#34094bea-8456-49bd-b821-968173400217:091b5c8f-9018-43f2-b7f4-abe27606f49d:1745422245728::1#/1767903960',
  '_ga_T65NVS2TQ6': 'GS1.1.1745422266.7.0.1745422266.60.0.0',
  'intercom-session-w7scljv7': '',
};

function getCookieString() {
  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}

function formatMarketCap(marketCap) {
  if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`;
  } else if (marketCap >= 1000) {
    return `$${(marketCap / 1000).toFixed(2)}K`;
  } else {
    return `$${marketCap.toFixed(2)}`;
  }
}

function formatTimestamp(timestamp) {
  // Handle both seconds and milliseconds timestamps
  const timestampMs = timestamp > 1000000000000 ? timestamp : timestamp * 1000;
  const date = new Date(timestampMs);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}

function getBondingPercentage(token) {
  if (token.complete || token.raydium_pool) {
    return 100;
  }

  const marketCap = token.usd_market_cap || 0;
  // Pump.fun bonds at around $69k market cap
  const bondingThreshold = 69000;

  return Math.min(Math.round((marketCap / bondingThreshold) * 100), 99);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const onlyBonded = searchParams.get('bonded') === 'true';

    console.log(`🔍 Fetching REAL pump.fun tokens (search: "${search}", limit: ${limit}, bonded: ${onlyBonded})...`);

    // Parameters for pump.fun API
    const params = {
      offset: '0',
      limit: limit.toString(),
      sort: 'created_timestamp',
      includeNsfw: 'false',
      order: 'DESC',
    };

    // Make the API request to pump.fun
    const response = await axios.get('https://frontend-api.pump.fun/coins', {
      params,
      headers: {
        ...headers,
        'cookie': getCookieString(),
      },
      timeout: 30000,
    });

    if (response.status !== 200) {
      console.error(`❌ API request failed with status: ${response.status}`);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch tokens from pump.fun',
        data: [],
        total: 0
      }, { status: 503 });
    }

    const tokens = response.data;
    
    if (!Array.isArray(tokens)) {
      console.error('❌ API response is not an array:', typeof tokens);
      return NextResponse.json({
        success: false,
        message: 'Invalid response from pump.fun API',
        data: [],
        total: 0
      }, { status: 503 });
    }

    console.log(`📊 Found ${tokens.length} REAL tokens from pump.fun API`);

    // Filter tokens based on criteria
    let filteredTokens = tokens;

    // Filter for bonded tokens if requested
    if (onlyBonded) {
      filteredTokens = tokens.filter(token => token.complete === true || token.raydium_pool);
      console.log(`🎉 Found ${filteredTokens.length} bonded tokens`);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTokens = filteredTokens.filter(token =>
        token.name?.toLowerCase().includes(searchLower) ||
        token.symbol?.toLowerCase().includes(searchLower)
      );
      console.log(`🔍 Found ${filteredTokens.length} tokens matching search "${search}"`);
    }

    // Transform to frontend format
    const transformedTokens = filteredTokens.map(token => ({
      id: token.mint,
      name: token.name || 'Unknown Token',
      symbol: token.symbol || 'UNK',
      marketCap: formatMarketCap(token.usd_market_cap || 0),
      created: formatTimestamp(token.created_timestamp),
      bonded: (token.complete || token.raydium_pool) ? formatTimestamp(token.created_timestamp) : '',
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
      bondedPercentage: getBondingPercentage(token),
      creator: token.creator,
      virtualSolReserves: token.virtual_sol_reserves?.toString() || '0',
      virtualTokenReserves: token.virtual_token_reserves?.toString() || '0',
      dexScreenerUrl: (token.complete || token.raydium_pool) ? `https://dexscreener.com/solana/${token.mint}` : null,
      metadataUri: token.metadataUri,
      complete: token.complete || false,
      raydiumPool: token.raydium_pool,
      source: 'pump-fun-api'
    }));

    return NextResponse.json({
      success: true,
      data: transformedTokens,
      total: transformedTokens.length,
      message: `Found ${transformedTokens.length} real tokens from pump.fun`,
      source: 'pump-fun-api',
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('❌ Error in pump-tokens API:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to fetch tokens from pump.fun',
      error: error.message,
      data: [],
      total: 0
    }, { status: 500 });
  }
}
