import { checkAlerts } from '@/lib/services/alert-checker'
import { NextRequest, NextResponse } from 'next/server'

// Manual trigger for checking alerts
export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Manual alert check triggered...')
    
    await checkAlerts()
    
    return NextResponse.json({
      success: true,
      message: 'Alert check completed successfully'
    })
  } catch (error: any) {
    console.error('Error in manual alert check:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Alert check failed',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Alert checking endpoint',
    usage: 'POST to trigger manual alert check'
  })
}
