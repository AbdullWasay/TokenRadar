"use client"

import BondStatus from "@/components/bond-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FrontendToken } from "@/lib/types"
import { Bell } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function NewlyBondedTokens() {
  const [bondedTokens, setBondedTokens] = useState<FrontendToken[]>([])
  const [bondedLoading, setBondedLoading] = useState(true)

  // Fetch top 2 tokens from bonded tokens API
  useEffect(() => {
    const fetchBondedTokens = async () => {
      try {
        setBondedLoading(true)
        const response = await fetch('/api/tokens/bonded?limit=2')
        const data = await response.json()

        if (data.success && data.data) {
          setBondedTokens(data.data.slice(0, 2)) // Take only top 2
        }
      } catch (error) {
        console.error('Error fetching bonded tokens:', error)
      } finally {
        setBondedLoading(false)
      }
    }

    fetchBondedTokens()
  }, [])

  const newlyBondedTokens = bondedTokens



  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          Newly Bonded Tokens
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {bondedLoading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : newlyBondedTokens.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No newly bonded tokens found</p>
            </div>
          ) : (
            newlyBondedTokens.map((token) => (
            <div key={token.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                
                  <div>
                    <Link href={`/token/${token.id}`} className="font-medium hover:underline">
                      {token.name}
                    </Link>
                    <div className="text-sm text-muted-foreground">{token.symbol}</div>
                    <div className="flex items-center mt-1">
                      <div className="text-xs text-muted-foreground mr-2">
                        <span className="font-medium text-foreground">MC: {token.marketCap}</span>
                      </div>
                    
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <BondStatus percentage={token.bondedPercentage || 0} />
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                   
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
        <div className="p-3 text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/bonded">View all bonded tokens</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
