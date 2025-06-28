"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Alert, AlertsApiResponse } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { Bell, CheckCircle2, Clock, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function BondAlerts() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [bondAlerts, setBondAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBondAlerts = async () => {
    try {
      setIsRefreshing(true)
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/alerts?type=bond', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data: AlertsApiResponse = await response.json()
      if (data.success && data.data) {
        setBondAlerts(data.data)
      }
    } catch (error: any) {
      console.error('Error fetching bond alerts:', error)
    } finally {
      setIsRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBondAlerts()
  }, [])

  const handleRefresh = () => {
    fetchBondAlerts()
  }

  const getBondStatusBadge = (percentage: number) => {
    if (percentage === 100) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Bonded
        </Badge>
      )
    } else if (percentage >= 90) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Almost Bonded
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <Clock className="h-3 w-3 mr-1" />
          Bonding
        </Badge>
      )
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Bond Alerts</CardTitle>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRefresh}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : bondAlerts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No bond alerts found</p>
              <p className="text-sm mt-1">Create alerts to get notified when tokens reach bonding milestones</p>
            </div>
          ) : (
            bondAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-600 rounded-full mr-3 flex-shrink-0"></div>
                    <div>
                      <Link href={`/token/${alert.tokenId}`} className="font-medium hover:underline">
                        {alert.tokenName}
                      </Link>
                      <div className="text-sm text-muted-foreground">{alert.tokenSymbol}</div>
                      <div className="flex items-center mt-1">
                        <div className="text-xs text-muted-foreground">
                          Alert: {alert.condition} {alert.threshold}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${alert.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-3 text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/alerts">View all alerts</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
