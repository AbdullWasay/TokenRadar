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
    <>
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {tokens.map((token) => (
          <div key={token.id} className="bg-white dark:bg-gray-800 rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {token.symbol?.charAt(0) || 'T'}
                </div>
                <div>
                  <div className="font-medium text-sm">{token.name}</div>
                  <div className="text-xs text-gray-500">{token.symbol}</div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(token.contractAddress || token.id)}>
                    Copy Contract Address
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href={`https://dexscreener.com/solana/${token.contractAddress || token.id}`} target="_blank" rel="noopener noreferrer">
                      View on DexScreener
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSetAlert(token)}>
                    <Bell className="h-4 w-4 mr-2" />
                    Set Alert
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Market Cap:</span>
                <div className="font-medium">{token.marketCap || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <div className="font-medium">{new Date(token.created).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Bonded:</span>
                <div className="font-medium">
                  <span className={`px-2 py-1 rounded-full text-xs ${token.bonded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {token.bonded ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">24h Change:</span>
                <div className={`font-medium ${parseFloat(token.twentyFourHour || '0') >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.twentyFourHour || 'N/A'}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
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
      </div>

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
    </>
  )
}
