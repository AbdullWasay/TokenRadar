"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AlertCircle, Bell } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Alert {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'price' | 'token' | 'system'
}

export default function NotificationsDropdown() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real alerts from API
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts?triggered=true&active=true')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            // Transform API alerts to notification format
            const notifications = data.data.slice(0, 5).map((alert: any) => ({
              id: alert._id,
              title: `${alert.alertType} Alert`,
              message: `${alert.tokenSymbol} ${alert.condition} ${alert.targetValue}`,
              time: new Date(alert.triggeredAt || alert.createdAt).toLocaleString(),
              read: false,
              type: alert.alertType
            }))
            setAlerts(notifications)
          } else {
            setAlerts([])
          }
        } else {
          setAlerts([])
        }
      } catch (error) {
        console.error('Error fetching alerts:', error)
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  return (
    <DropdownMenuContent align="end" className="w-80">
      <DropdownMenuLabel className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Notifications
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      <div className="max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Loading notifications...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No alerts or notifications</p>
            <p className="text-xs text-gray-400 mt-1">
              Set up price alerts to get notified
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <DropdownMenuItem key={alert.id} className="flex-col items-start p-3 cursor-pointer">
              <div className="flex items-start w-full">
                <div className={`mt-0.5 mr-3 flex-shrink-0 w-2 h-2 rounded-full ${alert.read ? "bg-gray-300" : "bg-blue-500"}`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{alert.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </div>

      {alerts.length > 0 && (
        <>
          <DropdownMenuSeparator />
          <div className="p-2 flex justify-center gap-4">
            <Button variant="link" size="sm" className="text-indigo-600 h-auto p-0 text-xs">
              Mark all as read
            </Button>
            <Button variant="link" size="sm" asChild className="text-indigo-600 h-auto p-0 text-xs">
              <Link href="/alerts">View all alerts</Link>
            </Button>
          </div>
        </>
      )}
    </DropdownMenuContent>
  )
}
