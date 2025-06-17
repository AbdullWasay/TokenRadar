import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import { withAuth, AuthenticatedRequest, handleApiError } from '@/lib/middleware'
import type { AuthResponse } from '@/lib/types'

async function handler(request: AuthenticatedRequest) {
  try {
    // Connect to database
    await dbConnect()

    const user = request.user!

    // Find user in database to get latest data
    const dbUser = await User.findById(user.userId).select('-password')
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Return user data
    const response: AuthResponse = {
      success: true,
      message: 'User data retrieved successfully',
      user: {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        subscriptionStatus: dbUser.subscriptionStatus,
        subscriptionExpiry: dbUser.subscriptionExpiry,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
        lastLogin: dbUser.lastLogin
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error: any) {
    return handleApiError(error)
  }
}

export const GET = withAuth(handler)
