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
