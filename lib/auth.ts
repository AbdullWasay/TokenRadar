import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local')
}

export interface JWTPayload {
  userId: string
  email: string
  name: string
  subscriptionStatus: 'free' | 'premium'
}

/**
 * Generate JWT token for user
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.substring(7) // Remove 'Bearer ' prefix
}

/**
 * Get user from request token
 */
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = extractTokenFromHeader(request)
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' }
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'Password cannot exceed 128 characters' }
  }
  
  return { valid: true }
}
