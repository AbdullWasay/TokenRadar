import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Wishlist from '@/lib/models/Wishlist'

// Test endpoint to verify wishlist functionality
export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    await dbConnect()
    console.log('Database connected successfully')

    // Test creating a wishlist item
    console.log('Testing wishlist creation...')
    const testItem = new Wishlist({
      userId: 'test-user-123',
      tokenId: 'test-token-456',
      tokenName: 'Test Token',
      tokenSymbol: 'TEST',
      tokenAddress: '0x123...'
    })

    console.log('Test item object:', testItem)
    const savedItem = await testItem.save()
    console.log('Saved test item:', savedItem)

    // Test fetching wishlist items
    console.log('Testing wishlist fetch...')
    const items = await Wishlist.find({ userId: 'test-user-123' })
    console.log('Fetched items:', items)

    // Clean up test data
    await Wishlist.deleteMany({ userId: 'test-user-123' })
    console.log('Test data cleaned up')

    return NextResponse.json({
      success: true,
      message: 'Wishlist functionality test passed',
      data: {
        created: savedItem,
        fetched: items
      }
    })

  } catch (error: any) {
    console.error('Test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
