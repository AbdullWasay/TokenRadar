import Alert from '@/lib/models/Alert'
import dbConnect from '@/lib/mongodb'
import type { AlertsApiResponse } from '@/lib/types'
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

// GET /api/alerts/[id] - Get specific alert
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const userId = await verifyToken(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const alert = await Alert.findOne({ _id: id, userId }).lean()

    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      )
    }

    const transformedAlert = {
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
    }

    const response: AlertsApiResponse = {
      success: true,
      data: [transformedAlert]
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching alert:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/alerts/[id] - Update alert
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const userId = await verifyToken(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { isActive, threshold, condition, timeframe } = body

    // Find and update alert
    const alert = await Alert.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(isActive !== undefined && { isActive }),
        ...(threshold !== undefined && { threshold }),
        ...(condition !== undefined && { condition }),
        ...(timeframe !== undefined && { timeframe }),
        updatedAt: new Date()
      },
      { new: true, lean: true }
    )

    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      )
    }

    const transformedAlert = {
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
    }

    const response: AlertsApiResponse = {
      success: true,
      data: [transformedAlert],
      message: 'Alert updated successfully'
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error updating alert:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/alerts/[id] - Delete alert
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const userId = await verifyToken(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const alert = await Alert.findOneAndDelete({ _id: id, userId })

    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      )
    }

    const response: AlertsApiResponse = {
      success: true,
      message: 'Alert deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error deleting alert:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
