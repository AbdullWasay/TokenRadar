import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

// Solana network configuration
export const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as WalletAdapterNetwork
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK)

// Admin wallet configuration (where subscription payments go)
export const ADMIN_WALLET_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS || ''

// Subscription settings
export const SUBSCRIPTION_PRICE_SOL = parseFloat(process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE_SOL || '2')
export const SUBSCRIPTION_DURATION_DAYS = parseInt(process.env.NEXT_PUBLIC_SUBSCRIPTION_DURATION_DAYS || '30')

// Create Solana connection
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

// Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
export const SUBSCRIPTION_PRICE_LAMPORTS = SUBSCRIPTION_PRICE_SOL * 1_000_000_000

// Validate admin wallet address
export const getAdminWalletPublicKey = (): PublicKey | null => {
  try {
    if (!ADMIN_WALLET_ADDRESS) {
      console.warn('Admin wallet address not configured')
      return null
    }
    return new PublicKey(ADMIN_WALLET_ADDRESS)
  } catch (error) {
    console.error('Invalid admin wallet address:', error)
    return null
  }
}

// Network configuration for wallet adapters
export const WALLET_ADAPTER_NETWORK = SOLANA_NETWORK

// RPC endpoint for wallet adapters
export const WALLET_ADAPTER_RPC_ENDPOINT = SOLANA_RPC_URL

// Default admin wallet for testing (you should replace this)
export const DEFAULT_ADMIN_WALLET = 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH' // Example devnet wallet
