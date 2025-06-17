import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { TokenDetailData } from "@/lib/types"

interface TokenStatsProps {
  token: TokenDetailData
}

export default function TokenStats({ token }: TokenStatsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Token Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</div>
              <p className="text-sm">{token.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Launch Time</div>
                <div className="text-sm font-medium">{formatDistanceToNow(token.launchTime, { addSuffix: true })}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bonded</div>
                <div className="text-sm font-medium">{token.bondedPercentage}%</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Links</div>
              <div className="flex flex-wrap gap-2">
                {token.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    asChild
                  >
                    <a href={token.website} target="_blank" rel="noopener noreferrer">
                      Website
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </Button>
                )}
                {token.twitter && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    asChild
                  >
                    <a href={token.twitter} target="_blank" rel="noopener noreferrer">
                      Twitter
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </Button>
                )}
                {token.telegram && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    asChild
                  >
                    <a href={token.telegram} target="_blank" rel="noopener noreferrer">
                      Telegram
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Market Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
              <span className="text-sm font-medium">${token.price.toFixed(8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">24h Change</span>
              <span className={`text-sm font-medium ${token.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                {token.change24h >= 0 ? "+" : ""}
                {token.change24h}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Market Cap</span>
              <span className="text-sm font-medium">${token.marketCap.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">24h Volume</span>
              <span className="text-sm font-medium">${token.volume24h.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Holders</span>
              <span className="text-sm font-medium">{token.holders.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Supply</span>
              <span className="text-sm font-medium">{token.totalSupply}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Contract Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contract Address</div>
              <div className="flex items-center">
                <code className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded w-full overflow-hidden text-ellipsis">
                  {token.contractAddress}
                </code>
                <Button variant="ghost" size="sm" className="ml-1 h-8 w-8 p-0">
                  <ExternalLink size={14} />
                </Button>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pair Address</div>
              <div className="flex items-center">
                <code className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded w-full overflow-hidden text-ellipsis">
                  {token.pairAddress}
                </code>
                <Button variant="ghost" size="sm" className="ml-1 h-8 w-8 p-0">
                  <ExternalLink size={14} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
