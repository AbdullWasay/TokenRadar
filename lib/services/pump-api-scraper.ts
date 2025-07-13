// Direct pump.fun API scraper using the method from the tutorial
import dbConnect from '@/lib/mongodb';
import axios, { AxiosResponse } from 'axios';

export interface PumpFunToken {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  created_timestamp: number;
  usd_market_cap: number;
  reply_count: number;
  last_reply: number;
  nsfw: boolean;
  market_cap: number;
  complete: boolean;
  total_supply: number;
  website?: string;
  twitter?: string;
  telegram?: string;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator: string;
  metadataUri: string;
  raydium_pool?: string;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  show_name: boolean;
  is_currently_live: boolean;
}

let isScrapingActive = false;
let scrapingInterval: NodeJS.Timeout | null = null;
let autoStartAttempted = false;

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
};

// Cookies from the tutorial (these may need to be updated periodically)
const cookies = {
  '_ga': 'GA1.1.1085779232.1743616310',
  'intercom-id-w7scljv7': 'c042e584-67f0-4653-b79c-e724e4030fa1',
  'intercom-device-id-w7scljv7': '0d5c5a65-93aa-486f-8784-0bd4f1a63cd3',
  'fs_uid': '#o-1YWTMD-na1#34094bea-8456-49bd-b821-968173400217:091b5c8f-9018-43f2-b7f4-abe27606f49d:1745422245728::1#/1767903960',
  '_ga_T65NVS2TQ6': 'GS1.1.1745422266.7.0.1745422266.60.0.0',
  'intercom-session-w7scljv7': '',
};

// Convert cookies object to cookie string
function getCookieString(): string {
  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}

export async function startContinuousAPIScraping() {
  if (isScrapingActive) {
    console.log('⚠️ API Scraping is already active');
    return;
  }

  console.log('🚀 Starting continuous pump.fun API scraping (REAL DATA ONLY)...');
  isScrapingActive = true;

  // Initial scrape
  await scrapePumpFunAPI();

  // Set up continuous scraping every 15 seconds
  scrapingInterval = setInterval(async () => {
    try {
      await scrapePumpFunAPI();
    } catch (error) {
      console.error('❌ Error in continuous API scraping:', error);
    }
  }, 15000); // 15 seconds

  console.log('✅ Continuous API scraping started (every 15 seconds)');
}

export function stopContinuousAPIScraping() {
  if (scrapingInterval) {
    clearInterval(scrapingInterval);
    scrapingInterval = null;
  }
  isScrapingActive = false;
  console.log('🛑 Continuous API scraping stopped');
}

export async function scrapePumpFunAPI(): Promise<PumpFunToken[]> {
  console.log('🔍 Fetching pump.fun tokens via API...');
  
  try {
    // Parameters from the tutorial
    const params = {
      offset: '0',
      limit: '48',
      sort: 'created_timestamp',
      includeNsfw: 'false',
      order: 'DESC',
    };

    // Make the API request
    const response: AxiosResponse = await axios.get('https://frontend-api-v3.pump.fun/coins', {
      params,
      headers: {
        ...headers,
        'cookie': getCookieString(),
      },
      timeout: 30000, // 30 second timeout
    });

    if (response.status !== 200) {
      console.error(`❌ API request failed with status: ${response.status}`);
      return [];
    }

    const tokens = response.data;
    
    if (!Array.isArray(tokens)) {
      console.error('❌ API response is not an array:', typeof tokens);
      return [];
    }

    console.log(`📊 Found ${tokens.length} REAL tokens from pump.fun API`);

    // Validate and filter tokens
    const validTokens = tokens.filter(token => {
      return token.mint && 
             token.mint.length >= 32 && 
             token.name && 
             token.symbol;
    });

    console.log(`✅ ${validTokens.length} valid tokens after filtering`);

    // Save to database
    if (validTokens.length > 0) {
      await saveTokensToDatabase(validTokens);
    } else {
      console.log('⚠️ No valid tokens found - not saving any data');
    }

    return validTokens;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Axios error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    } else {
      console.error('❌ Error fetching pump.fun API:', error);
    }
    return [];
  }
}

// Also fetch bonded tokens specifically
export async function scrapeBondedTokensAPI(): Promise<PumpFunToken[]> {
  console.log('🔍 Fetching bonded tokens via API...');
  
  try {
    const params = {
      offset: '0',
      limit: '50',
      sort: 'created_timestamp',
      includeNsfw: 'false',
      order: 'DESC',
      // Filter for bonded tokens only - this is the key parameter!
      complete: 'true',
    };

    const response: AxiosResponse = await axios.get('https://frontend-api-v3.pump.fun/coins', {
      params,
      headers: {
        ...headers,
        'cookie': getCookieString(),
      },
      timeout: 30000,
    });

    if (response.status !== 200) {
      console.error(`❌ Bonded tokens API request failed with status: ${response.status}`);
      return [];
    }

    const tokens = response.data;
    
    if (!Array.isArray(tokens)) {
      console.error('❌ Bonded tokens API response is not an array:', typeof tokens);
      return [];
    }

    // Filter for only bonded tokens
    const bondedTokens = tokens.filter(token => {
      return token.mint && 
             token.mint.length >= 32 && 
             token.name && 
             token.symbol &&
             (token.complete === true || token.raydium_pool);
    });

    console.log(`🎉 Found ${bondedTokens.length} bonded tokens from API`);

    return bondedTokens;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Bonded tokens Axios error:', error.message);
    } else {
      console.error('❌ Error fetching bonded tokens API:', error);
    }
    return [];
  }
}

async function saveTokensToDatabase(tokens: any[]) {
  try {
    await dbConnect();
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    const collection = db.collection('tokens');
    const bondedCollection = db.collection('bonded_tokens');

    let newlyBondedCount = 0;

    for (const token of tokens) {
      // Only process REAL tokens with valid mint addresses
      if (!token.mint || token.mint.length < 32) {
        console.log('⚠️ Skipping invalid token (no valid mint address)');
        continue;
      }

      // Check if token is bonded (100% complete)
      const isBonded = token.complete === true || token.raydium_pool !== null;
      const marketCap = token.usd_market_cap || 0;
      const bondingPercentage = isBonded ? 100 : Math.min(Math.round((marketCap / 69000) * 100), 99);

      // Create token document (REAL DATA ONLY)
      const tokenDoc = {
        mint: token.mint,
        name: token.name || 'Unknown Token',
        symbol: token.symbol || 'UNK',
        description: token.description || '',
        image: token.image || '',
        created_timestamp: token.created_timestamp || Math.floor(Date.now() / 1000),
        usd_market_cap: marketCap,
        reply_count: token.reply_count || 0,
        last_reply: token.last_reply || Math.floor(Date.now() / 1000),
        nsfw: token.nsfw || false,
        market_cap: token.market_cap || marketCap,
        complete: isBonded,
        total_supply: token.total_supply || 1000000000,
        website: token.website,
        twitter: token.twitter,
        telegram: token.telegram,
        bonding_curve: token.bonding_curve || '',
        associated_bonding_curve: token.associated_bonding_curve || '',
        creator: token.creator || '',
        metadataUri: token.metadataUri || '',
        raydium_pool: token.raydium_pool,
        virtual_sol_reserves: token.virtual_sol_reserves || 0,
        virtual_token_reserves: token.virtual_token_reserves || 0,
        show_name: token.show_name !== false,
        is_currently_live: token.is_currently_live || false,
        bonding_percentage: bondingPercentage,
        scraped_at: new Date(),
        updated_at: new Date()
      };

      // Check if this token was previously not bonded but is now bonded
      const existingToken = await collection.findOne({ mint: tokenDoc.mint });
      const wasNotBonded = existingToken && !existingToken.complete;
      const isNowBonded = isBonded;

      // If token just reached 100% bonding, add to bonded collection
      if (isNowBonded && (!existingToken || wasNotBonded)) {
        const bondedTokenDoc = {
          ...tokenDoc,
          bonded_at: new Date(),
          bonded_timestamp: Math.floor(Date.now() / 1000),
          was_newly_bonded: true
        };

        // Save to bonded tokens collection
        await bondedCollection.updateOne(
          { mint: tokenDoc.mint },
          { 
            $set: bondedTokenDoc,
            $setOnInsert: { first_bonded: new Date() }
          },
          { upsert: true }
        );

        newlyBondedCount++;
        console.log(`🎉 NEW BONDED TOKEN: ${tokenDoc.name} (${tokenDoc.symbol}) - Market Cap: $${marketCap}`);
      }

      // Upsert token in main collection
      await collection.updateOne(
        { mint: tokenDoc.mint },
        { 
          $set: tokenDoc,
          $setOnInsert: { first_seen: new Date() }
        },
        { upsert: true }
      );
    }

    console.log(`💾 Saved ${tokens.length} REAL tokens to database via API`);
    if (newlyBondedCount > 0) {
      console.log(`🚀 ${newlyBondedCount} tokens just reached 100% bonding!`);
    }
  } catch (error) {
    console.error('❌ Error saving API tokens to database:', error);
  }
}

// Get tokens from database (REAL DATA ONLY)
export async function getTokensFromAPIDatabase(limit: number = 50): Promise<any[]> {
  // Auto-start scraper if needed
  await autoStartAPIIfNeeded();

  try {
    await dbConnect();
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const collection = db.collection('tokens');

    const tokens = await collection
      .find({})
      .sort({ scraped_at: -1 })
      .limit(limit)
      .toArray();

    return tokens;
  } catch (error) {
    console.error('❌ Error fetching API tokens from database:', error);
    return [];
  }
}

// Get newly bonded tokens (100% bonded) - REAL DATA ONLY
export async function getNewlyBondedAPITokens(limit: number = 50): Promise<any[]> {
  // Auto-start scraper if needed
  await autoStartAPIIfNeeded();

  try {
    await dbConnect();
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const bondedCollection = db.collection('bonded_tokens');

    const bondedTokens = await bondedCollection
      .find({ complete: true })
      .sort({ bonded_at: -1 })
      .limit(limit)
      .toArray();

    return bondedTokens;
  } catch (error) {
    console.error('❌ Error fetching API bonded tokens from database:', error);
    return [];
  }
}

// Get tokens that just bonded in the last X minutes - REAL DATA ONLY
export async function getRecentlyBondedAPITokens(minutesAgo: number = 60): Promise<any[]> {
  // Auto-start scraper if needed
  await autoStartAPIIfNeeded();

  try {
    await dbConnect();
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const bondedCollection = db.collection('bonded_tokens');

    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);

    const recentlyBonded = await bondedCollection
      .find({
        bonded_at: { $gte: cutoffTime },
        complete: true
      })
      .sort({ bonded_at: -1 })
      .toArray();

    return recentlyBonded;
  } catch (error) {
    console.error('❌ Error fetching recently bonded API tokens:', error);
    return [];
  }
}

export function filterBondedAPITokens(tokens: any[]): any[] {
  return tokens.filter(token => {
    const marketCap = token.usd_market_cap || 0;
    const isBonded = token.complete === true || token.raydium_pool !== null;
    const isAlmostBonded = marketCap >= 50000; // Almost bonded threshold

    return isBonded || isAlmostBonded;
  });
}

export function getBondingAPIPercentage(token: any): number {
  if (token.complete || token.raydium_pool) {
    return 100;
  }

  const marketCap = token.usd_market_cap || 0;
  // Pump.fun bonds at around $69k market cap
  const bondingThreshold = 69000;

  return Math.min(Math.round((marketCap / bondingThreshold) * 100), 99);
}

// Start Python scraper for bonded and recent tokens
export async function startPythonScraper() {
  console.log('🐍 Starting Python scraper for bonded and recent tokens...');

  try {
    const { spawn } = require('child_process');

    // Scrape bonded tokens
    console.log('📡 Scraping bonded tokens...');
    const bondedProcess = spawn('python', ['pump_scraper_mongodb.py', 'bonded', '50'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    bondedProcess.stdout.on('data', (data: Buffer) => {
      console.log(`🐍 Bonded: ${data.toString().trim()}`);
    });

    bondedProcess.stderr.on('data', (data: Buffer) => {
      console.error(`🐍 Bonded Error: ${data.toString().trim()}`);
    });

    // Scrape recent tokens
    console.log('📡 Scraping recent tokens...');
    const recentProcess = spawn('python', ['pump_scraper_mongodb.py', 'recent', '100'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    recentProcess.stdout.on('data', (data: Buffer) => {
      console.log(`🐍 Recent: ${data.toString().trim()}`);
    });

    recentProcess.stderr.on('data', (data: Buffer) => {
      console.error(`🐍 Recent Error: ${data.toString().trim()}`);
    });

    console.log('✅ Python scraper processes started');

  } catch (error) {
    console.error('❌ Error starting Python scraper:', error);
    throw error;
  }
}

// Auto-start scraper when any function is called (NOW USING PYTHON SCRAPER)
export async function autoStartAPIIfNeeded() {
  if (!autoStartAttempted && !isScrapingActive) {
    autoStartAttempted = true;
    console.log('🚀 Auto-starting pump.fun Python scraper...');

    try {
      await startPythonScraper();
      console.log('✅ Pump.fun Python scraper auto-started successfully!');
    } catch (error) {
      console.error('❌ Failed to auto-start Python scraper:', error);
    }
  }
}

// Test function to verify API connection
export async function testPumpFunAPI(): Promise<boolean> {
  console.log('🧪 Testing pump.fun API connection...');

  try {
    const tokens = await scrapePumpFunAPI();
    if (tokens.length > 0) {
      console.log(`✅ API test successful! Found ${tokens.length} tokens`);
      return true;
    } else {
      console.log('⚠️ API test returned no tokens');
      return false;
    }
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
}
