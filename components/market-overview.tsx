"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowDown, ArrowUp, DollarSign, TrendingDown, TrendingUp } from "lucide-react"

// Mock data
const marketData = [
  { name: "Jan", btc: 40000, eth: 3000, sol: 150, total: 43150 },
  { name: "Feb", btc: 45000, eth: 3200, sol: 160, total: 48360 },
  { name: "Mar", btc: 42000, eth: 2800, sol: 140, total: 44940 },
  { name: "Apr", btc: 48000, eth: 3400, sol: 180, total: 51580 },
  { name: "May", btc: 52000, eth: 3600, sol: 200, total: 55800 },
  { name: "Jun", btc: 50000, eth: 3500, sol: 190, total: 53690 },
  { name: "Jul", btc: 55000, eth: 3800, sol: 220, total: 59020 },
]

const stats = [
  {
    name: "Market Cap",
    value: "$2.1T",
    change: 5.2,
    icon: DollarSign,
    color: "text-indigo-600",
  },
  {
    name: "24h Volume",
    value: "$82.5B",
    change: -3.1,
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    name: "BTC Dominance",
    value: "45.2%",
    change: 0.8,
    icon: TrendingDown,
    color: "text-red-500",
  },
]

export default function MarketOverview() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.name} className="space-y-1">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <stat.icon className={`h-4 w-4 mr-1 ${stat.color}`} />
                <span>{stat.name}</span>
              </div>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className={`flex items-center text-sm ${stat.change > 0 ? "text-green-500" : "text-red-500"}`}>
                {stat.change > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="total">
          <TabsList className="mb-4">
            <TabsTrigger value="total">Total Market</TabsTrigger>
            <TabsTrigger value="btc">Bitcoin</TabsTrigger>
            <TabsTrigger value="eth">Ethereum</TabsTrigger>
            <TabsTrigger value="sol">Solana</TabsTrigger>
          </TabsList>

          <TabsContent value="total" className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#6366F1" fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="btc" className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="btc" stroke="#F7931A" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="eth" className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="eth" stroke="#627EEA" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="sol" className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sol" stroke="#00FFA3" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
