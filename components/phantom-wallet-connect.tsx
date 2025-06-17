"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from '@solana/wallet-adapter-react'
import { Loader2, Wallet, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

export default function PhantomWalletConnect() {
  const { select, connect, connecting, connected, disconnect, publicKey } = useWallet()
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false)

  useEffect(() => {
    // Check if Phantom is installed
    const checkPhantom = () => {
      if (typeof window !== 'undefined') {
        setIsPhantomInstalled(!!(window.solana && window.solana.isPhantom))
      }
    }

    checkPhantom()
    
    // Check again after a short delay in case the extension loads slowly
    const timer = setTimeout(checkPhantom, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleConnect = async () => {
    try {
      if (isPhantomInstalled) {
        // Select Phantom wallet first
        select('phantom')
        // Then connect
        await connect()
      } else {
        // Redirect to Phantom website
        window.open('https://phantom.app/', '_blank')
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Wallet disconnection failed:', error)
    }
  }

  if (connected && publicKey) {
    return (
      <Button 
        onClick={handleDisconnect}
        variant="outline" 
        className="flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        <span>{publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}</span>
      </Button>
    )
  }

  if (!isPhantomInstalled) {
    return (
      <Button 
        onClick={handleConnect}
        className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        Install Phantom
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleConnect}
      disabled={connecting}
      className="bg-purple-600 hover:bg-purple-700"
    >
      {connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Phantom
        </>
      )}
    </Button>
  )
}
