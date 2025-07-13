import { NextRequest, NextResponse } from 'next/server';

let startupInitialized = false;

export async function GET(request: NextRequest) {
  try {
    if (startupInitialized) {
      return NextResponse.json({
        success: true,
        message: 'Startup already initialized',
        timestamp: new Date().toISOString()
      });
    }

    console.log('🚀 Initializing Token Radar startup sequence...');

    // Start continuous API scraping automatically
    try {
      console.log('🚀 Auto-starting continuous pump.fun API scraping...');

      const { startContinuousScraping } = await import('@/lib/services/simple-pump-scraper');
      await startContinuousScraping();

      console.log('✅ Continuous API scraping started successfully!');
    } catch (error) {
      console.error('❌ Failed to start continuous API scraping:', error);
    }

    // Test direct pump.fun API connection
    try {
      console.log('🧪 Testing direct pump.fun API connection...');

      // Test the direct API method
      const axios = await import('axios')

      const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8',
        'content-type': 'application/json',
        'origin': 'https://pump.fun',
        'referer': 'https://pump.fun/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      }

      const response = await axios.default.get('https://frontend-api.pump.fun/coins', {
        params: {
          offset: '0',
          limit: '5',
          sort: 'created_timestamp',
          includeNsfw: 'false',
          order: 'DESC',
        },
        headers,
        timeout: 10000,
      })

      if (response.status === 200 && Array.isArray(response.data)) {
        console.log(`✅ Direct API connection successful! Found ${response.data.length} tokens`);
      } else {
        console.log('⚠️ Direct API connection failed - unexpected response format');
      }
    } catch (error) {
      console.error('❌ Failed to test direct API connection:', error);
    }

    startupInitialized = true;

    return NextResponse.json({
      success: true,
      message: 'Token Radar startup sequence completed - using direct pump.fun API',
      timestamp: new Date().toISOString(),
      api: {
        method: 'direct-pump-fun-api',
        status: 'tested'
      }
    });

  } catch (error) {
    console.error('❌ Startup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Startup failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'restart':
        startupInitialized = false;
        return await GET(request);

      case 'status':
        return NextResponse.json({
          success: true,
          initialized: startupInitialized,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Use: restart, status',
          timestamp: new Date().toISOString()
        }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ POST startup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
