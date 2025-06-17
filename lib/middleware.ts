import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, JWTPayload } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

/**
 * Middleware to protect API routes that require authentication
 */
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const user = getUserFromRequest(req)
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        )
      }
      
      // Add user to request object
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = user
      
      return await handler(authenticatedReq)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}

/**
 * Middleware to protect API routes that require premium subscription
 */
export function withPremiumAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest): Promise<NextResponse> => {
    const user = req.user!
    
    if (user.subscriptionStatus !== 'premium') {
      return NextResponse.json(
        { success: false, message: 'Premium subscription required' },
        { status: 403 }
      )
    }
    
    return await handler(req)
  })
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: any): NextResponse {
  console.error('API Error:', error)
  
  if (error.name === 'ValidationError') {
    return NextResponse.json(
      { success: false, message: 'Validation error', errors: error.errors },
      { status: 400 }
    )
  }
  
  if (error.code === 11000) {
    return NextResponse.json(
      { success: false, message: 'Email already exists' },
      { status: 409 }
    )
  }
  
  return NextResponse.json(
    { success: false, message: 'Internal server error' },
    { status: 500 }
  )
}
