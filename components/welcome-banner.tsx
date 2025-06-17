"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function WelcomeBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Welcome to Rader!</h2>
            <p className="text-indigo-100 max-w-2xl">
              Track your favorite tokens, set up alerts, and stay ahead of the market with real-time data and analytics.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
              Take Tour
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDismissed(true)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
