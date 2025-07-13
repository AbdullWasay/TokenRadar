#!/usr/bin/env node
/**
 * Test script to verify the bonded token API changes work correctly
 * This tests the pump.fun API with the complete=true parameter
 */

const axios = require('axios');

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

function getCookieString() {
  return '_ga=GA1.1.1085779232.1743616310; intercom-id-w7scljv7=c042e584-67f0-4653-b79c-e724e4030fa1; intercom-device-id-w7scljv7=0d5c5a65-93aa-486f-8784-0bd4f1a63cd3; fs_uid=#o-1YWTMD-na1#34094bea-8456-49bd-b821-968173400217:091b5c8f-9018-43f2-b7f4-abe27606f49d:1745422245728::1#/1767903960; _ga_T65NVS2TQ6=GS1.1.1745422266.7.0.1745422266.60.0.0; intercom-session-w7scljv7=; _cf_bm=bXgkxQ3QMgPDJI_j628.5Lp04FJFfMBb2GOnDfJ418-1748963512-1.0.1.1-rHQcg_XQhNsJopxGC_yCNB5QQiWXBP_rSkMoXvsWeFBwWmRdhk5aJhVNVRBWm.WDJyZ; cf_clearance=fmx.QscgUNIM0bi831dIxK1CNseSVZz6TukXfOGPpL4-1748963513-1.2.1.1-xkPmOfkX_2fCy.jaViYEnIiRAwpFQuhv3vmmbHowWX_Du9hBK7BFgfLZ_yne9C';
}

async function testBondedTokensAPI() {
  console.log('🧪 TESTING BONDED TOKENS API CHANGES');
  console.log('=====================================\n');

  try {
    // Test 1: Get bonded tokens using complete=true parameter
    console.log('📡 TEST 1: Fetching bonded tokens with complete=true...');
    const bondedResponse = await axios.get('https://frontend-api-v3.pump.fun/coins', {
      params: {
        offset: '0',
        limit: '20',
        sort: 'created_timestamp',
        includeNsfw: 'false',
        order: 'DESC',
        complete: 'true', // This is the key parameter!
      },
      headers: {
        ...headers,
        'cookie': getCookieString(),
      },
      timeout: 30000,
    });

    if (bondedResponse.status === 200 && Array.isArray(bondedResponse.data)) {
      const bondedTokens = bondedResponse.data;
      console.log(`✅ Found ${bondedTokens.length} bonded tokens`);
      
      // Verify they are actually bonded
      const verifiedBonded = bondedTokens.filter(token => token.complete === true || token.raydium_pool);
      console.log(`🎉 Verified ${verifiedBonded.length} are actually bonded`);
      
      // Show sample bonded tokens
      console.log('\n📋 SAMPLE BONDED TOKENS:');
      verifiedBonded.slice(0, 5).forEach((token, index) => {
        const createdDate = new Date(token.created_timestamp).toLocaleString();
        console.log(`${index + 1}. ${token.name} (${token.symbol})`);
        console.log(`   Market Cap: $${token.usd_market_cap?.toLocaleString() || '0'}`);
        console.log(`   Complete: ${token.complete}`);
        console.log(`   Raydium Pool: ${token.raydium_pool || 'None'}`);
        console.log(`   Created: ${createdDate}`);
        console.log('');
      });
    } else {
      console.log('❌ Failed to get bonded tokens');
    }

    // Test 2: Get tokens sorted by market cap to find higher bonding percentages
    console.log('\n📡 TEST 2: Fetching tokens sorted by market cap to find higher bonding percentages...');
    const recentResponse = await axios.get('https://frontend-api-v3.pump.fun/coins', {
      params: {
        offset: '0',
        limit: '200', // Get more tokens
        sort: 'created_timestamp', // Use timestamp sorting
        includeNsfw: 'false',
        order: 'DESC',
      },
      headers: {
        ...headers,
        'cookie': getCookieString(),
      },
      timeout: 30000,
    });

    if (recentResponse.status === 200 && Array.isArray(recentResponse.data)) {
      const recentTokens = recentResponse.data;
      console.log(`✅ Found ${recentTokens.length} recent tokens`);
      
      // Filter for near-bonded tokens (90%+ but not complete)
      const nearBondedTokens = recentTokens.filter(token => {
        if (token.complete === true || token.raydium_pool) return false;
        const bondingPercentage = Math.min(Math.round((token.usd_market_cap / 69000) * 100), 99);
        return bondingPercentage >= 90;
      });
      
      console.log(`🔥 Found ${nearBondedTokens.length} near-bonded tokens (90%+)`);

      // DETAILED BONDING PERCENTAGE ANALYSIS
      console.log('\n🔍 DETAILED BONDING PERCENTAGE ANALYSIS:');
      console.log('Analyzing different market caps to verify formula accuracy...');

      const bondingAnalysis = recentTokens
        .filter(token => !token.complete && token.usd_market_cap > 0)
        .sort((a, b) => b.usd_market_cap - a.usd_market_cap)
        .slice(0, 25); // Top 25 by market cap to find high bonding percentages

      bondingAnalysis.forEach((token, index) => {
        const marketCap = token.usd_market_cap;
        const currentFormula = Math.min(Math.round((marketCap / 69000) * 100), 99);
        const exactPercentage = (marketCap / 69000) * 100;

        console.log(`${index + 1}. ${token.name} (${token.symbol})`);
        console.log(`   Market Cap: $${marketCap.toLocaleString()}`);
        console.log(`   Exact %: ${exactPercentage.toFixed(4)}%`);
        console.log(`   Rounded %: ${currentFormula}%`);
        console.log(`   Complete: ${token.complete}`);
        console.log(`   Bonding Curve: ${token.bonding_curve || 'N/A'}`);
        console.log('');
      });

      if (nearBondedTokens.length > 0) {
        console.log('\n📋 SAMPLE NEAR-BONDED TOKENS:');
        nearBondedTokens.slice(0, 3).forEach((token, index) => {
          const bondingPercentage = Math.min(Math.round((token.usd_market_cap / 69000) * 100), 99);
          const createdDate = new Date(token.created_timestamp).toLocaleString();
          console.log(`${index + 1}. ${token.name} (${token.symbol}) - ${bondingPercentage}%`);
          console.log(`   Market Cap: $${token.usd_market_cap?.toLocaleString() || '0'}`);
          console.log(`   Created: ${createdDate}`);
          console.log('');
        });
      }
    } else {
      console.log('❌ Failed to get recent tokens');
    }

    // Test 3: Simulate the trending API logic
    console.log('\n📡 TEST 3: Simulating trending API logic...');
    const bondedTokens = bondedResponse.data || [];
    const recentTokens = recentResponse.data || [];
    
    const nearBondedTokens = recentTokens.filter(token => {
      if (token.complete === true || token.raydium_pool) return false;
      const bondingPercentage = Math.min(Math.round((token.usd_market_cap / 69000) * 100), 99);
      return bondingPercentage >= 90;
    });

    // Combine bonded and near-bonded tokens
    let trendingTokens = [...bondedTokens, ...nearBondedTokens];

    // Remove duplicates based on mint address
    const uniqueTokens = trendingTokens.filter((token, index, self) => 
      index === self.findIndex(t => t.mint === token.mint)
    );

    // Sort by creation time (most recent first) and limit
    const finalTrendingTokens = uniqueTokens
      .sort((a, b) => b.created_timestamp - a.created_timestamp)
      .slice(0, 10);

    console.log(`🔥 Final trending tokens: ${finalTrendingTokens.length}`);
    console.log(`   - Bonded: ${bondedTokens.length}`);
    console.log(`   - Near-bonded: ${nearBondedTokens.length}`);
    console.log(`   - After deduplication: ${uniqueTokens.length}`);
    
    console.log('\n✅ API CHANGES VERIFICATION COMPLETE!');
    console.log('🎯 Key findings:');
    console.log(`   • complete=true parameter returns ${bondedTokens.length} bonded tokens`);
    console.log(`   • Regular API returns ${recentTokens.length} recent tokens`);
    console.log(`   • Found ${nearBondedTokens.length} near-bonded tokens (90%+)`);
    console.log(`   • Trending logic would show ${finalTrendingTokens.length} tokens total`);

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

// Run the test
testBondedTokensAPI();
