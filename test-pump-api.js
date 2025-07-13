// Standalone test script for pump.fun API
const axios = require('axios');

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
function getCookieString() {
  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}

async function testPumpFunAPI() {
  console.log('🧪 Testing pump.fun API connection...');
  
  try {
    // Parameters from the tutorial
    const params = {
      offset: '0',
      limit: '10',
      sort: 'created_timestamp',
      includeNsfw: 'false',
      order: 'DESC',
    };

    console.log('📡 Making request to pump.fun API...');
    console.log('URL: https://frontend-api-v3.pump.fun/coins');
    console.log('Params:', params);

    // Make the API request
    const response = await axios.get('https://frontend-api-v3.pump.fun/coins', {
      params,
      headers: {
        ...headers,
        'cookie': getCookieString(),
      },
      timeout: 30000, // 30 second timeout
    });

    console.log(`✅ Response status: ${response.status}`);

    if (response.status !== 200) {
      console.error(`❌ API request failed with status: ${response.status}`);
      return false;
    }

    const tokens = response.data;
    
    if (!Array.isArray(tokens)) {
      console.error('❌ API response is not an array:', typeof tokens);
      console.log('Response data:', tokens);
      return false;
    }

    console.log(`📊 Found ${tokens.length} REAL tokens from pump.fun API`);

    // Show first few tokens as examples
    if (tokens.length > 0) {
      console.log('\n📄 Token examples:');
      tokens.slice(0, 3).forEach((token, index) => {
        console.log(`\n${index + 1}. ${token.name} (${token.symbol})`);
        console.log(`   Mint: ${token.mint}`);
        console.log(`   Market Cap: $${token.usd_market_cap?.toLocaleString() || 'N/A'}`);
        console.log(`   Complete: ${token.complete ? 'Yes (Bonded)' : 'No'}`);
        console.log(`   Created: ${new Date(token.created_timestamp * 1000).toLocaleString()}`);
        if (token.description) {
          console.log(`   Description: ${token.description.substring(0, 100)}...`);
        }
      });
    }

    // Check for bonded tokens
    const bondedTokens = tokens.filter(token => token.complete === true);
    console.log(`\n🎉 Found ${bondedTokens.length} bonded tokens (100% complete)`);

    if (bondedTokens.length > 0) {
      console.log('\n🚀 Bonded tokens:');
      bondedTokens.forEach((token, index) => {
        console.log(`${index + 1}. ${token.name} (${token.symbol}) - $${token.usd_market_cap?.toLocaleString()}`);
      });
    }

    return true;

  } catch (error) {
    console.error('\n❌ Error testing pump.fun API:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.message);
      console.error('Request config:', error.config);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Run the test
testPumpFunAPI().then(success => {
  console.log(`\n${success ? '✅ Test completed successfully!' : '❌ Test failed!'}`);
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
