import { NextRequest, NextResponse } from 'next/server'
import { monitorPumpFunBonding } from '@/lib/services/pump-monitor'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Manual monitoring trigger started...')
    
    // Run the monitoring function
    await monitorPumpFunBonding()
    
    return NextResponse.json({
      success: true,
      message: 'Monitoring completed successfully'
    })
  } catch (error: any) {
    console.error('Error in manual monitoring:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Monitoring failed',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Pump.fun bonding monitor endpoint',
    usage: 'POST to trigger manual monitoring'
  })
}
