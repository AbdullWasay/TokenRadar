"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import BondStatus from "@/components/bond-status"

interface TokenCardProps {
  token: {
    id: string
    name: string
    symbol: string
    price: number
    change: number
    image: string
    bondedPercentage?: number
  }
}

export default function TokenCard({ token }: TokenCardProps) {
  // Default to 100% bonded if not specified
  const bondedPercentage = token.bondedPercentage ?? 100

  return (
    <Link href={`/token/${token.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-gray-200 dark:border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image src={token.image || "/placeholder.svg"} alt={token.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-medium">{token.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">${token.symbol}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.preventDefault()}>
              <Star className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
            </Button>
          </div>

          <div className="mt-3">
            <BondStatus bondedPercentage={bondedPercentage} size="sm" />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
              <p className="font-medium">${token.price.toFixed(8)}</p>
            </div>
            <div className="flex items-center">
              {token.change > 0 ? (
                <div className="flex items-center text-green-500">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>{token.change.toFixed(2)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  <span>{Math.abs(token.change).toFixed(2)}%</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
