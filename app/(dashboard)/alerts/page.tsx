"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Alert, AlertsApiResponse, FrontendToken, TokensApiResponse } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { Bell, BellOff, Clock, Edit, MoreHorizontal, Plus, RefreshCw, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

// Real data will be fetched from MongoDB via API

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("bond")
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState("price")
  const [selectedToken, setSelectedToken] = useState("")
  const [condition, setCondition] = useState("above")
  const [price, setPrice] = useState("")
  const [percentage, setPercentage] = useState("")
  const [timeframe, setTimeframe] = useState("1h")
  const [bondThreshold, setBondThreshold] = useState("90")

  // Real data state
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [tokens, setTokens] = useState<FrontendToken[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Fetch alerts from API
  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('Please log in to view alerts')
        return
      }

      const response = await fetch('/api/alerts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data: AlertsApiResponse = await response.json()
      if (data.success && data.data) {
        setAlerts(data.data)
      } else {
        setError(data.error || 'Failed to fetch alerts')
      }
    } catch (error: any) {
      setError('Failed to fetch alerts')
      console.error('Error fetching alerts:', error)
    }
  }

  // Fetch tokens for dropdown
  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/tokens')
      const data: TokensApiResponse = await response.json()
      if (data.success && data.data) {
        setTokens(data.data)
      }
    } catch (error: any) {
      console.error('Error fetching tokens:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchAlerts(), fetchTokens()])
      setLoading(false)
    }
    loadData()
  }, [])

  const handleCreateAlert = () => {
    // Here you would handle the alert creation
    setIsCreateAlertOpen(false)
    // Reset form
    setSelectedToken("")
    setCondition("above")
    setPrice("")
    setPercentage("")
    setTimeframe("1h")
    setBondThreshold("90")
    // Refresh alerts
    fetchAlerts()
  }

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setAlerts(alerts.filter(alert => alert.id !== alertId))
      }
    } catch (error: any) {
      console.error('Error deleting alert:', error)
    }
  }

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        setAlerts(alerts.map(alert =>
          alert.id === alertId ? { ...alert, isActive } : alert
        ))
      }
    } catch (error: any) {
      console.error('Error updating alert:', error)
    }
  }

  const handleEditAlert = (alert: Alert) => {
    setEditingAlert(alert)
    setIsEditModalOpen(true)
  }

  const handleUpdateAlert = async (alertId: string, updates: Partial<Alert>) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        setAlerts(alerts.map(alert =>
          alert.id === alertId ? { ...alert, ...updates } : alert
        ))
        setIsEditModalOpen(false)
        setEditingAlert(null)
      }
    } catch (error: any) {
      console.error('Error updating alert:', error)
    }
  }

  // Filter alerts by type
  const priceAlerts = alerts.filter(alert => alert.alertType === 'price')
  const percentageAlerts = alerts.filter(alert => alert.alertType === 'percentage')
  const bondAlerts = alerts.filter(alert => alert.alertType === 'bond')
  const recentAlerts = alerts.filter(alert => alert.isTriggered).slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-gray-500 dark:text-gray-400">Set up notifications for price movements and bond events</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setLoading(true)
              fetchAlerts()
            }}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateAlertOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Create Alert
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bond">Bond Alerts</TabsTrigger>
          <TabsTrigger value="price">Price Alerts</TabsTrigger>
          <TabsTrigger value="percentage">Percentage Alerts</TabsTrigger>
          <TabsTrigger value="recent">Recent Alerts</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "bond" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Bond Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
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
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">No bond alerts</h3>
                <p className="text-gray-500 dark:text-gray-400">Create alerts to get notified when tokens reach bonding milestones</p>
                <Button className="mt-4" onClick={() => setIsCreateAlertOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Alert
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Token
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Condition
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Threshold
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bondAlerts.map((alert) => (
                      <tr
                        key={alert.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-800">
                              <div className="w-full h-full bg-gray-600 rounded-full"></div>
                            </div>
                            <div>
                              <div className="font-medium">{alert.tokenName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{alert.tokenSymbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="capitalize">
                            {alert.condition}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">{alert.threshold}%</td>
                        <td className="py-4 px-4">{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                            />
                            <span className="ml-2">{alert.isActive ? "Active" : "Inactive"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditAlert(alert)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "price" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Price Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {priceAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">No price alerts</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Get notified when a token reaches a specific price
                </p>
                <Button onClick={() => setIsCreateAlertOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="mr-2 h-4 w-4" /> Create Alert
                </Button>
              </div>
            ) : (
              <>
                {/* Mobile Card Layout */}
                <div className="md:hidden space-y-4">
                  {priceAlerts.map((alert) => (
                    <div key={alert.id} className="bg-white dark:bg-gray-800 rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <div className="w-full h-full bg-gray-600 rounded-full"></div>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{alert.tokenSymbol}</div>
                            <div className="text-xs text-gray-500">{alert.tokenName}</div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditAlert(alert)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => handleDeleteAlert(alert.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Condition:</span>
                          <div className="font-medium capitalize">{alert.condition}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <div className="font-medium">${alert.threshold.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <div className="font-medium">{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <div className="flex items-center">
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                            />
                            <span className="ml-2 text-sm">{alert.isActive ? "Active" : "Inactive"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Token
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Condition
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceAlerts.map((alert) => (
                      <tr
                        key={alert.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-800">
                              <div className="w-full h-full bg-gray-600 rounded-full"></div>
                            </div>
                            <div>
                              <div className="font-medium">{alert.tokenName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{alert.tokenSymbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="capitalize">
                            {alert.condition}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">${alert.threshold.toLocaleString()}</td>
                        <td className="py-4 px-4">{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                            />
                            <span className="ml-2">{alert.isActive ? "Active" : "Inactive"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditAlert(alert)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "percentage" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Percentage Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {percentageAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">No percentage alerts</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Get notified when a token price changes by a certain percentage
                </p>
                <Button onClick={() => setIsCreateAlertOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="mr-2 h-4 w-4" /> Create Alert
                </Button>
              </div>
            ) : (
              <>
                {/* Mobile Card Layout */}
                <div className="md:hidden space-y-4">
                  {percentageAlerts.map((alert) => (
                    <div key={alert.id} className="bg-white dark:bg-gray-800 rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <div className="w-full h-full bg-gray-600 rounded-full"></div>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{alert.tokenSymbol}</div>
                            <div className="text-xs text-gray-500">{alert.tokenName}</div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditAlert(alert)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => handleDeleteAlert(alert.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Condition:</span>
                          <div className="font-medium capitalize">{alert.condition}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Percentage:</span>
                          <div className="font-medium">{(alert as any).percentage || alert.threshold}%</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Timeframe:</span>
                          <div className="font-medium">{alert.timeframe}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <div className="flex items-center">
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                            />
                            <span className="ml-2 text-sm">{alert.isActive ? "Active" : "Inactive"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Token
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Condition
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Percentage
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Timeframe
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {percentageAlerts.map((alert) => (
                      <tr
                        key={alert.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-800">
                              <div className="w-full h-full bg-gray-600 rounded-full"></div>
                            </div>
                            <div>
                              <div className="font-medium">{alert.tokenName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{alert.tokenSymbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="capitalize">
                            {alert.condition}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">{alert.threshold}%</td>
                        <td className="py-4 px-4">{alert.timeframe || 'N/A'}</td>
                        <td className="py-4 px-4">{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                            />
                            <span className="ml-2">{alert.isActive ? "Active" : "Inactive"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditAlert(alert)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "recent" && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Recent Alerts</CardTitle>
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentAlerts.length === 0 ? (
              <div className="text-center py-12">
                <BellOff className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">No recent alerts</h3>
                <p className="text-gray-500 dark:text-gray-400">You haven't received any alerts yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.read
                        ? "border-gray-200 dark:border-gray-800"
                        : "border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-900/20"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-800">
                        <div className="w-full h-full bg-gray-600 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {alert.tokenName} ({alert.tokenSymbol})
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Alert triggered: {alert.condition} {alert.threshold}
                              {alert.alertType === 'price' ? ' USD' : alert.alertType === 'percentage' ? '%' : '% bonded'}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {alert.triggeredAt ? formatDistanceToNow(new Date(alert.triggeredAt), { addSuffix: true }) : 'Recently'}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Alert Dialog */}
      <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Alert</DialogTitle>
            <DialogDescription>
              Set up a new alert to get notified about price movements or bond events.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="alert-type">Alert Type</Label>
              <Select value={alertType} onValueChange={setAlertType}>
                <SelectTrigger id="alert-type">
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bond">Bond Alert</SelectItem>
                  <SelectItem value="price">Price Alert</SelectItem>
                  <SelectItem value="percentage">Percentage Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="token">Token</Label>
              <Select value={selectedToken} onValueChange={setSelectedToken}>
                <SelectTrigger id="token">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                  <SelectItem value="sol">Solana (SOL)</SelectItem>
                  <SelectItem value="ada">Cardano (ADA)</SelectItem>
                  <SelectItem value="doge">Dogecoin (DOGE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {alertType === "bond" ? (
              <div className="grid gap-2">
                <Label htmlFor="bondThreshold">Bond Threshold (%)</Label>
                <Select value={bondThreshold} onValueChange={setBondThreshold}>
                  <SelectTrigger id="bondThreshold">
                    <SelectValue placeholder="Select bond threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100% (Fully Bonded)</SelectItem>
                    <SelectItem value="90">90% (Almost Bonded)</SelectItem>
                    <SelectItem value="75">75% (Bonding)</SelectItem>
                    <SelectItem value="50">50% (Halfway Bonded)</SelectItem>
                    <SelectItem value="25">25% (Early Stage)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : alertType === "price" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Price Above</SelectItem>
                      <SelectItem value="below">Price Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increases">Increases By</SelectItem>
                      <SelectItem value="decreases">Decreases By</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="percentage">Percentage (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    placeholder="Enter percentage"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger id="timeframe">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="24h">24 Hours</SelectItem>
                      <SelectItem value="7d">7 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateAlertOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAlert} className="bg-indigo-600 hover:bg-indigo-700">
              Create Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Alert Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Alert</DialogTitle>
            <DialogDescription>
              Update your alert settings for {editingAlert?.tokenName}
            </DialogDescription>
          </DialogHeader>
          {editingAlert && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-threshold">
                  {editingAlert.alertType === 'price' ? 'Price Threshold (USD)' :
                   editingAlert.alertType === 'percentage' ? 'Percentage Threshold (%)' :
                   'Bonding Threshold (%)'}
                </Label>
                <Input
                  id="edit-threshold"
                  type="number"
                  step="any"
                  defaultValue={editingAlert.threshold}
                  onChange={(e) => {
                    if (editingAlert) {
                      setEditingAlert({
                        ...editingAlert,
                        threshold: parseFloat(e.target.value) || 0
                      })
                    }
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editingAlert.isActive}
                  onCheckedChange={(checked) => {
                    if (editingAlert) {
                      setEditingAlert({
                        ...editingAlert,
                        isActive: checked
                      })
                    }
                  }}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingAlert) {
                  handleUpdateAlert(editingAlert.id, {
                    threshold: editingAlert.threshold,
                    isActive: editingAlert.isActive
                  })
                }
              }}
            >
              Update Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
