// Simple test to check if our API endpoint works
const axios = require('axios');

async function testServer() {
  console.log('🧪 Testing if Next.js server is running...');
  
  try {
    // Test if server is running on port 3001
    const response = await axios.get('http://localhost:3001/api/pump-tokens?limit=5', {
      timeout: 10000
    });

    console.log('✅ Server is running!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.data.success && response.data.data.length > 0) {
      console.log('\n🎉 API is working! Found', response.data.data.length, 'tokens');
      console.log('First token:', response.data.data[0].name, '(' + response.data.data[0].symbol + ')');
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running on port 3001');
      console.log('Please start the server with: npm run dev');
    } else {
      console.log('❌ Error testing server:', error.message);
    }
  }
}

testServer();
