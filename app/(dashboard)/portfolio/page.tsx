"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ArrowUp, Download, MoreHorizontal, Plus, RefreshCw } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import AddTokenModal from "@/components/add-token-modal"

// Mock data
const portfolioValue = [
  { date: "Jan 1", value: 10000 },
  { date: "Feb 1", value: 12000 },
  { date: "Mar 1", value: 11500 },
  { date: "Apr 1", value: 13500 },
  { date: "May 1", value: 14800 },
  { date: "Jun 1", value: 16200 },
  { date: "Jul 1", value: 18500 },
]

const portfolioDistribution = [
  { name: "Bitcoin", value: 45, color: "#F7931A" },
  { name: "Ethereum", value: 30, color: "#627EEA" },
  { name: "Solana", value: 15, color: "#00FFA3" },
  { name: "Cardano", value: 5, color: "#0033AD" },
  { name: "Others", value: 5, color: "#6366F1" },
]

const portfolioTokens = [
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    amount: 0.45,
    value: 29250,
    price: 65000,
    change24h: 2.5,
    allocation: 45,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    amount: 5.2,
    value: 19500,
    price: 3750,
    change24h: -1.2,
    allocation: 30,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Solana",
    symbol: "SOL",
    amount: 65.8,
    value: 9750,
    price: 148.17,
    change24h: 5.8,
    allocation: 15,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Cardano",
    symbol: "ADA",
    amount: 5600,
    value: 3250,
    price: 0.58,
    change24h: -0.7,
    allocation: 5,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Dogecoin",
    symbol: "DOGE",
    amount: 25000,
    value: 3250,
    price: 0.13,
    change24h: 12.3,
    allocation: 5,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function PortfolioPage() {
  const [timeRange, setTimeRange] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const totalValue = portfolioTokens.reduce((sum, token) => sum + token.value, 0)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage your crypto investments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add Token
          </Button>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Portfolio Value</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  15.2%
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-6">${totalValue.toLocaleString()}</div>
            <Tabs value={timeRange} onValueChange={setTimeRange} className="mb-4">
              <TabsList>
                <TabsTrigger value="1d">1D</TabsTrigger>
                <TabsTrigger value="1w">1W</TabsTrigger>
                <TabsTrigger value="1m">1M</TabsTrigger>
                <TabsTrigger value="3m">3M</TabsTrigger>
                <TabsTrigger value="1y">1Y</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioValue}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Value"]} />
                  <Area type="monotone" dataKey="value" stroke="#6366F1" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {portfolioDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {portfolioDistribution.map((token) => (
                <div key={token.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{token.name}</span>
                    <span>{token.value}%</span>
                  </div>
                  <Progress value={token.value} className="h-2" indicatorClassName={`bg-[${token.color}]`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Asset</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">24h</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Value</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Allocation
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                {portfolioTokens.map((token) => (
                  <tr
                    key={token.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-800">
                          <Image src={token.image || "/placeholder.svg"} alt={token.name} width={32} height={32} />
                        </div>
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-medium">
                        ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className={token.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                        {token.change24h >= 0 ? "+" : ""}
                        {token.change24h}%
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-medium">
                        {token.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-medium">${token.value.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-medium">{token.allocation}%</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Buy More</DropdownMenuItem>
                          <DropdownMenuItem>Sell</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddTokenModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
