import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import { withAuth, AuthenticatedRequest, handleApiError } from '@/lib/middleware'
import { verifyTransaction } from '@/lib/solana-utils'
import { SUBSCRIPTION_PRICE_SOL, SUBSCRIPTION_DURATION_DAYS } from '@/lib/solana-config'
import type { AuthResponse } from '@/lib/types'

// Validation schema
const verifyPaymentSchema = z.object({
  transactionSignature: z.string().min(1, 'Transaction signature is required'),
  walletAddress: z.string().min(1, 'Wallet address is required'),
})

async function handler(request: AuthenticatedRequest) {
  try {
    // Connect to database
    await dbConnect()

    const user = request.user!
    const body = await request.json()

    // Validate input
    const validationResult = verifyPaymentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    const { transactionSignature, walletAddress } = validationResult.data

    // Verify the transaction on the blockchain
    const transactionDetails = await verifyTransaction(transactionSignature)

    if (!transactionDetails) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found or invalid' },
        { status: 400 }
      )
    }

    // Verify transaction details
    if (transactionDetails.from !== walletAddress) {
      return NextResponse.json(
        { success: false, message: 'Transaction sender does not match wallet address' },
        { status: 400 }
      )
    }

    // Check if payment amount is correct (allow small variance for fees)
    const expectedAmount = SUBSCRIPTION_PRICE_SOL
    const actualAmount = transactionDetails.amount
    const tolerance = 0.001 // Allow 0.001 SOL variance

    if (Math.abs(actualAmount - expectedAmount) > tolerance) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid payment amount. Expected ${expectedAmount} SOL, received ${actualAmount} SOL` 
        },
        { status: 400 }
      )
    }

    // Check if transaction has already been used
    const existingUser = await User.findOne({
      'paymentHistory.transactionSignature': transactionSignature
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Transaction has already been used' },
        { status: 400 }
      )
    }

    // Calculate subscription expiry date
    const now = new Date()
    const expiryDate = new Date(now.getTime() + (SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000))

    // Update user subscription
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      {
        subscriptionStatus: 'premium',
        subscriptionExpiry: expiryDate,
        walletAddress: walletAddress,
        $push: {
          paymentHistory: {
            transactionSignature,
            amount: actualAmount,
            timestamp: new Date(transactionDetails.timestamp * 1000),
            walletAddress,
            subscriptionDuration: SUBSCRIPTION_DURATION_DAYS,
          }
        }
      },
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Return success response with updated user data
    const response: AuthResponse = {
      success: true,
      message: 'Payment verified and subscription activated successfully',
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionExpiry: updatedUser.subscriptionExpiry,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        lastLogin: updatedUser.lastLogin
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error: any) {
    console.error('Payment verification error:', error)
    return handleApiError(error)
  }
}

export const POST = withAuth(handler)
