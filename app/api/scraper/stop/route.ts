import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🛑 Stopping pump.fun scraper...');

    // Import and stop the continuous API scraper
    const { stopContinuousScraping } = await import('@/lib/services/simple-pump-scraper');

    stopContinuousScraping();

    return NextResponse.json({
      success: true,
      message: 'Continuous pump.fun scraping stopped successfully'
    });

  } catch (error) {
    console.error('❌ Error stopping scraper:', error);

    return NextResponse.json({
      success: false,
      message: `Failed to stop scraper: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
