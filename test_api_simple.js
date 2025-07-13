// Simple test to check if the API is working
const { MongoClient } = require('mongodb');

async function testAPI() {
  try {
    console.log('Testing MongoDB connection...');
    
    const client = new MongoClient('mongodb+srv://wasay:mongodb308@cluster0.etvipre.mongodb.net/TokenRadar');
    await client.connect();
    
    const db = client.db('TokenRadar');
    const collection = db.collection('Rader');

    // Test bonded tokens query
    const bondedQuery = { 
      $or: [
        {complete: true},
        {is_bonded: true},
        {bonding_percentage: 100}
      ]
    };

    const bondedTokens = await collection.find(bondedQuery).limit(5).toArray();
    console.log(`Found ${bondedTokens.length} bonded tokens`);
    
    bondedTokens.forEach((token, i) => {
      console.log(`${i+1}. ${token.name} (${token.symbol}) - ${token.bonding_percentage}% - $${token.usd_market_cap?.toFixed(2)}`);
    });

    // Test all tokens query
    const allTokens = await collection.find({}).limit(5).toArray();
    console.log(`\nFound ${allTokens.length} total tokens (sample)`);
    
    allTokens.forEach((token, i) => {
      console.log(`${i+1}. ${token.name} (${token.symbol}) - ${token.bonding_percentage}% - $${token.usd_market_cap?.toFixed(2)}`);
    });

    await client.close();
    console.log('\nMongoDB connection test successful!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
