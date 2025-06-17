"use client"

import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getWalletBalance } from './solana-utils'

// Define the types for our wallet connection
type Wallet = {
  publicKey: string | null
  connected: boolean
  balance: number | null
}

type WalletContextType = {
  wallet: Wallet
  connecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  refreshBalance: () => Promise<void>
}

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  wallet: { publicKey: null, connected: false, balance: null },
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshBalance: async () => {},
})

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext)

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const solanaWallet = useSolanaWallet()
  const [wallet, setWallet] = useState<Wallet>({
    publicKey: null,
    connected: false,
    balance: null,
  })
  const [connecting, setConnecting] = useState(false)

  // Update wallet state when Solana wallet changes
  useEffect(() => {
    const updateWalletState = async () => {
      if (solanaWallet.connected && solanaWallet.publicKey) {
        try {
          const balance = await getWalletBalance(solanaWallet.publicKey.toString())
          setWallet({
            publicKey: solanaWallet.publicKey.toString(),
            connected: true,
            balance,
          })
        } catch (error) {
          console.error('Error fetching balance:', error)
          setWallet({
            publicKey: solanaWallet.publicKey.toString(),
            connected: true,
            balance: 0,
          })
        }
      } else {
        setWallet({
          publicKey: null,
          connected: false,
          balance: null,
        })
      }
    }

    updateWalletState()
  }, [solanaWallet.connected, solanaWallet.publicKey])

  // Update connecting state
  useEffect(() => {
    setConnecting(solanaWallet.connecting)
  }, [solanaWallet.connecting])

  // Refresh balance function
  const refreshBalance = async () => {
    if (wallet.publicKey) {
      try {
        const balance = await getWalletBalance(wallet.publicKey)
        setWallet(prev => ({ ...prev, balance }))
      } catch (error) {
        console.error("Error refreshing balance:", error)
      }
    }
  }

  // Connect wallet function
  const connectWallet = async () => {
    try {
      await solanaWallet.connect()
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      await solanaWallet.disconnect()
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  return (
    <WalletContext.Provider value={{ wallet, connecting, connectWallet, disconnectWallet, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  )
}

// Add this to global.d.ts or a similar type definition file
declare global {
  interface Window {
    solana?: {
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => Promise<void>
      signTransaction: (transaction: any) => Promise<any>
      signAllTransactions: (transactions: any[]) => Promise<any[]>
    }
  }
}
