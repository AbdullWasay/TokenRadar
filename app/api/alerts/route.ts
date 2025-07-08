import Alert from '@/lib/models/Alert'
import dbConnect from '@/lib/mongodb'
import type { AlertsApiResponse, CreateAlertRequest } from '@/lib/types'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return decoded.userId
  } catch (error) {
    return null
  }
}

// GET /api/alerts - Get user's alerts
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const userId = await verifyToken(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const alertType = searchParams.get('type')
    const isActive = searchParams.get('active')
    const isTriggered = searchParams.get('triggered')

    // Build query
    const query: any = { userId }
    if (alertType) query.alertType = alertType
    if (isActive !== null) query.isActive = isActive === 'true'
    if (isTriggered !== null) query.isTriggered = isTriggered === 'true'

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .lean()

    // Transform to match frontend interface
    const transformedAlerts = alerts.map(alert => ({
      id: alert._id.toString(),
      userId: alert.userId,
      tokenId: alert.tokenId,
      tokenName: alert.tokenName,
      tokenSymbol: alert.tokenSymbol,
      alertType: alert.alertType,
      condition: alert.condition,
      threshold: alert.threshold,
      timeframe: alert.timeframe,
      isActive: alert.isActive,
      isTriggered: alert.isTriggered,
      triggeredAt: alert.triggeredAt,
      triggeredPrice: alert.triggeredPrice,
      triggeredPercentage: alert.triggeredPercentage,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt
    }))

    const response: AlertsApiResponse = {
      success: true,
      data: transformedAlerts,
      count: transformedAlerts.length
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/alerts - Create new alert
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const userId = await verifyToken(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: CreateAlertRequest = await request.json()
    const {
      tokenId,
      tokenName,
      tokenSymbol,
      alertType,
      condition,
      threshold,
      timeframe
    } = body

    // Validation
    if (!tokenId || !tokenName || !tokenSymbol || !alertType || !condition || threshold === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (alertType === 'percentage' && !timeframe) {
      return NextResponse.json(
        { success: false, error: 'Timeframe is required for percentage alerts' },
        { status: 400 }
      )
    }

    // Check for duplicate alerts
    const existingAlert = await Alert.findOne({
      userId,
      tokenId,
      alertType,
      condition,
      threshold,
      timeframe: timeframe || null,
      isActive: true
    })

    if (existingAlert) {
      return NextResponse.json(
        { success: false, error: 'Similar alert already exists' },
        { status: 409 }
      )
    }

    // Create new alert
    const newAlert = new Alert({
      userId,
      tokenId,
      tokenName,
      tokenSymbol,
      alertType,
      condition,
      threshold,
      timeframe,
      isActive: true,
      isTriggered: false
    })

    await newAlert.save()

    const response: AlertsApiResponse = {
      success: true,
      data: [{
        id: newAlert._id.toString(),
        userId: newAlert.userId,
        tokenId: newAlert.tokenId,
        tokenName: newAlert.tokenName,
        tokenSymbol: newAlert.tokenSymbol,
        alertType: newAlert.alertType,
        condition: newAlert.condition,
        threshold: newAlert.threshold,
        timeframe: newAlert.timeframe,
        isActive: newAlert.isActive,
        isTriggered: newAlert.isTriggered,
        triggeredAt: newAlert.triggeredAt,
        triggeredPrice: newAlert.triggeredPrice,
        triggeredPercentage: newAlert.triggeredPercentage,
        createdAt: newAlert.createdAt,
        updatedAt: newAlert.updatedAt
      }],
      message: 'Alert created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: any) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
