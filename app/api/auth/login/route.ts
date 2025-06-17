import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import { comparePassword, generateToken, isValidEmail } from '@/lib/auth'
import { handleApiError } from '@/lib/middleware'
import type { LoginRequest, AuthResponse } from '@/lib/types'

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect()

    // Parse request body
    const body: LoginRequest = await request.json()

    // Validate input
    const validationResult = loginSchema.safeParse(body)
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

    const { email, password } = validationResult.data

    // Additional validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      subscriptionStatus: user.subscriptionStatus
    })

    // Return success response (without password)
    const response: AuthResponse = {
      success: true,
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin
      },
      token
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error: any) {
    return handleApiError(error)
  }
}
