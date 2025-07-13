import { NextRequest, NextResponse } from 'next/server'

// Continuous monitoring for bonding status changes
let monitoringInterval: NodeJS.Timeout | null = null
let lastKnownTokens: Map<string, any> = new Map()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'status'

    if (action === 'start') {
      return startMonitoring()
    } else if (action === 'stop') {
      return stopMonitoring()
    } else {
      return getMonitoringStatus()
    }
  } catch (error: any) {
    console.error('❌ Error in bonding monitor:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to handle monitoring request',
      error: error.message
    }, { status: 500 })
  }
}

async function startMonitoring() {
  if (monitoringInterval) {
    return NextResponse.json({
      success: true,
      message: 'Monitoring is already running',
      status: 'running'
    })
  }

  console.log('🚀 Starting continuous bonding monitoring...')
  
  // Start monitoring every 30 seconds
  monitoringInterval = setInterval(async () => {
    await checkBondingChanges()
  }, 30000)

  // Run initial check
  await checkBondingChanges()

  return NextResponse.json({
    success: true,
    message: 'Bonding monitoring started',
    status: 'running',
    interval: '30 seconds'
  })
}

async function stopMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval)
    monitoringInterval = null
    console.log('⏹️ Stopped bonding monitoring')
  }

  return NextResponse.json({
    success: true,
    message: 'Bonding monitoring stopped',
    status: 'stopped'
  })
}

async function getMonitoringStatus() {
  return NextResponse.json({
    success: true,
    status: monitoringInterval ? 'running' : 'stopped',
    trackedTokens: lastKnownTokens.size,
    lastCheck: new Date().toISOString()
  })
}

async function checkBondingChanges() {
  try {
    console.log('🔍 Checking for bonding status changes...')
    
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

    // Get current tokens
    const response = await axios.default.get('https://frontend-api-v3.pump.fun/coins', {
      params: {
        offset: '0',
        limit: '100',
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
      const currentTokens = response.data
      
      // Check for newly bonded tokens
      const newlyBonded: any[] = []
      const nearBonded: any[] = []
      
      currentTokens.forEach(token => {
        const bondingPercentage = token.complete ? 100 : Math.min(Math.round((token.usd_market_cap / 69000) * 100), 99)
        const previousToken = lastKnownTokens.get(token.mint)
        
        // Check if token just became bonded
        if (token.complete && (!previousToken || !previousToken.complete)) {
          newlyBonded.push({
            mint: token.mint,
            name: token.name,
            symbol: token.symbol,
            marketCap: token.usd_market_cap,
            bondedAt: new Date().toISOString()
          })
          console.log(`🎉 NEWLY BONDED: ${token.name} (${token.symbol})`)
        }
        
        // Check if token is near bonding (90%+)
        if (!token.complete && bondingPercentage >= 90) {
          nearBonded.push({
            mint: token.mint,
            name: token.name,
            symbol: token.symbol,
            marketCap: token.usd_market_cap,
            bondingPercentage
          })
        }
        
        // Update tracking
        lastKnownTokens.set(token.mint, {
          ...token,
          bondingPercentage,
          lastChecked: new Date().toISOString()
        })
      })
      
      if (newlyBonded.length > 0) {
        console.log(`🎉 Found ${newlyBonded.length} newly bonded tokens!`)
      }
      
      if (nearBonded.length > 0) {
        console.log(`🔥 Found ${nearBonded.length} tokens near bonding (90%+)`)
      }
      
      // Clean up old tokens (keep only last 1000)
      if (lastKnownTokens.size > 1000) {
        const entries = Array.from(lastKnownTokens.entries())
        const toKeep = entries.slice(-1000)
        lastKnownTokens.clear()
        toKeep.forEach(([key, value]) => lastKnownTokens.set(key, value))
      }
      
    } else {
      console.log('⚠️ Failed to fetch tokens for monitoring')
    }
    
  } catch (error) {
    console.error('❌ Error in bonding monitoring:', error)
  }
}

export async function POST(request: NextRequest) {
  // Manual trigger for checking bonding changes
  try {
    await checkBondingChanges()
    
    return NextResponse.json({
      success: true,
      message: 'Manual bonding check completed',
      trackedTokens: lastKnownTokens.size
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Failed to check bonding changes',
      error: error.message
    }, { status: 500 })
  }
}
