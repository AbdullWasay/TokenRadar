import { BondedToken } from '../models/bonded-token'
import dbConnect from '../mongodb'

// Pump.fun API interface
interface PumpFunCoin {
  mint: string
  name: string
  symbol: string
  description: string
  image_uri: string
  metadata_uri: string
  twitter: string | null
  telegram: string | null
  bonding_curve: string
  associated_bonding_curve: string
  creator: string
  created_timestamp: number
  raydium_pool: string | null
  complete: boolean
  virtual_sol_reserves: number
  virtual_token_reserves: number
  total_supply: number
  website: string | null
  show_name: boolean
  king_of_the_hill_timestamp: number | null
  market_cap: number
  reply_count: number
  last_reply: number
  nsfw: boolean
  market_id: number | null
  inverted: boolean | null
  is_currently_live: boolean
  username: string | null
  profile_image: string | null
  usd_market_cap: number
}

// Calculate bonding percentage based on virtual reserves
function calculateBondingPercentage(coin: PumpFunCoin): number {
  if (coin.complete || coin.raydium_pool) {
    return 100
  }
  
  // Pump.fun bonding curve calculation
  // When virtual_sol_reserves reaches ~85 SOL, the token bonds
  const TARGET_SOL_FOR_BONDING = 85
  const currentSol = coin.virtual_sol_reserves / 1e9 // Convert lamports to SOL
  const percentage = Math.min((currentSol / TARGET_SOL_FOR_BONDING) * 100, 100)
  
  return Math.round(percentage * 100) / 100 // Round to 2 decimal places
}

// Check if token should be tracked (bonded or almost bonded)
function shouldTrackToken(coin: PumpFunCoin): boolean {
  const bondingPercentage = calculateBondingPercentage(coin)
  
  // Track if:
  // 1. Token is 100% bonded (complete or has raydium pool)
  // 2. Token is 80%+ bonded (almost bonded)
  return coin.complete || coin.raydium_pool !== null || bondingPercentage >= 80
}

// Fetch latest coins from pump.fun
async function fetchPumpFunCoins(): Promise<PumpFunCoin[]> {
  try {
    // Try multiple endpoints to find working one
    const endpoints = [
      'https://frontend-api.pump.fun/coins?offset=0&limit=100&sort=created_timestamp&order=DESC&includeNsfw=false',
      'https://api.pump.fun/coins?offset=0&limit=100&sort=created_timestamp&order=DESC&includeNsfw=false',
      'https://pump.fun/api/coins?offset=0&limit=100&sort=created_timestamp&order=DESC&includeNsfw=false'
    ]
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Trying pump.fun endpoint: ${endpoint}`)
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'TokenRadar-BondMonitor/1.0',
            'Referer': 'https://pump.fun',
            'Origin': 'https://pump.fun'
          },
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log(`✅ Successfully fetched ${data.length} coins from pump.fun`)
          return data
        } else {
          console.log(`❌ Endpoint failed: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.log(`❌ Endpoint error: ${error}`)
        continue
      }
    }
    
    throw new Error('All pump.fun endpoints failed')
  } catch (error) {
    console.error('Error fetching pump.fun coins:', error)
    return []
  }
}

// Save or update bonded token in database
async function saveBondedToken(coin: PumpFunCoin): Promise<void> {
  try {
    await dbConnect()
    
    const bondingPercentage = calculateBondingPercentage(coin)
    const isBonded = coin.complete || coin.raydium_pool !== null
    const bondedTimestamp = isBonded ? Date.now() : coin.created_timestamp
    
    const tokenData = {
      mint: coin.mint,
      name: coin.name,
      symbol: coin.symbol,
      description: coin.description,
      image_uri: coin.image_uri,
      metadata_uri: coin.metadata_uri,
      twitter: coin.twitter,
      telegram: coin.telegram,
      bonding_curve: coin.bonding_curve,
      associated_bonding_curve: coin.associated_bonding_curve,
      creator: coin.creator,
      created_timestamp: coin.created_timestamp,
      bonded_timestamp: bondedTimestamp,
      raydium_pool: coin.raydium_pool,
      virtual_sol_reserves: coin.virtual_sol_reserves,
      virtual_token_reserves: coin.virtual_token_reserves,
      total_supply: coin.total_supply,
      website: coin.website,
      usd_market_cap: coin.usd_market_cap,
      bonding_percentage: bondingPercentage,
      is_bonded: isBonded,
      last_updated: Date.now()
    }
    
    // Upsert token (update if exists, create if not)
    await BondedToken.findOneAndUpdate(
      { mint: coin.mint },
      tokenData,
      { upsert: true, new: true }
    )
    
    console.log(`💾 Saved token: ${coin.symbol} (${bondingPercentage}% bonded)`)
  } catch (error) {
    console.error(`Error saving token ${coin.symbol}:`, error)
  }
}

// Main monitoring function
export async function monitorPumpFunBonding(): Promise<void> {
  console.log('🚀 Starting pump.fun bonding monitor...')
  
  try {
    // Fetch latest coins from pump.fun
    const coins = await fetchPumpFunCoins()
    
    if (coins.length === 0) {
      console.log('⚠️ No coins fetched from pump.fun')
      return
    }
    
    // Filter coins that should be tracked
    const trackableCoins = coins.filter(shouldTrackToken)
    console.log(`📊 Found ${trackableCoins.length} trackable coins (bonded or almost bonded)`)
    
    // Save trackable coins to database
    const savePromises = trackableCoins.map(saveBondedToken)
    await Promise.all(savePromises)
    
    console.log(`✅ Monitoring complete. Processed ${trackableCoins.length} tokens`)
  } catch (error) {
    console.error('Error in pump.fun monitoring:', error)
  }
}

// Start monitoring with interval
export function startPumpFunMonitoring(): void {
  console.log('🎯 Starting continuous pump.fun monitoring...')
  
  // Run immediately
  monitorPumpFunBonding()
  
  // Run every 30 seconds
  setInterval(monitorPumpFunBonding, 30000)
}
