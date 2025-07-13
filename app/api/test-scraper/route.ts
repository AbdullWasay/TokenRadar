import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing scraper functionality...');
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'test';
    
    switch (action) {
      case 'start':
        console.log('🚀 Starting continuous scraper...');
        const { startContinuousScraping } = await import('@/lib/services/simple-pump-scraper');
        await startContinuousScraping();
        
        return NextResponse.json({
          success: true,
          message: 'Continuous scraper started successfully!',
          timestamp: new Date().toISOString()
        });
        
      case 'stop':
        console.log('🛑 Stopping continuous scraper...');
        const { stopContinuousScraping } = await import('@/lib/services/simple-pump-scraper');
        stopContinuousScraping();
        
        return NextResponse.json({
          success: true,
          message: 'Continuous scraper stopped successfully!',
          timestamp: new Date().toISOString()
        });
        
      case 'test':
        console.log('🧪 Testing single API call...');
        const { fetchPumpTokens } = await import('@/lib/services/simple-pump-scraper');
        const tokens = await fetchPumpTokens(10);
        
        return NextResponse.json({
          success: true,
          message: `Single API test completed. Found ${tokens.length} tokens.`,
          tokensFound: tokens.length,
          sampleTokens: tokens.slice(0, 3).map(token => ({
            name: token.name,
            symbol: token.symbol,
            complete: token.complete
          })),
          timestamp: new Date().toISOString()
        });
        
      case 'status':
        console.log('📊 Checking scraper status...');
        const { isScrapingRunning } = await import('@/lib/services/simple-pump-scraper');

        return NextResponse.json({
          success: true,
          message: 'Scraper status retrieved successfully',
          isRunning: isScrapingRunning(),
          lastUpdate: new Date().toISOString(),
          apiStatus: 'pump.fun API currently returning 530 errors (overloaded)',
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Use: start, stop, test, status',
          availableActions: ['start', 'stop', 'test', 'status']
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Test scraper error:', error);
    
    return NextResponse.json({
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.stack : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request); // Allow both GET and POST
}
