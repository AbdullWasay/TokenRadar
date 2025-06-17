import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import { hashPassword, generateToken, isValidEmail, isValidPassword } from '@/lib/auth'
import { handleApiError } from '@/lib/middleware'
import type { SignupRequest, AuthResponse } from '@/lib/types'

// Validation schema
const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect()

    // Parse request body
    const body: SignupRequest = await request.json()

    // Validate input
    const validationResult = signupSchema.safeParse(body)
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

    const { name, email, password } = validationResult.data

    // Additional validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.message },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      subscriptionStatus: 'free'
    })

    await newUser.save()

    // Generate JWT token
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      subscriptionStatus: newUser.subscriptionStatus
    })

    // Return success response (without password)
    const response: AuthResponse = {
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        subscriptionStatus: newUser.subscriptionStatus,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      },
      token
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error: any) {
    return handleApiError(error)
  }
}
