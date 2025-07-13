// Test to understand pump.fun's actual bonding curve
const axios = require('axios');

console.log('🧪 TESTING PUMP.FUN BONDING CURVE PARAMETERS');
console.log('=============================================\n');

async function analyzeBondingCurve() {
  try {
    const headers = {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9,es;q=0.8',
      'content-type': 'application/json',
      'origin': 'https://pump.fun',
      'referer': 'https://pump.fun/',
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

    const cookieString = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')

    console.log('📡 Fetching tokens to analyze bonding curve...')
    
    const response = await axios.get('https://frontend-api-v3.pump.fun/coins', {
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
      const tokens = response.data
      console.log(`📊 Analyzing ${tokens.length} tokens...\n`)

      // Analyze bonded tokens to understand the curve
      const bondedTokens = tokens.filter(token => token.complete === true)
      const unbondedTokens = tokens.filter(token => token.complete === false)

      console.log('🎉 BONDED TOKENS ANALYSIS:')
      console.log(`   - Total bonded tokens: ${bondedTokens.length}`)
      
      if (bondedTokens.length > 0) {
        const bondedMarketCaps = bondedTokens.map(t => t.usd_market_cap).filter(mc => mc > 0)
        const minBondedMC = Math.min(...bondedMarketCaps)
        const maxBondedMC = Math.max(...bondedMarketCaps)
        const avgBondedMC = bondedMarketCaps.reduce((sum, mc) => sum + mc, 0) / bondedMarketCaps.length

        console.log(`   - Min bonded market cap: $${minBondedMC.toLocaleString()}`)
        console.log(`   - Max bonded market cap: $${maxBondedMC.toLocaleString()}`)
        console.log(`   - Avg bonded market cap: $${avgBondedMC.toLocaleString()}`)
        
        console.log('\n📄 Bonded Token Examples:')
        bondedTokens.slice(0, 5).forEach((token, index) => {
          console.log(`   ${index + 1}. ${token.name} (${token.symbol}) - $${token.usd_market_cap?.toLocaleString() || '0'}`)
        })
      }

      console.log('\n🚀 UNBONDED TOKENS ANALYSIS:')
      console.log(`   - Total unbonded tokens: ${unbondedTokens.length}`)
      
      if (unbondedTokens.length > 0) {
        const unbondedMarketCaps = unbondedTokens.map(t => t.usd_market_cap).filter(mc => mc > 0)
        const minUnbondedMC = Math.min(...unbondedMarketCaps)
        const maxUnbondedMC = Math.max(...unbondedMarketCaps)
        const avgUnbondedMC = unbondedMarketCaps.reduce((sum, mc) => sum + mc, 0) / unbondedMarketCaps.length

        console.log(`   - Min unbonded market cap: $${minUnbondedMC.toLocaleString()}`)
        console.log(`   - Max unbonded market cap: $${maxUnbondedMC.toLocaleString()}`)
        console.log(`   - Avg unbonded market cap: $${avgUnbondedMC.toLocaleString()}`)

        // Find tokens close to bonding
        const highMarketCapTokens = unbondedTokens
          .filter(token => token.usd_market_cap > 50000)
          .sort((a, b) => b.usd_market_cap - a.usd_market_cap)

        console.log('\n🔥 HIGH MARKET CAP UNBONDED TOKENS (Close to bonding):')
        if (highMarketCapTokens.length > 0) {
          highMarketCapTokens.slice(0, 10).forEach((token, index) => {
            const percentage = Math.round((token.usd_market_cap / 69000) * 100)
            console.log(`   ${index + 1}. ${token.name} (${token.symbol}) - $${token.usd_market_cap?.toLocaleString() || '0'} (${percentage}%)`)
          })
        } else {
          console.log('   No tokens found with >$50k market cap')
        }
      }

      // Analyze the bonding threshold
      console.log('\n💡 BONDING CURVE ANALYSIS:')
      
      if (bondedTokens.length > 0 && unbondedTokens.length > 0) {
        const bondedMarketCaps = bondedTokens.map(t => t.usd_market_cap).filter(mc => mc > 0)
        const unbondedMarketCaps = unbondedTokens.map(t => t.usd_market_cap).filter(mc => mc > 0)
        
        const minBondedMC = Math.min(...bondedMarketCaps)
        const maxUnbondedMC = Math.max(...unbondedMarketCaps)
        
        console.log(`   - Lowest bonded token market cap: $${minBondedMC.toLocaleString()}`)
        console.log(`   - Highest unbonded token market cap: $${maxUnbondedMC.toLocaleString()}`)
        
        if (maxUnbondedMC < minBondedMC) {
          const estimatedThreshold = (minBondedMC + maxUnbondedMC) / 2
          console.log(`   - Estimated bonding threshold: $${estimatedThreshold.toLocaleString()}`)
        } else {
          console.log(`   - Bonding threshold appears to be around: $${minBondedMC.toLocaleString()}`)
        }
      }

      console.log('\n📊 RECOMMENDATIONS:')
      console.log('   - Use actual market cap data to determine bonding status')
      console.log('   - Filter for tokens with market cap > $60,000 for 90%+ bonded')
      console.log('   - Show complete=true tokens as 100% bonded')
      console.log('   - Calculate percentage based on proximity to bonding threshold')

    } else {
      console.log('❌ Failed to fetch tokens')
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
  }
}

analyzeBondingCurve();
