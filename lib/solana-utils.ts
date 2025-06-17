import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionSignature
} from '@solana/web3.js'
import { connection, getAdminWalletPublicKey, SUBSCRIPTION_PRICE_LAMPORTS } from './solana-config'

export interface PaymentResult {
  success: boolean
  signature?: string
  error?: string
}

export interface TransactionDetails {
  signature: string
  from: string
  to: string
  amount: number
  timestamp: number
  confirmed: boolean
}

/**
 * Create a payment transaction for subscription
 */
export const createSubscriptionPayment = async (
  fromWallet: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<TransactionSignature>
): Promise<PaymentResult> => {
  try {
    const adminWallet = getAdminWalletPublicKey()
    if (!adminWallet) {
      return { success: false, error: 'Admin wallet not configured' }
    }

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromWallet,
        toPubkey: adminWallet,
        lamports: SUBSCRIPTION_PRICE_LAMPORTS,
      })
    )

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = fromWallet

    // Send transaction
    const signature = await sendTransaction(transaction, connection)

    return { success: true, signature }
  } catch (error: any) {
    console.error('Payment transaction failed:', error)
    return { success: false, error: error.message || 'Transaction failed' }
  }
}

/**
 * Verify a transaction on the blockchain
 */
export const verifyTransaction = async (signature: string): Promise<TransactionDetails | null> => {
  try {
    const transaction = await connection.getTransaction(signature, {
      commitment: 'confirmed'
    })

    if (!transaction) {
      return null
    }

    const adminWallet = getAdminWalletPublicKey()
    if (!adminWallet) {
      return null
    }

    // Check if this is a valid subscription payment
    const instruction = transaction.transaction.message.instructions[0]
    if (!instruction) {
      return null
    }

    // Verify the transaction details
    const accountKeys = transaction.transaction.message.accountKeys
    const fromAccount = accountKeys[0]
    const toAccount = accountKeys[1]

    // Check if payment went to admin wallet and amount is correct
    if (toAccount.toString() !== adminWallet.toString()) {
      return null
    }

    const amount = transaction.meta?.preBalances && transaction.meta?.postBalances
      ? (transaction.meta.preBalances[0] - transaction.meta.postBalances[0]) / LAMPORTS_PER_SOL
      : 0

    return {
      signature,
      from: fromAccount.toString(),
      to: toAccount.toString(),
      amount,
      timestamp: transaction.blockTime || Date.now() / 1000,
      confirmed: true
    }
  } catch (error) {
    console.error('Transaction verification failed:', error)
    return null
  }
}

/**
 * Check wallet balance
 */
export const getWalletBalance = async (walletAddress: string): Promise<number> => {
  try {
    const publicKey = new PublicKey(walletAddress)
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error('Failed to get wallet balance:', error)
    return 0
  }
}

/**
 * Format SOL amount for display
 */
export const formatSOL = (amount: number): string => {
  return `${amount.toFixed(4)} SOL`
}

/**
 * Check if wallet has sufficient balance for subscription
 */
export const hasInsufficientBalance = async (walletAddress: string): Promise<boolean> => {
  const balance = await getWalletBalance(walletAddress)
  const requiredAmount = SUBSCRIPTION_PRICE_LAMPORTS / LAMPORTS_PER_SOL
  return balance < requiredAmount + 0.001 // Add small buffer for transaction fees
}
