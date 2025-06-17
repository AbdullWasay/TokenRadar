"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell, MoreHorizontal, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import type { TokenData } from "@/lib/types"
import BondStatus from "@/components/bond-status"

interface TokenGridProps {
  tokens: TokenData[]
}

export default function TokenGrid({ tokens }: TokenGridProps) {
  const [sortBy, setSortBy] = useState<keyof TokenData>("launchTime")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const sortedTokens = [...tokens].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1
    }
  })

  const handleSort = (column: keyof TokenData) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("desc")
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedTokens.map((token) => (
        <Card key={token.id} className="bg-[#1A1A1A] border-[#333333] hover:border-primary transition-all">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <Link href={`/token/${token.id}`} className="flex items-center">
                <Image
                  src={token.image || "/placeholder.svg"}
                  alt={token.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <h3 className="font-bold">{token.name}</h3>
                  <span className="text-sm text-gray-400">${token.symbol}</span>
                </div>
              </Link>

              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Star size={16} className="text-gray-400" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-[#333333]">
                    <DropdownMenuItem>
                      <Bell size={16} className="mr-2" />
                      Set Alert
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star size={16} className="mr-2" />
                      Add to Watchlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4">
              <BondStatus bondedPercentage={token.bondedPercentage} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-gray-400">Price</div>
                <div className="font-medium">${token.price.toFixed(8)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">24h</div>
                <div className={`font-medium ${token.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {token.change24h >= 0 ? "+" : ""}
                  {token.change24h}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Market Cap</div>
                <div className="font-medium">${token.marketCap.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Volume 24h</div>
                <div className="font-medium">${token.volume24h.toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm">
                <span className="text-gray-400">Launched:</span>{" "}
                {formatDistanceToNow(token.launchTime, { addSuffix: true })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
