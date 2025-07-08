import { getUserFromRequest } from '@/lib/auth'
import Wishlist from '@/lib/models/Wishlist'
import dbConnect from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// DELETE /api/wishlist/[id] - Remove token from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    
    // Try to delete by wishlist item ID first
    let deletedItem = await Wishlist.findOneAndDelete({ _id: id, userId: user.userId })

    // If not found by ID, try to delete by tokenId (for convenience)
    if (!deletedItem) {
      deletedItem = await Wishlist.findOneAndDelete({ tokenId: id, userId: user.userId })
    }

    if (!deletedItem) {
      return NextResponse.json(
        { success: false, error: 'Wishlist item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Token removed from wishlist successfully'
    })

  } catch (error: any) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
