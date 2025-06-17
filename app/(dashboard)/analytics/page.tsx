"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { ArrowDown, ArrowUp, Calendar, Download } from "lucide-react"

// Mock data
const marketData = [
  { name: "Jan", tokens: 120, volume: 1200000, marketCap: 5000000 },
  { name: "Feb", tokens: 150, volume: 1500000, marketCap: 5500000 },
  { name: "Mar", tokens: 180, volume: 1800000, marketCap: 6000000 },
  { name: "Apr", tokens: 220, volume: 2200000, marketCap: 6500000 },
  { name: "May", tokens: 280, volume: 2800000, marketCap: 7000000 },
  { name: "Jun", tokens: 350, volume: 3500000, marketCap: 7500000 },
  { name: "Jul", tokens: 410, volume: 4100000, marketCap: 8000000 },
]

const tokenDistribution = [
  { name: "Bitcoin", value: 45 },
  { name: "Ethereum", value: 30 },
  { name: "Solana", value: 15 },
  { name: "Others", value: 10 },
]

const COLORS = ["#6366F1", "#8B5CF6", "#D946EF", "#EC4899"]

const tradingVolume = [
  { name: "Mon", buy: 4000, sell: 2400 },
  { name: "Tue", buy: 3000, sell: 1398 },
  { name: "Wed", buy: 2000, sell: 9800 },
  { name: "Thu", buy: 2780, sell: 3908 },
  { name: "Fri", buy: 1890, sell: 4800 },
  { name: "Sat", buy: 2390, sell: 3800 },
  { name: "Sun", buy: 3490, sell: 4300 },
]

const marketStats = [
  {
    title: "Total Market Cap",
    value: "$2.1T",
    change: 5.2,
    trend: "up",
  },
  {
    title: "24h Trading Volume",
    value: "$82.5B",
    change: -3.1,
    trend: "down",
  },
  {
    title: "Active Tokens",
    value: "12,345",
    change: 8.7,
    trend: "up",
  },
  {
    title: "New Tokens (24h)",
    value: "127",
    change: 12.3,
    trend: "up",
  },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Comprehensive market data and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7d" onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className={`flex items-center ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.trend === "up" ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{Math.abs(stat.change)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="tokens">Token Analysis</TabsTrigger>
          <TabsTrigger value="trading">Trading Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Cap Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData}>
                  <defs>
                    <linearGradient id="colorMarketCap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="marketCap"
                    stroke="#6366F1"
                    fillOpacity={1}
                    fill="url(#colorMarketCap)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>New Tokens</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tokens" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Volume</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#D946EF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tokenDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {tokenDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      { name: "Bitcoin", value: 15.2 },
                      { name: "Ethereum", value: 12.8 },
                      { name: "Solana", value: 25.6 },
                      { name: "Cardano", value: 8.3 },
                      { name: "Dogecoin", value: 18.7 },
                    ]}
                    margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buy vs Sell Volume</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradingVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="buy" fill="#10B981" />
                  <Bar dataKey="sell" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
