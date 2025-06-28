export interface TokenData {
  id: string
  name: string
  symbol: string
  price: number
  marketCap: number
  change24h: number
  volume24h: number
  launchTime: number
  bondedPercentage: number
  bondedTime?: number
  image: string
}

// TokenTracker API response interface
export interface TokenTrackerToken {
  associated_bonding_curve: string
  bonding_curve: string
  created_timestamp: number
  creator: string
  description: string
  image_url: string
  last_trade_timestamp: number
  metadata_uri: string
  name: string
  raydium_pool: string | null
  symbol: string
  telegram: string | null
  token_address: string
  total_supply: number
  twitter: string | null
  usd_market_cap: number
  virtual_sol_reserves: string
  virtual_token_reserves: string
  website: string | null
}

// Frontend token interface for all-tokens page
export interface FrontendToken {
  id: string
  name: string
  symbol: string
  marketCap: string
  created: string
  bonded: string
  fiveMin: string
  oneHour: string
  sixHour: string
  twentyFourHour: string
  image?: string
  description?: string
  website?: string
  twitter?: string
  telegram?: string
  contractAddress?: string
  totalSupply?: string
  bondedPercentage?: number
  creator?: string
  virtualSolReserves?: string
  virtualTokenReserves?: string
  bondingCurve?: string
  associatedBondingCurve?: string
  lastTradeTimestamp?: number
  metadataUri?: string
}

// API response interface for tokens endpoint
export interface TokensApiResponse {
  success: boolean
  data?: FrontendToken[]
  count?: number
  lastUpdated?: string
  message?: string
  error?: string
}

export interface Transaction {
  id: string
  type: "buy" | "sell"
  amount: string
  value: string
  time: number
  address: string
}

export interface TokenDetailData extends TokenData {
  description: string
  website?: string
  twitter?: string
  telegram?: string
  contractAddress: string
  holders: number
  totalSupply: string
  pairAddress: string
  transactions: Transaction[]
  fiveMin?: string
  oneHour?: string
  sixHour?: string
  twentyFourHour?: string
}

export interface BondEvent {
  id: string
  tokenId: string
  tokenName: string
  tokenSymbol: string
  bondedPercentage: number
  timestamp: number
  image: string
}

// Authentication Types
export interface User {
  id: string
  name: string
  email: string
  profileImage?: string
  subscriptionStatus: 'free' | 'premium'
  subscriptionExpiry?: Date
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

// Alert Types
export interface Alert {
  id: string
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

export interface CreateAlertRequest {
  tokenId: string
  tokenName: string
  tokenSymbol: string
  alertType: 'price' | 'percentage' | 'bond'
  condition: 'above' | 'below' | 'increases' | 'decreases' | 'reaches'
  threshold: number
  timeframe?: '5m' | '1h' | '6h' | '24h' | '7d'
}

export interface AlertsApiResponse {
  success: boolean
  data?: Alert[]
  count?: number
  message?: string
  error?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}
