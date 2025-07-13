import { NextRequest, NextResponse } from 'next/server';
import { 
  testPumpFunAPI, 
  scrapePumpFunAPI, 
  scrapeBondedTokensAPI,
  startContinuousAPIScraping,
  stopContinuousAPIScraping,
  getTokensFromAPIDatabase,
  getNewlyBondedAPITokens
} from '@/lib/services/pump-api-scraper';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'test';

  try {
    switch (action) {
      case 'test':
        console.log('🧪 Testing pump.fun API connection...');
        const isWorking = await testPumpFunAPI();
        return NextResponse.json({
          success: isWorking,
          message: isWorking ? 'API connection successful!' : 'API connection failed',
          timestamp: new Date().toISOString()
        });

      case 'scrape':
        console.log('🔍 Manual scrape of pump.fun API...');
        const tokens = await scrapePumpFunAPI();
        return NextResponse.json({
          success: true,
          message: `Scraped ${tokens.length} tokens`,
          tokens: tokens.slice(0, 5), // Return first 5 tokens as sample
          total: tokens.length,
          timestamp: new Date().toISOString()
        });

      case 'scrape-bonded':
        console.log('🎉 Manual scrape of bonded tokens...');
        const bondedTokens = await scrapeBondedTokensAPI();
        return NextResponse.json({
          success: true,
          message: `Found ${bondedTokens.length} bonded tokens`,
          tokens: bondedTokens.slice(0, 5),
          total: bondedTokens.length,
          timestamp: new Date().toISOString()
        });

      case 'start':
        console.log('🚀 Starting continuous API scraping...');
        await startContinuousAPIScraping();
        return NextResponse.json({
          success: true,
          message: 'Continuous API scraping started',
          timestamp: new Date().toISOString()
        });

      case 'stop':
        console.log('🛑 Stopping continuous API scraping...');
        stopContinuousAPIScraping();
        return NextResponse.json({
          success: true,
          message: 'Continuous API scraping stopped',
          timestamp: new Date().toISOString()
        });

      case 'database':
        console.log('📊 Fetching tokens from database...');
        const dbTokens = await getTokensFromAPIDatabase(10);
        return NextResponse.json({
          success: true,
          message: `Found ${dbTokens.length} tokens in database`,
          tokens: dbTokens,
          timestamp: new Date().toISOString()
        });

      case 'bonded-db':
        console.log('🎉 Fetching bonded tokens from database...');
        const dbBondedTokens = await getNewlyBondedAPITokens(10);
        return NextResponse.json({
          success: true,
          message: `Found ${dbBondedTokens.length} bonded tokens in database`,
          tokens: dbBondedTokens,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Use: test, scrape, scrape-bonded, start, stop, database, bonded-db',
          timestamp: new Date().toISOString()
        }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ API test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
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
      case 'update-cookies':
        // This would allow updating cookies if needed
        return NextResponse.json({
          success: true,
          message: 'Cookies update feature not implemented yet',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid POST action',
          timestamp: new Date().toISOString()
        }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ POST API test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
