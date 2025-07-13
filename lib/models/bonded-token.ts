import mongoose from 'mongoose'

// Interface for bonded tokens in our database
export interface IBondedToken {
  mint: string
  name: string
  symbol: string
  description: string
  image_uri: string
  metadata_uri: string
  twitter?: string
  telegram?: string
  bonding_curve: string
  associated_bonding_curve: string
  creator: string
  created_timestamp: number
  bonded_timestamp: number
  raydium_pool?: string
  virtual_sol_reserves: number
  virtual_token_reserves: number
  total_supply: number
  website?: string
  usd_market_cap: number
  bonding_percentage: number
  is_bonded: boolean
  last_updated: number
}

// MongoDB schema for bonded tokens
const bondedTokenSchema = new mongoose.Schema<IBondedToken>({
  mint: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  description: { type: String, required: true },
  image_uri: { type: String, required: true },
  metadata_uri: { type: String, required: true },
  twitter: { type: String, default: null },
  telegram: { type: String, default: null },
  bonding_curve: { type: String, required: true },
  associated_bonding_curve: { type: String, required: true },
  creator: { type: String, required: true },
  created_timestamp: { type: Number, required: true, index: true },
  bonded_timestamp: { type: Number, required: true, index: true },
  raydium_pool: { type: String, default: null },
  virtual_sol_reserves: { type: Number, required: true },
  virtual_token_reserves: { type: Number, required: true },
  total_supply: { type: Number, required: true },
  website: { type: String, default: null },
  usd_market_cap: { type: Number, required: true },
  bonding_percentage: { type: Number, required: true, index: true },
  is_bonded: { type: Boolean, required: true, index: true },
  last_updated: { type: Number, required: true, index: true }
}, {
  timestamps: true,
  collection: 'bonded_tokens'
})

// Indexes for efficient queries
bondedTokenSchema.index({ bonded_timestamp: -1 })
bondedTokenSchema.index({ bonding_percentage: -1 })
bondedTokenSchema.index({ is_bonded: 1, bonded_timestamp: -1 })
bondedTokenSchema.index({ name: 'text', symbol: 'text' })

export const BondedToken = mongoose.models.BondedToken || mongoose.model<IBondedToken>('BondedToken', bondedTokenSchema)
