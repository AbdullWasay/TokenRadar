import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Import the database function
    // Old scraper removed - using direct pump.fun API now
    
    // Get recent tokens to check scraper activity
    // Direct API - no database needed
    const recentTokens = [];
    
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    // Check if any tokens were scraped in the last 5 minutes
    const recentlyScraped = recentTokens.filter(token => 
      token.scraped_at && new Date(token.scraped_at) > fiveMinutesAgo
    );
    
    const isActive = recentlyScraped.length > 0;
    const totalTokens = recentTokens.length;
    const lastScrapedAt = recentTokens.length > 0 ? recentTokens[0].scraped_at : null;
    
    return NextResponse.json({
      success: true,
      status: {
        isActive: isActive,
        totalTokensInDatabase: totalTokens,
        recentlyScrapedCount: recentlyScraped.length,
        lastScrapedAt: lastScrapedAt,
        message: isActive 
          ? 'Scraper is active and collecting data' 
          : 'Scraper appears to be inactive or no recent data'
      },
      endpoints: {
        start: 'POST /api/scraper/start',
        stop: 'POST /api/scraper/stop',
        allTokens: 'GET /api/tokens/all',
        bondedTokens: 'GET /api/tokens'
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking scraper status:', error);
    
    return NextResponse.json({
      success: false,
      message: `Failed to check status: ${error instanceof Error ? error.message : 'Unknown error'}`,
      status: {
        isActive: false,
        totalTokensInDatabase: 0,
        recentlyScrapedCount: 0,
        lastScrapedAt: null,
        message: 'Error checking scraper status'
      }
    }, { status: 500 });
  }
}
