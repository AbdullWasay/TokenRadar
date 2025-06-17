"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

// Mock data
const newTokensData = [
  { name: "Jan", newTokens: 40, onChainTokens: 24 },
  { name: "Feb", newTokens: 30, onChainTokens: 13 },
  { name: "Mar", newTokens: 20, onChainTokens: 8 },
  { name: "Apr", newTokens: 27, onChainTokens: 15 },
  { name: "May", newTokens: 18, onChainTokens: 12 },
  { name: "Jun", newTokens: 23, onChainTokens: 18 },
  { name: "Jul", newTokens: 34, onChainTokens: 24 },
  { name: "Aug", newTokens: 45, onChainTokens: 32 },
]

export default function NewTokensChart() {
  const [activeTab, setActiveTab] = useState("newTokens")

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
          className={`flex items-center ${activeTab === "onChainTokens" ? "text-red-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("onChainTokens")}
        >
          <span
            className={`w-3 h-3 rounded-full mr-2 ${activeTab === "onChainTokens" ? "bg-red-500" : "bg-gray-300"}`}
          ></span>
          On Chain Tokens
        </button>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={newTokensData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              dataKey="onChainTokens"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={1000}
              hide={activeTab !== "onChainTokens"}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
