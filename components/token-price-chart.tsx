"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

// Mock data
const chartData = {
  "1h": [
    { time: "00:00", price: 0.00052 },
    { time: "00:10", price: 0.00053 },
    { time: "00:20", price: 0.00051 },
    { time: "00:30", price: 0.00054 },
    { time: "00:40", price: 0.00055 },
    { time: "00:50", price: 0.00053 },
    { time: "01:00", price: 0.00052 },
  ],
  "24h": [
    { time: "00:00", price: 0.00048 },
    { time: "04:00", price: 0.0005 },
    { time: "08:00", price: 0.00049 },
    { time: "12:00", price: 0.00051 },
    { time: "16:00", price: 0.00053 },
    { time: "20:00", price: 0.00052 },
    { time: "24:00", price: 0.00052 },
  ],
  "7d": [
    { time: "Day 1", price: 0.00045 },
    { time: "Day 2", price: 0.00047 },
    { time: "Day 3", price: 0.00049 },
    { time: "Day 4", price: 0.00048 },
    { time: "Day 5", price: 0.0005 },
    { time: "Day 6", price: 0.00051 },
    { time: "Day 7", price: 0.00052 },
  ],
}

export default function TokenPriceChart() {
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d">("24h")

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button
          variant={timeRange === "1h" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("1h")}
          className={timeRange === "1h" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
        >
          1h
        </Button>
        <Button
          variant={timeRange === "24h" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("24h")}
          className={timeRange === "24h" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
        >
          24h
        </Button>
        <Button
          variant={timeRange === "7d" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("7d")}
          className={timeRange === "7d" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
        >
          7d
        </Button>
      </div>

      <div className="h-[300px] bg-white dark:bg-gray-900">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData[timeRange]} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} tickFormatter={(value) => value.toFixed(5)} />
            <Tooltip
              formatter={(value: number) => [value.toFixed(8), "Price"]}
              labelFormatter={(label) => `Time: ${label}`}
              contentStyle={{ backgroundColor: "white", borderColor: "#e2e8f0" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#6D28D9"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
