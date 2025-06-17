"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"
import { Loader2, Wallet } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function WalletConnect() {
  const { wallet, connecting, connectWallet, disconnectWallet } = useWallet()
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

  if (wallet.connected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>{formatAddress(wallet.publicKey!)}</span>
            <span className="text-green-500 text-xs font-medium ml-1">{wallet.balance?.toFixed(2)} SOL</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyAddress}>{copied ? "Copied!" : "Copy Address"}</DropdownMenuItem>
          <DropdownMenuItem onClick={disconnectWallet}>Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={connectWallet} disabled={connecting} className="bg-purple-600 hover:bg-purple-700">
      {connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
