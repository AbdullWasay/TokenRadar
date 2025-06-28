import { AuthenticatedRequest, handleApiError, withAuth } from '@/lib/middleware'
import User from '@/lib/models/User'
import dbConnect from '@/lib/mongodb'
import type { AuthResponse } from '@/lib/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  profileImage: z.string().url('Profile image must be a valid URL').optional(),
})

async function handler(request: AuthenticatedRequest) {
  try {
    // Connect to database
    await dbConnect()

    const user = request.user!
    const body = await request.json()

    // Validate input
    const validationResult = updateProfileSchema.safeParse(body)
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

    const { name, email, profileImage } = validationResult.data

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: user.userId }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email is already taken by another user' },
          { status: 409 }
        )
      }
    }

    // Update user
    const updateData: any = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
    }

    if (profileImage !== undefined) {
      updateData.profileImage = profileImage
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Return updated user data
    const response: AuthResponse = {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionExpiry: updatedUser.subscriptionExpiry,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        lastLogin: updatedUser.lastLogin
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error: any) {
    return handleApiError(error)
  }
}

export const PUT = withAuth(handler)
