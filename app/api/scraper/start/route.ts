import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting pump.fun continuous scraper...');

    // Import and start the continuous API scraper
    const { startContinuousScraping } = await import('@/lib/services/simple-pump-scraper');

    await startContinuousScraping();

    return NextResponse.json({
      success: true,
      message: 'Continuous pump.fun API scraping started successfully!'
    });

  } catch (error) {
    console.error('❌ Error starting scraper:', error);

    return NextResponse.json({
      success: false,
      message: `Failed to start scraper: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Use POST to start the pump.fun scraper',
    endpoints: {
      start: 'POST /api/scraper/start',
      stop: 'POST /api/scraper/stop',
      status: 'GET /api/scraper/status'
    }
  });
}
