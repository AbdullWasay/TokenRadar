"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@solana/wallet-adapter-react'

export default function TestWalletPage() {
  const { select, connect, disconnect, connecting, connected, publicKey, wallets } = useWallet()
  const [phantomDetected, setPhantomDetected] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const checkWallets = () => {
      const info = {
        hasWindow: typeof window !== 'undefined',
        hasSolana: typeof window !== 'undefined' && !!window.solana,
        isPhantom: typeof window !== 'undefined' && window.solana?.isPhantom,
        availableWallets: wallets.map(w => ({ name: w.adapter.name, readyState: w.readyState })),
        phantomWallet: wallets.find(w => w.adapter.name === 'Phantom'),
      }
      
      setDebugInfo(info)
      setPhantomDetected(info.isPhantom || false)
      
      console.log('Wallet Debug Info:', info)
    }

    checkWallets()
    
    // Check again after delay
    const timer = setTimeout(checkWallets, 2000)
    return () => clearTimeout(timer)
  }, [wallets])

  const handlePhantomConnect = async () => {
    try {
      console.log('Attempting to connect to Phantom...')
      
      // Find Phantom wallet
      const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom')
      
      if (phantomWallet) {
        console.log('Phantom wallet found:', phantomWallet)
        await select(phantomWallet.adapter.name)
        await connect()
      } else {
        console.log('Phantom wallet not found in available wallets')
        // Try direct connection
        await select('phantom')
        await connect()
      }
    } catch (error) {
      console.error('Phantom connection error:', error)
    }
  }

  const handleDirectPhantomConnect = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        console.log('Connecting directly to Phantom extension...')
        const response = await window.solana.connect()
        console.log('Direct connection response:', response)
      } else {
        console.log('Phantom extension not detected')
      }
    } catch (error) {
      console.error('Direct Phantom connection error:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Connection Status</h3>
            <p>Connected: {connected ? 'Yes' : 'No'}</p>
            <p>Connecting: {connecting ? 'Yes' : 'No'}</p>
            <p>Public Key: {publicKey?.toString() || 'None'}</p>
          </div>

          {/* Debug Information */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2">Debug Information</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          {/* Connection Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={handlePhantomConnect}
              disabled={connecting}
              className="w-full"
            >
              Connect via Wallet Adapter
            </Button>
            
            <Button 
              onClick={handleDirectPhantomConnect}
              disabled={connecting}
              variant="outline"
              className="w-full"
            >
              Connect Directly to Phantom
            </Button>

            <Button 
              onClick={() => select(null)}
              variant="outline"
              className="w-full"
            >
              Open Wallet Selection Modal
            </Button>

            {connected && (
              <Button 
                onClick={disconnect}
                variant="destructive"
                className="w-full"
              >
                Disconnect
              </Button>
            )}
          </div>

          {/* Available Wallets */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium mb-2">Available Wallets</h3>
            {wallets.map((wallet, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span>{wallet.adapter.name}</span>
                <span className="text-sm text-gray-600">
                  {wallet.readyState === 'Installed' ? 'Installed' : 
                   wallet.readyState === 'NotDetected' ? 'Not Detected' : 
                   wallet.readyState}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
