// Test the token detail API with a real token ID
const { MongoClient } = require('mongodb');

async function testTokenDetailAPI() {
  try {
    console.log('Testing Token Detail API...');
    
    // First, get a real token ID from the database
    const client = new MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar');
    await client.connect();
    
    const db = client.db('TokenRadar');
    const collection = db.collection('Rader');

    // Get a sample token
    const sampleToken = await collection.findOne({});
    
    if (!sampleToken) {
      console.log('❌ No tokens found in database');
      await client.close();
      return;
    }
    
    console.log(`✅ Found sample token: ${sampleToken.name} (${sampleToken.symbol})`);
    console.log(`   Token ID: ${sampleToken.mint}`);
    
    await client.close();
    
    // Now test the API endpoint
    const fetch = require('node-fetch');
    
    console.log('\n🧪 Testing API endpoint...');
    const apiUrl = `http://localhost:3000/api/tokens/${sampleToken.mint}`;
    console.log(`URL: ${apiUrl}`);
    
    try {
      const response = await fetch(apiUrl);
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response:');
        console.log(`  Success: ${data.success}`);
        if (data.data) {
          console.log(`  Token: ${data.data.name} (${data.data.symbol})`);
          console.log(`  Market Cap: $${data.data.marketCap}`);
          console.log(`  Bonding %: ${data.data.bondedPercentage}%`);
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
