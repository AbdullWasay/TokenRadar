"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, Flame, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrendingTokenCardProps {
  token: {
    id: string
    name: string
    symbol: string
    image: string
    rank: number
    mentions: number
    socialScore: number
  }
  rank: number
}

export default function TrendingTokenCard({ token, rank }: TrendingTokenCardProps) {
  return (
    <Link href={`/token/${token.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-gray-200 dark:border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="flex items-center gap-1 font-bold">
              <Flame className="h-3 w-3 text-orange-500" />
              <span>#{rank}</span>
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.preventDefault()}>
              <Star className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image src={token.image || "/placeholder.svg"} alt={token.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-medium">{token.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">${token.symbol}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Social Score</p>
              <div className="flex items-center">
                <span className="font-medium">{token.socialScore}/100</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Mentions</p>
              <div className="flex items-center">
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="font-medium">{token.mentions}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
