"use client"

import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

export default function SimpleWalletConnect() {
  const { connected } = useWallet()

  return (
    <div className="flex items-center gap-2">
      {!connected ? (
        <WalletMultiButton className="!bg-purple-600 !hover:bg-purple-700 !text-white !px-4 !py-2 !rounded-md !text-sm !font-medium !border-none !transition-colors" />
      ) : (
        <WalletDisconnectButton className="!bg-red-600 !hover:bg-red-700 !text-white !px-4 !py-2 !rounded-md !text-sm !font-medium !border-none !transition-colors" />
      )}
    </div>
  )
}
