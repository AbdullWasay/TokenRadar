import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IWishlist extends Document {
  userId: string
  tokenId: string
  tokenName: string
  tokenSymbol: string
  tokenAddress?: string
  addedAt: Date
}

const WishlistSchema: Schema<IWishlist> = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true
    },
    tokenId: {
      type: String,
      required: [true, 'Token ID is required'],
      index: true
    },
    tokenName: {
      type: String,
      required: [true, 'Token name is required']
    },
    tokenSymbol: {
      type: String,
      required: [true, 'Token symbol is required']
    },
    tokenAddress: {
      type: String,
      default: null
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

// Compound index to prevent duplicate entries
WishlistSchema.index({ userId: 1, tokenId: 1 }, { unique: true })

// Prevent re-compilation during development
const Wishlist: Model<IWishlist> = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema)

export default Wishlist
