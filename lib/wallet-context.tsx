"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
}

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  wallet: { publicKey: null, connected: false, balance: null },
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
})

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext)

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>({
    publicKey: null,
    connected: false,
    balance: null,
  })
  const [connecting, setConnecting] = useState(false)

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== "undefined" && window.solana) {
        try {
          // Check if the wallet is already connected
          const response = await window.solana.connect({ onlyIfTrusted: true })
          setWallet({
            publicKey: response.publicKey.toString(),
            connected: true,
            balance: await getBalance(response.publicKey.toString()),
          })
        } catch (error) {
          // Wallet not connected or not trusted
          console.log("Wallet not connected:", error)
        }
      }
    }

    checkWalletConnection()
  }, [])

  // Mock function to get balance - in a real app, this would call the Solana blockchain
  const getBalance = async (publicKey: string): Promise<number> => {
    // This is a mock - in a real app, you would fetch the actual balance from Solana
    return 10.5 // Mock SOL balance
  }

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.solana) {
      try {
        setConnecting(true)
        const response = await window.solana.connect()
        const balance = await getBalance(response.publicKey.toString())

        setWallet({
          publicKey: response.publicKey.toString(),
          connected: true,
          balance,
        })
      } catch (error) {
        console.error("Error connecting wallet:", error)
      } finally {
        setConnecting(false)
      }
    } else {
      window.open("https://phantom.app/", "_blank")
    }
  }

  // Disconnect wallet function
  const disconnectWallet = () => {
    if (typeof window !== "undefined" && window.solana) {
      window.solana.disconnect()
      setWallet({
        publicKey: null,
        connected: false,
        balance: null,
      })
    }
  }

  return (
    <WalletContext.Provider value={{ wallet, connecting, connectWallet, disconnectWallet }}>
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
