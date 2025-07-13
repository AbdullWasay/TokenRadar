import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log('🧪 Testing simple pump.fun API...');
    
    // Import the JavaScript version
    const { testPumpFunAPISimple } = await import('@/lib/services/pump-api-scraper.js');
    
    const result = await testPumpFunAPISimple();
    
    return NextResponse.json({
      success: result,
      message: result ? 'API test successful!' : 'API test failed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Simple API test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
