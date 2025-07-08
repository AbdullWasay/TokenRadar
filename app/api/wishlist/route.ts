import { getUserFromRequest } from '@/lib/auth'
import Wishlist from '@/lib/models/Wishlist'
import dbConnect from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/wishlist - Starting request')
    await dbConnect()
    console.log('Database connected successfully')

    const user = getUserFromRequest(request)
    console.log('User from token:', user)
    if (!user) {
      console.log('No user ID found, returning unauthorized')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Fetching wishlist items for user:', user.userId)
    const wishlistItems = await Wishlist.find({ userId: user.userId })
      .sort({ addedAt: -1 })
      .lean()
    console.log('Found wishlist items:', wishlistItems)

    const transformedItems = wishlistItems.map(item => ({
      id: item._id.toString(),
      userId: item.userId,
      tokenId: item.tokenId,
      tokenName: item.tokenName,
      tokenSymbol: item.tokenSymbol,
      tokenAddress: item.tokenAddress,
      addedAt: item.addedAt
    }))
    console.log('Transformed items:', transformedItems)

    const response = {
      success: true,
      data: transformedItems,
      message: 'Wishlist retrieved successfully'
    }
    console.log('Sending GET response:', response)

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Error fetching wishlist:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { success: false, error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Add token to wishlist
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/wishlist - Starting request')
    await dbConnect()
    console.log('Database connected successfully')

    const user = getUserFromRequest(request)
    console.log('User from token:', user)
    if (!user) {
      console.log('No user ID found, returning unauthorized')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Request body:', body)
    const { tokenId, tokenName, tokenSymbol, tokenAddress } = body

    // Validation
    if (!tokenId || !tokenName || !tokenSymbol) {
      console.log('Validation failed - missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields: tokenId, tokenName, tokenSymbol' },
        { status: 400 }
      )
    }

    // Check if token is already in wishlist
    console.log('Checking for existing item with userId:', user.userId, 'tokenId:', tokenId)
    const existingItem = await Wishlist.findOne({ userId: user.userId, tokenId })
    console.log('Existing item found:', existingItem)
    if (existingItem) {
      console.log('Token already in wishlist, returning conflict')
      return NextResponse.json(
        { success: false, error: 'Token already in wishlist' },
        { status: 409 }
      )
    }

    // Create new wishlist item
    console.log('Creating new wishlist item')
    const newWishlistItem = new Wishlist({
      userId: user.userId,
      tokenId,
      tokenName,
      tokenSymbol,
      tokenAddress
    })
    console.log('New wishlist item object:', newWishlistItem)

    const savedItem = await newWishlistItem.save()
    console.log('Saved item:', savedItem)

    const transformedItem = {
      id: savedItem._id.toString(),
      userId: savedItem.userId,
      tokenId: savedItem.tokenId,
      tokenName: savedItem.tokenName,
      tokenSymbol: savedItem.tokenSymbol,
      tokenAddress: savedItem.tokenAddress,
      addedAt: savedItem.addedAt
    }
    console.log('Transformed item:', transformedItem)

    const response = {
      success: true,
      data: transformedItem,
      message: 'Token added to wishlist successfully'
    }
    console.log('Sending response:', response)

    return NextResponse.json(response, { status: 201 })

  } catch (error: any) {
    console.error('Error adding to wishlist:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { success: false, error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}

// PUT /api/wishlist - Check wishlist status for multiple tokens
export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/wishlist - Checking wishlist status')
    await dbConnect()

    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tokenIds } = body

    if (!tokenIds || !Array.isArray(tokenIds)) {
      return NextResponse.json(
        { success: false, error: 'tokenIds array is required' },
        { status: 400 }
      )
    }

    // Find which tokens are in wishlist
    const wishlistItems = await Wishlist.find({
      userId: user.userId,
      tokenId: { $in: tokenIds }
    }).lean()

    const wishlistTokenIds = wishlistItems.map(item => item.tokenId)

    const response = {
      success: true,
      data: wishlistTokenIds,
      message: 'Wishlist status checked successfully'
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Error checking wishlist status:', error)
    return NextResponse.json(
      { success: false, error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}
