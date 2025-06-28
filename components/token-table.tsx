"use client"
import AlertModal from "@/components/alert-modal"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { FrontendToken } from "@/lib/types"
import { Bell, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface TokenTableProps {
  tokens: FrontendToken[]
}



export default function TokenTable({ tokens }: TokenTableProps) {
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<FrontendToken | null>(null)

  const handleSetAlert = (token: FrontendToken) => {
    setSelectedToken(token)
    setAlertModalOpen(true)
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 text-left">
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Symbol</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Market Cap</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Created</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Bonded</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Contract</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">5mP</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">1hP</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">6hP</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">24hP</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => {
            // Helper function to get color class for price changes
            const getPriceChangeColor = (value: string) => {
              if (value === "N/A") return "text-gray-400"
              const numValue = parseFloat(value)
              if (numValue > 0) return "text-green-500"
              if (numValue < 0) return "text-red-500"
              return "text-gray-500"
            }

            // Helper function to format price change with + sign
            const formatPriceChange = (value: string) => {
              if (value === "N/A") return "N/A"
              const numValue = parseFloat(value)
              return numValue > 0 ? `+${value}%` : `${value}%`
            }

            return (
              <tr key={token.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    {token.image && (
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-800">
                        <img
                          src={token.image}
                          alt={token.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <Link href={`/token/${token.id}`} className="text-sm font-medium hover:text-indigo-700 dark:hover:text-indigo-400">
                      {token.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{token.symbol}</td>
                <td className="px-4 py-3 text-sm text-yellow-500">{token.marketCap}</td>
                <td className="px-4 py-3 text-sm">{token.created}</td>
                <td className="px-4 py-3 text-sm">
                  {token.bonded || (
                    <span className="text-gray-400 text-xs">
                      {token.bondedPercentage ? `${token.bondedPercentage}%` : 'Not bonded'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center">
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {(token.contractAddress || token.id).slice(0, 6)}...{(token.contractAddress || token.id).slice(-4)}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(token.contractAddress || token.id)
                        alert('Contract address copied!')
                      }}
                      className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Copy contract address"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td className={`px-4 py-3 text-sm ${getPriceChangeColor(token.fiveMin)}`}>
                  {formatPriceChange(token.fiveMin)}
                </td>
                <td className={`px-4 py-3 text-sm ${getPriceChangeColor(token.oneHour)}`}>
                  {formatPriceChange(token.oneHour)}
                </td>
                <td className={`px-4 py-3 text-sm ${getPriceChangeColor(token.sixHour)}`}>
                  {formatPriceChange(token.sixHour)}
                </td>
                <td className={`px-4 py-3 text-sm ${getPriceChangeColor(token.twentyFourHour)}`}>
                  {formatPriceChange(token.twentyFourHour)}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/token/${token.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(token.contractAddress || token.id)
                          alert(`Contract address copied: ${token.contractAddress || token.id}`)
                        }}
                      >
                        Copy Contract Address
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a
                          href={`https://dexscreener.com/solana/${token.contractAddress || token.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on DexScreener
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a
                          href={`https://solscan.io/token/${token.contractAddress || token.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Solscan
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetAlert(token)}>
                        <Bell className="h-4 w-4 mr-2" />
                        Set Alert
                      </DropdownMenuItem>
                      {token.website && (
                        <DropdownMenuItem>
                          <a href={token.website} target="_blank" rel="noopener noreferrer">
                            Visit Website
                          </a>
                        </DropdownMenuItem>
                      )}
                      {token.twitter && (
                        <DropdownMenuItem>
                          <a href={token.twitter} target="_blank" rel="noopener noreferrer">
                            View Twitter
                          </a>
                        </DropdownMenuItem>
                      )}
                      {token.telegram && (
                        <DropdownMenuItem>
                          <a href={token.telegram} target="_blank" rel="noopener noreferrer">
                            View Telegram
                          </a>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {selectedToken && (
        <AlertModal
          isOpen={alertModalOpen}
          onClose={() => {
            setAlertModalOpen(false)
            setSelectedToken(null)
          }}
          tokenId={selectedToken.id}
          tokenName={selectedToken.name}
          tokenSymbol={selectedToken.symbol}
          currentBondingPercentage={selectedToken.bondedPercentage}
        />
      )}
    </div>
  )
}
