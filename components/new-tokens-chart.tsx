"use client"

import type { FrontendToken, TokensApiResponse } from "@/lib/types"
import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function NewTokensChart() {
  const [activeTab, setActiveTab] = useState("newTokens")
  const [tokens, setTokens] = useState<FrontendToken[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('/api/tokens', {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
        })

        if (response.ok) {
          const data: TokensApiResponse = await response.json()
          if (data.success && data.data) {
            setTokens(data.data)
          }
        }
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens() // Load only when component mounts
  }, [])

  // Generate real chart data from tokens
  const generateChartData = () => {
    const now = new Date()
    const chartData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      const newTokensCount = tokens.filter(token => {
        const created = new Date(token.created)
        return created >= dayStart && created <= dayEnd
      }).length

      const bondedTokensCount = tokens.filter(token => {
        if (!token.bonded) return false
        const bonded = new Date(token.bonded)
        return bonded >= dayStart && bonded <= dayEnd
      }).length

      chartData.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        newTokens: newTokensCount,
        bondedTokens: bondedTokensCount
      })
    }

    return chartData
  }

  const chartData = generateChartData()

  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading chart data...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex mb-4">
        <button
          className={`flex items-center mr-4 ${activeTab === "newTokens" ? "text-green-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("newTokens")}
        >
          <span
            className={`w-3 h-3 rounded-full mr-2 ${activeTab === "newTokens" ? "bg-green-500" : "bg-gray-300"}`}
          ></span>
          New Tokens
        </button>
        <button
          className={`flex items-center ${activeTab === "bondedTokens" ? "text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("bondedTokens")}
        >
          <span
            className={`w-3 h-3 rounded-full mr-2 ${activeTab === "bondedTokens" ? "bg-blue-500" : "bg-gray-300"}`}
          ></span>
          Bonded Tokens
        </button>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="newTokens"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={1000}
              hide={activeTab !== "newTokens"}
            />
            <Line
              type="monotone"
              dataKey="bondedTokens"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={1000}
              hide={activeTab !== "bondedTokens"}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
