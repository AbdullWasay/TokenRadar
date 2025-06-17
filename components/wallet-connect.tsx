"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWallet } from "@/lib/wallet-context"
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { CheckCircle, Wallet } from "lucide-react"
import { useState } from "react"

export default function WalletConnect() {
  const { wallet } = useWallet()
  const solanaWallet = useSolanaWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (wallet.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (wallet.connected && wallet.publicKey) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-green-600 font-medium">Connected</span>
        </div>
        <div className="text-sm text-gray-600">
          {wallet.balance !== null ? `${wallet.balance.toFixed(4)} SOL` : 'Loading...'}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>{formatAddress(wallet.publicKey)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={copyAddress}>{copied ? "Copied!" : "Copy Address"}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => solanaWallet.disconnect()}>Disconnect</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Custom wallet connection with better extension detection
  const handleWalletConnect = async () => {
    try {
      // First select Phantom wallet
      await solanaWallet.select('phantom')
      // Then connect
      await solanaWallet.connect()
    } catch (error) {
      console.error('Phantom connection failed:', error)
      // If Phantom fails, open wallet selection modal
      try {
        await solanaWallet.select(null)
      } catch (modalError) {
        console.error('Wallet modal failed:', modalError)
      }
    }
  }

  const isPhantomInstalled = typeof window !== 'undefined' && window.solana && window.solana.isPhantom

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Phantom detection:', {
      hasWindow: typeof window !== 'undefined',
      hasSolana: !!window.solana,
      isPhantom: window.solana?.isPhantom,
      isPhantomInstalled
    })
  }

  return (
    <div className="flex items-center gap-2">
      {/* Use WalletMultiButton - this should work reliably */}
      <div className="wallet-adapter-button-trigger">
        <WalletMultiButton className="!bg-purple-600 !hover:bg-purple-700 !text-white !px-4 !py-2 !rounded-md !text-sm !font-medium !flex !items-center !gap-2 !border-none !transition-colors" />
      </div>
    </div>
  )
}
