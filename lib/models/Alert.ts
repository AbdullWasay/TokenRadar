import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IAlert extends Document {
  userId: string
  tokenId: string
  tokenName: string
  tokenSymbol: string
  alertType: 'price' | 'percentage' | 'bond'
  condition: 'above' | 'below' | 'increases' | 'decreases' | 'reaches'
  threshold: number
  timeframe?: '5m' | '1h' | '6h' | '24h' | '7d'
  isActive: boolean
  isTriggered: boolean
  triggeredAt?: Date
  triggeredPrice?: number
  triggeredPercentage?: number
  createdAt: Date
  updatedAt: Date
}

const AlertSchema: Schema<IAlert> = new Schema(
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
    alertType: {
      type: String,
      enum: ['price', 'percentage', 'bond'],
      required: [true, 'Alert type is required']
    },
    condition: {
      type: String,
      enum: ['above', 'below', 'increases', 'decreases', 'reaches'],
      required: [true, 'Condition is required']
    },
    threshold: {
      type: Number,
      required: [true, 'Threshold is required'],
      min: [0, 'Threshold must be positive']
    },
    timeframe: {
      type: String,
      enum: ['5m', '1h', '6h', '24h', '7d'],
      required: function(this: IAlert) {
        return this.alertType === 'percentage'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isTriggered: {
      type: Boolean,
      default: false
    },
    triggeredAt: {
      type: Date,
      default: null
    },
    triggeredPrice: {
      type: Number,
      default: null
    },
    triggeredPercentage: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// Compound indexes for efficient queries
AlertSchema.index({ userId: 1, isActive: 1 })
AlertSchema.index({ tokenId: 1, isActive: 1 })
AlertSchema.index({ alertType: 1, isActive: 1 })
AlertSchema.index({ isTriggered: 1, isActive: 1 })

// Prevent re-compilation during development
const Alert: Model<IAlert> = mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema)

export default Alert
