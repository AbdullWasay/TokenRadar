// Test the fixed token detail API
const { MongoClient } = require('mongodb');

async function testTokenDetailAPI() {
  try {
    console.log('Testing Fixed Token Detail API...');
    
    // Get a real token ID from the database
    const client = new MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar');
    await client.connect();
    
    const db = client.db('TokenRadar');
    const collection = db.collection('Rader');

    // Get the Stickoo token (we know it has DexScreener data)
    const testToken = await collection.findOne({name: 'Stickoo'});
    
    if (!testToken) {
      console.log('❌ Test token not found in database');
      await client.close();
      return;
    }
    
    console.log(`✅ Testing with token: ${testToken.name} (${testToken.symbol})`);
    console.log(`   Token ID: ${testToken.mint}`);
    
    await client.close();
    
    // Test the API endpoint
    console.log('\n🧪 Testing API endpoint...');
    const apiUrl = `http://localhost:3000/api/tokens/${testToken.mint}`;
    console.log(`URL: ${apiUrl}`);
    
    try {
      const fetch = require('node-fetch');
      const response = await fetch(apiUrl);
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response:');
        console.log(`  Success: ${data.success}`);
        if (data.data) {
          console.log(`  Token: ${data.data.name} (${data.data.symbol})`);
          console.log(`  Market Cap: $${data.data.marketCap}`);
          console.log(`  Price: $${data.data.price}`);
          console.log(`  Bonding %: ${data.data.bondedPercentage}%`);
          console.log('\n📊 DexScreener Price Changes:');
          console.log(`  5 Minutes: ${data.data.fiveMin}`);
          console.log(`  1 Hour: ${data.data.oneHour}`);
          console.log(`  6 Hours: ${data.data.sixHour}`);
          console.log(`  24 Hours: ${data.data.twentyFourHour}`);
          
          if (data.data.volume) {
            console.log('\n📈 Volume Data:');
            console.log(`  5m: $${data.data.volume.m5}`);
            console.log(`  1h: $${data.data.volume.h1}`);
            console.log(`  6h: $${data.data.volume.h6}`);
            console.log(`  24h: $${data.data.volume.h24}`);
          }
        }
      } else {
        const errorData = await response.text();
        console.log('❌ API Error:');
        console.log(errorData);
      }
    } catch (fetchError) {
      console.log('❌ Fetch Error:', fetchError.message);
      console.log('💡 Make sure the development server is running (npm run dev)');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testTokenDetailAPI();
