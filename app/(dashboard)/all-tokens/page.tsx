"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, SlidersHorizontal } from "lucide-react"
import TokenTable from "@/components/token-table"
import Pagination from "@/components/pagination"
import AddTokenModal from "@/components/add-token-modal"

// Mock data
const allTokens = Array(20)
  .fill(null)
  .map((_, index) => ({
    id: (index + 1).toString(),
    name: "Greed3",
    symbol: "Greed3",
    marketCap: "$71,867",
    created: "02/20/2023",
    bonded: "02/20/2023",
    fiveMin: "-0.31",
    oneHour: "-1.78",
    sixHour: "-0.31",
    twentyFourHour: "0.3",
    sevenDay: "39.27",
    chart: index % 2 === 0 ? "up" : "down",
  }))

export default function AllTokensPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const tokensPerPage = 6

  // Get current tokens
  const indexOfLastToken = currentPage * tokensPerPage
  const indexOfFirstToken = indexOfLastToken - tokensPerPage
  const currentTokens = allTokens.slice(indexOfFirstToken, indexOfLastToken)

  const totalPages = Math.ceil(allTokens.length / tokensPerPage)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">All Tokens</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <SlidersHorizontal size={16} />
            <span>Sort By</span>
          </Button>
          <Button size="sm" className="bg-purple-700 hover:bg-purple-800" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <TokenTable tokens={currentTokens} />
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <AddTokenModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
