"use client"

import { WALLET_ADAPTER_NETWORK, WALLET_ADAPTER_RPC_ENDPOINT } from '@/lib/solana-config'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import React, { useMemo } from 'react'



interface SolanaWalletProviderProps {
  children: React.ReactNode
}

export default function SolanaWalletProvider({ children }: SolanaWalletProviderProps) {
  // Configure the network
  const network = WALLET_ADAPTER_NETWORK

  // Configure RPC endpoint
  const endpoint = useMemo(() => {
    if (WALLET_ADAPTER_RPC_ENDPOINT) {
      return WALLET_ADAPTER_RPC_ENDPOINT
    }
    return clusterApiUrl(network)
  }, [network])

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
