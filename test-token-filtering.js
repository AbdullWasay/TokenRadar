// Test the new token filtering logic to show tokens close to bonding
const axios = require('axios');

console.log('🧪 TESTING NEW TOKEN FILTERING LOGIC');
console.log('=====================================\n');

async function testTokenFiltering() {
  try {
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

    // Parameters for pump.fun API
    const params = {
      offset: '0',
      limit: '50',
      sort: 'created_timestamp',
      includeNsfw: 'false',
      order: 'DESC',
    }

    console.log('📡 Fetching tokens from pump.fun API...')
    
    // Make the API request to pump.fun
    const response = await axios.get('https://frontend-api-v3.pump.fun/coins', {
      params,
      headers: {
        ...headers,
        'cookie': cookieString,
      },
      timeout: 30000,
    })

    if (response.status === 200 && Array.isArray(response.data)) {
      const tokens = response.data
      console.log(`📊 Found ${tokens.length} REAL tokens from pump.fun API\n`)

      // Analyze bonding percentages
      const tokenAnalysis = tokens.map(token => {
        const bondingPercentage = token.complete ? 100 : Math.min(Math.round((token.usd_market_cap / 69000) * 100), 99)
        return {
          name: token.name,
          symbol: token.symbol,
          marketCap: token.usd_market_cap,
          bondingPercentage,
          complete: token.complete,
          raydiumPool: token.raydium_pool,
          createdTimestamp: token.created_timestamp,
          createdDate: new Date(token.created_timestamp * 1000).toLocaleString()
        }
      })

      // Log some sample tokens to see their complete status
      console.log('\n🔍 SAMPLE TOKEN ANALYSIS:')
      tokenAnalysis.slice(0, 5).forEach((token, index) => {
        console.log(`${index + 1}. ${token.name} (${token.symbol})`)
        console.log(`   Complete: ${token.complete}`)
        console.log(`   Raydium Pool: ${token.raydiumPool || 'None'}`)
        console.log(`   Market Cap: $${token.marketCap?.toLocaleString() || '0'}`)
        console.log(`   Bonding %: ${token.bondingPercentage}%`)
        console.log(`   Created: ${token.createdDate}`)
        console.log('')
      })

      // Filter using the new logic
      const bondedTokens = tokenAnalysis.filter(token => token.complete === true || token.raydiumPool)
      const nearBondedTokens = tokenAnalysis.filter(token => {
        if (token.complete === true || token.raydiumPool) return false
        return token.bondingPercentage >= 20
      })
      const mediumBondedTokens = tokenAnalysis.filter(token => {
        if (token.complete === true || token.raydiumPool) return false
        return token.bondingPercentage >= 50 && token.bondingPercentage < 80
      })
      const lowBondedTokens = tokenAnalysis.filter(token => {
        if (token.complete === true || token.raydiumPool) return false
        return token.bondingPercentage < 50
      })

      console.log('📊 BONDING ANALYSIS:')
      console.log('===================')
      console.log(`🎉 100% Bonded (Complete): ${bondedTokens.length}`)
      console.log(`🔥 20-99% Bonded (Progressing): ${nearBondedTokens.length}`)
      console.log(`⚡ 50-79% Bonded (Medium): ${mediumBondedTokens.length}`)
      console.log(`🌱 0-19% Bonded (Early): ${lowBondedTokens.length}`)

      // Show ALL tokens sorted by bonding percentage
      const allTokensSorted = tokenAnalysis.sort((a, b) => b.bondingPercentage - a.bondingPercentage)
      console.log(`\n📋 ALL TOKENS (sorted by bonding %): ${allTokensSorted.length}`)

      console.log('\n📄 Top tokens (sorted by bonding progress):')
      allTokensSorted.slice(0, 10).forEach((token, index) => {
        console.log(`\n${index + 1}. ${token.name} (${token.symbol})`)
        console.log(`   Market Cap: $${token.marketCap?.toLocaleString() || '0'}`)
        console.log(`   Bonding: ${token.bondingPercentage}%`)
        console.log(`   Status: ${token.complete ? '✅ BONDED' : token.bondingPercentage >= 10 ? '🚀 PROGRESSING' : '🌱 EARLY'}`)
      })

      // Recommendation
      console.log('\n💡 RECOMMENDATION:')
      console.log('   ✅ Show ALL tokens sorted by bonding progress')
      console.log(`   📊 This displays all ${allTokensSorted.length} tokens with best ones first`)
      console.log('   🎯 Users can see both high-progress and new tokens')

    } else {
      console.log('❌ Failed to fetch tokens from pump.fun API')
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
  }
}

testTokenFiltering();
