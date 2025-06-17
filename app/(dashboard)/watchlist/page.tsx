"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, SlidersHorizontal, Star, Trash2 } from "lucide-react"
import TokenCard from "@/components/token-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AddTokenModal from "@/components/add-token-modal"

// Mock data
const watchlistTokens = [
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    price: 65432.1,
    change: 2.5,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change: -1.2,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Solana",
    symbol: "SOL",
    price: 145.67,
    change: 5.8,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Cardano",
    symbol: "ADA",
    price: 0.58,
    change: -0.7,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.12345,
    change: 12.3,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Shiba Inu",
    symbol: "SHIB",
    price: 0.00002345,
    change: 8.7,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTokens = watchlistTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Watchlist</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your favorite tokens in one place</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" /> Add Token
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>My Watchlist</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search tokens..."
                  className="pl-10 w-full sm:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Sort by Name</DropdownMenuItem>
                  <DropdownMenuItem>Sort by Price</DropdownMenuItem>
                  <DropdownMenuItem>Sort by Change</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="gainers">Gainers</TabsTrigger>
              <TabsTrigger value="losers">Losers</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredTokens.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">No tokens found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery ? "No tokens match your search" : "Your watchlist is empty"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="mr-2 h-4 w-4" /> Add Token
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTokens
                .filter((token) => {
                  if (activeTab === "gainers") return token.change > 0
                  if (activeTab === "losers") return token.change < 0
                  return true
                })
                .map((token) => (
                  <div key={token.id} className="relative group">
                    <TokenCard token={token} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Remove from watchlist functionality would go here
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddTokenModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
