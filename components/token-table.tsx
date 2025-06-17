"use client"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LineChart, Line, ResponsiveContainer } from "recharts"

interface TokenTableProps {
  tokens: {
    id: string
    name: string
    symbol: string
    marketCap: string
    created: string
    bonded: string
    fiveMin: string
    oneHour: string
    sixHour: string
    twentyFourHour: string
    sevenDay: string
    chart: "up" | "down"
  }[]
}

// Mock data for charts
const upChartData = [
  { value: 10 },
  { value: 15 },
  { value: 13 },
  { value: 17 },
  { value: 20 },
  { value: 25 },
  { value: 23 },
  { value: 30 },
]

const downChartData = [
  { value: 30 },
  { value: 25 },
  { value: 27 },
  { value: 20 },
  { value: 15 },
  { value: 17 },
  { value: 13 },
  { value: 10 },
]

export default function TokenTable({ tokens }: TokenTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Name</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Symbol</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Market Cap</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Created</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Bonded</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">5mP</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">1hP</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">6hP</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">24hP</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">5mv</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Last 7 days</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link href={`/token/${token.id}`} className="text-sm font-medium hover:text-indigo-700">
                  {token.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm">{token.symbol}</td>
              <td className="px-4 py-3 text-sm text-yellow-500">{token.marketCap}</td>
              <td className="px-4 py-3 text-sm">{token.created}</td>
              <td className="px-4 py-3 text-sm">{token.bonded}</td>
              <td className="px-4 py-3 text-sm text-red-500">{token.fiveMin}</td>
              <td className="px-4 py-3 text-sm text-red-500">{token.oneHour}</td>
              <td className="px-4 py-3 text-sm text-red-500">{token.sixHour}</td>
              <td className="px-4 py-3 text-sm text-green-500">{token.twentyFourHour}</td>
              <td className="px-4 py-3 text-sm text-green-500">{token.sevenDay}</td>
              <td className="px-4 py-3">
                <div className="h-8 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={token.chart === "up" ? upChartData : downChartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={token.chart === "up" ? "#10B981" : "#EF4444"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </td>
              <td className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
                    <DropdownMenuItem>Set Alert</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
